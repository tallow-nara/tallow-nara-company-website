import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ResendVerification } from '@/components/account/ResendVerification'
import { CheckoutClient } from '@/components/shop/CheckoutClient'
import { getProducts } from '@/lib/content'
import { getCurrentCustomer } from '@/lib/customers/session'
import { toCartProduct } from '@/lib/shop-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Checkout', robots: { index: false } }

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/masuk?lanjut=/checkout')

  if (!customer.verified) {
    return (
      <div className="page-shell flex-1 pb-24 pt-12 sm:pt-16">
        <h1 className="display">Verifikasi email dulu</h1>
        <p className="mt-4 max-w-xl text-muted">
          Kami mengirim tautan verifikasi ke {customer.email}. Setelah Anda membukanya, muat ulang halaman ini
          untuk melanjutkan pesanan. Isi keranjang Anda tetap tersimpan.
        </p>
        <ResendVerification />
      </div>
    )
  }

  const products = await getProducts()
  return (
    <CheckoutClient
      products={products.map(toCartProduct)}
      account={{ name: customer.name, email: customer.email, phone: customer.phone }}
    />
  )
}
