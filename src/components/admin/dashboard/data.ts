import type { Payload } from 'payload'

import type { Order, Product } from '@/payload-types'
import type { OrderStatus } from '@/lib/orders/status'

const SOLD_STATUSES: OrderStatus[] = ['dibayar', 'dikemas', 'dikirim', 'selesai']
const TIME_ZONE = 'Asia/Jakarta'
const CHART_MONTHS = 6

const monthKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit' })
const monthShort = new Intl.DateTimeFormat('id-ID', { timeZone: TIME_ZONE, month: 'short' })
const monthLong = new Intl.DateTimeFormat('id-ID', { timeZone: TIME_ZONE, month: 'long', year: 'numeric' })

const monthKey = (date: Date) => monthKeyFormat.format(date).slice(0, 7)

function startOfMonth(now: Date, offset: number): Date {
  const [year, month] = monthKey(now).split('-').map(Number)
  return new Date(Date.UTC(year, month - 1 + offset, 1, -7))
}

export type Trend = { current: number; previous: number }

type RecentOrder = Pick<Order, 'id' | 'code' | 'customerName' | 'items' | 'total' | 'status' | 'createdAt'>

type Section<T> = { ok: true; value: T } | { ok: false }

async function attempt<T>(run: () => Promise<T>): Promise<Section<T>> {
  try {
    return { ok: true, value: await run() }
  } catch (error) {
    console.error('[dasbor admin]', error)
    return { ok: false }
  }
}

async function loadSales(payload: Payload, now: Date) {
  const since = startOfMonth(now, -(CHART_MONTHS - 1))
  const { docs } = await payload.find({
    collection: 'orders',
    where: { and: [{ status: { in: SOLD_STATUSES } }, { paidAt: { greater_than_equal: since.toISOString() } }] },
    select: { total: true, paidAt: true, items: true },
    pagination: false,
    depth: 0,
  })

  const thisMonth = monthKey(now)
  const lastMonth = monthKey(startOfMonth(now, -1))
  const byMonth = new Map<string, { revenue: number; orders: number }>()
  const soldThisMonth = new Map<number, number>()

  for (const order of docs) {
    if (!order.paidAt) continue
    const key = monthKey(new Date(order.paidAt))
    const bucket = byMonth.get(key) ?? { revenue: 0, orders: 0 }
    bucket.revenue += order.total ?? 0
    bucket.orders += 1
    byMonth.set(key, bucket)
    if (key === thisMonth) {
      for (const item of order.items ?? []) {
        soldThisMonth.set(item.productId, (soldThisMonth.get(item.productId) ?? 0) + item.quantity)
      }
    }
  }

  const chart = Array.from({ length: CHART_MONTHS }, (_, index) => {
    const start = startOfMonth(now, index - (CHART_MONTHS - 1))
    const mid = new Date(start.getTime() + 15 * 24 * 60 * 60 * 1000)
    const key = monthKey(mid)
    return { key, label: monthShort.format(mid), fullLabel: monthLong.format(mid), value: byMonth.get(key)?.revenue ?? 0 }
  })

  const pick = (key: string) => byMonth.get(key) ?? { revenue: 0, orders: 0 }
  return {
    chart,
    soldThisMonth,
    revenue: { current: pick(thisMonth).revenue, previous: pick(lastMonth).revenue },
    paidOrders: { current: pick(thisMonth).orders, previous: pick(lastMonth).orders },
  }
}

async function loadNewCustomers(payload: Payload, now: Date): Promise<Trend> {
  const thisStart = startOfMonth(now, 0).toISOString()
  const lastStart = startOfMonth(now, -1).toISOString()
  const [current, previous] = await Promise.all([
    payload.count({ collection: 'customers', where: { createdAt: { greater_than_equal: thisStart } } }),
    payload.count({
      collection: 'customers',
      where: { and: [{ createdAt: { greater_than_equal: lastStart } }, { createdAt: { less_than: thisStart } }] },
    }),
  ])
  return { current: current.totalDocs, previous: previous.totalDocs }
}

async function loadProducts(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'products',
    select: { name: true, stock: true, isVisible: true, sortOrder: true },
    sort: 'sortOrder',
    pagination: false,
    depth: 0,
  })
  return docs as Pick<Product, 'id' | 'name' | 'stock' | 'isVisible'>[]
}

async function loadRecentOrders(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'orders',
    sort: '-createdAt',
    limit: 6,
    depth: 0,
    select: { code: true, customerName: true, items: true, total: true, status: true, createdAt: true },
  })
  return docs as RecentOrder[]
}

async function loadPendingReviews(payload: Payload) {
  const result = await payload.find({
    collection: 'reviews',
    where: { status: { equals: 'menunggu' } },
    sort: '-createdAt',
    limit: 4,
    depth: 1,
    select: { authorName: true, body: true, rating: true, createdAt: true, product: true },
  })
  return {
    total: result.totalDocs,
    docs: result.docs.map((review) => ({
      id: review.id,
      authorName: review.authorName,
      body: review.body,
      rating: review.rating,
      createdAt: review.createdAt,
      productName: typeof review.product === 'object' && review.product ? review.product.name : undefined,
    })),
  }
}

export async function loadDashboard(payload: Payload, now = new Date()) {
  const [sales, customers, products, toPack, recentOrders, reviews] = await Promise.all([
    attempt(() => loadSales(payload, now)),
    attempt(() => loadNewCustomers(payload, now)),
    attempt(() => loadProducts(payload)),
    attempt(async () => (await payload.count({ collection: 'orders', where: { status: { equals: 'dibayar' } } })).totalDocs),
    attempt(() => loadRecentOrders(payload)),
    attempt(() => loadPendingReviews(payload)),
  ])

  const productRows =
    products.ok && sales.ok
      ? products.value
          .map((product) => ({
            id: product.id,
            name: product.name,
            stock: product.stock ?? 0,
            isVisible: product.isVisible !== false,
            sold: sales.value.soldThisMonth.get(product.id) ?? 0,
          }))
          .sort((a, b) => b.sold - a.sold)
      : undefined

  return {
    now: now.getTime(),
    monthLabel: monthLong.format(now),
    sales: sales.ok ? sales.value : undefined,
    newCustomers: customers.ok ? customers.value : undefined,
    toPack: toPack.ok ? toPack.value : undefined,
    products: productRows,
    recentOrders: recentOrders.ok ? recentOrders.value : undefined,
    reviews: reviews.ok ? reviews.value : undefined,
  }
}

export type LoadedDashboard = Awaited<ReturnType<typeof loadDashboard>>
