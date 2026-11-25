'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'

import { isMockPayment } from './integrations/payment'
import { midtransSignature } from './integrations/payment/midtrans-signature'
import { MOCK_SERVER_KEY, createMockPaymentAdapter } from './integrations/payment/mock'
import { getShippingAdapter } from './integrations/shipping'
import type { ShippingArea, ShippingRate } from './integrations/shipping/types'
import { getCurrentCustomer } from './customers/session'
import { getOrderByToken, trackOrder } from './orders/queries'
import { priceItems } from './orders/pricing'
import { checkoutSchema } from './orders/schema'
import { applyPaymentNotification, createOrder, type CreateOrderResult } from './orders/service'
import type { PublicOrder } from './shop-types'

export async function searchAreasAction(
  query: string,
): Promise<{ ok: true; areas: ShippingArea[] } | { ok: false }> {
  try {
    return { ok: true, areas: await getShippingAdapter().searchAreas(query.slice(0, 80)) }
  } catch (error) {
    console.error('Pencarian area gagal', error)
    return { ok: false }
  }
}

const rateRequestSchema = z.object({
  areaId: z.string().min(1),
  items: z
    .array(z.object({ productId: z.number().int(), variantId: z.string().max(40).optional(), quantity: z.number().int() }))
    .min(1),
})

export async function getRatesAction(
  input: z.infer<typeof rateRequestSchema>,
): Promise<{ ok: true; rates: ShippingRate[] } | { ok: false; message: string }> {
  const parsed = rateRequestSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Data pengiriman belum lengkap.' }

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: { id: { in: parsed.data.items.map((item) => item.productId) } },
      pagination: false,
      depth: 0,
    })
    const priced = priceItems(
      parsed.data.items,
      docs.map((doc) => ({
        ...doc,
        price: doc.price ?? 0,
        weightGrams: doc.weightGrams ?? 0,
        stock: doc.stock ?? 0,
        isVisible: doc.isVisible ?? false,
      })),
    )
    if (!priced.ok) return priced

    const rates = await getShippingAdapter().getRates({
      destinationAreaId: parsed.data.areaId,
      weightGrams: priced.totalWeightGrams,
      itemValue: priced.subtotal,
    })
    return { ok: true, rates }
  } catch (error) {
    console.error('Ongkir gagal dimuat', error)
    return { ok: false, message: 'Ongkir belum bisa dimuat.' }
  }
}

export async function placeOrderAction(input: unknown): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Periksa kembali data Anda.' }
  }
  const customer = await getCurrentCustomer()
  if (!customer) return { ok: false, message: 'Masuk dulu untuk membuat pesanan. Isi keranjang Anda tetap tersimpan.' }
  if (!customer.verified) {
    return { ok: false, message: 'Verifikasi email Anda dulu. Kami sudah mengirim tautannya; buka halaman Akun untuk mengirim ulang.' }
  }
  try {
    return await createOrder(parsed.data, { id: customer.id, email: customer.email })
  } catch (error) {
    console.error('Pesanan gagal dibuat', error)
    return { ok: false, message: 'Pesanan belum bisa dibuat. Data Anda aman, silakan coba lagi.' }
  }
}

export async function simulatePaymentAction(code: string, token: string): Promise<{ ok: boolean }> {
  if (!isMockPayment()) return { ok: false }
  const order = await getOrderByToken(code, token)
  if (!order) return { ok: false }

  const body = {
    order_id: code,
    status_code: '200',
    gross_amount: `${order.total}.00`,
    transaction_id: `simulasi-${code}`,
    transaction_status: 'settlement',
    signature_key: midtransSignature(code, '200', `${order.total}.00`, MOCK_SERVER_KEY),
  }
  const notification = createMockPaymentAdapter().parseNotification(body)
  if (!notification) return { ok: false }
  await applyPaymentNotification(notification, 'mock')
  return { ok: true }
}

export type TrackState = { status: 'idle' | 'not_found' | 'error' | 'found'; order?: PublicOrder }

const trackSchema = z.object({
  code: z.string().trim().min(6),
  lastFour: z.string().regex(/^\d{4}$/),
})

export async function trackOrderAction(_previous: TrackState, formData: FormData): Promise<TrackState> {
  const parsed = trackSchema.safeParse({ code: formData.get('code'), lastFour: formData.get('lastFour') })
  if (!parsed.success) return { status: 'not_found' }
  try {
    const order = await trackOrder(parsed.data.code, parsed.data.lastFour)
    return order ? { status: 'found', order } : { status: 'not_found' }
  } catch (error) {
    console.error('Lacak pesanan gagal', error)
    return { status: 'error' }
  }
}

const reviewSchema = z.object({
  productId: z.number().int().positive(),
  authorName: z.string().trim().min(2, 'Isi nama Anda, minimal 2 huruf.').max(80),
  rating: z.number().int().min(1, 'Pilih nilai 1 sampai 5.').max(5, 'Pilih nilai 1 sampai 5.'),
  body: z.string().trim().min(10, 'Tulis ulasan minimal 10 huruf.').max(1000, 'Ulasan maksimal 1.000 huruf.'),
  website: z.string().max(0),
})

export type ReviewResult = { ok: true } | { ok: false; errors: Record<string, string> }

export async function submitReviewAction(input: unknown): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      errors: Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
    }
  }
  try {
    const payload = await getPayload({ config })
    const { productId, authorName, rating, body } = parsed.data
    await payload.create({
      collection: 'reviews',
      data: { product: productId, authorName, rating, body, status: 'menunggu' },
    })
    return { ok: true }
  } catch (error) {
    console.error('Ulasan gagal disimpan', error)
    return { ok: false, errors: { form: 'Ulasan belum bisa dikirim. Coba lagi beberapa saat.' } }
  }
}
