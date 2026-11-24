import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/account/LogoutButton'
import { ResendVerification } from '@/components/account/ResendVerification'
import { formatDateTime } from '@/components/shop/OrderDetails'
import { getCurrentCustomer } from '@/lib/customers/session'
import { formatRupiah } from '@/lib/money'
import { getOrdersForCustomer } from '@/lib/orders/queries'
import { STATUS_LABELS } from '@/lib/orders/status'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Akun saya', robots: { index: false } }

export default async function AccountPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/masuk?lanjut=/akun')

  const orders = await getOrdersForCustomer(customer.id).catch(() => null)

  return (
    <div className="page-shell flex-1 pb-24 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Akun saya</p>
          <h1 className="display mt-4">Halo, {customer.name.split(' ')[0]}</h1>
        </div>
        <LogoutButton />
      </div>

      <dl className="panel-white mt-10 grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
        <div>
          <dt className="text-sm text-muted">Nama</dt>
          <dd className="mt-1 font-semibold">{customer.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="mt-1 break-all font-semibold">{customer.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Nomor WhatsApp</dt>
          <dd className="mt-1 font-semibold">{customer.phone ?? '-'}</dd>
        </div>
      </dl>

      {!customer.verified && (
        <section aria-labelledby="judul-verifikasi" className="mt-6 rounded-[var(--radius-md)] border border-warning/40 bg-white/70 p-6">
          <h2 id="judul-verifikasi" className="font-sans text-lg font-semibold tracking-normal text-ink">
            Verifikasi email Anda
          </h2>
          <p className="mt-1 max-w-xl text-muted">
            Kami mengirim tautan ke {customer.email}. Pesanan baru bisa dibuat setelah email terverifikasi.
          </p>
          <ResendVerification />
        </section>
      )}

      <section aria-labelledby="judul-riwayat" className="mt-16">
        <h2 id="judul-riwayat" className="section-title">
          Riwayat pesanan
        </h2>
        {orders === null ? (
          <p role="alert" className="field-error mt-6">
            Riwayat belum bisa dimuat. Muat ulang halaman ini beberapa saat lagi.
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-6">
            <p className="text-muted">Anda belum punya pesanan.</p>
            <Link href="/produk" className="btn btn-primary mt-6">
              Lihat produk
            </Link>
          </div>
        ) : (
          <ul className="mt-6">
            {orders.map((order) => (
              <li key={order.code} className="grid gap-2 border-t border-stone py-6 sm:grid-cols-5 sm:items-center">
                <p className="tabular font-serif text-2xl text-olive-deep">{order.code}</p>
                <p className="text-muted">{formatDateTime(order.createdAt)}</p>
                <p className="font-semibold">{STATUS_LABELS[order.status]}</p>
                <p className="tabular">{formatRupiah(order.total)}</p>
                <p className="sm:text-right">
                  <Link href={`/pesanan/${order.code}`} className="link-arrow">
                    Lihat rincian
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-base text-muted">
          Punya pesanan lama yang dibuat tanpa akun?{' '}
          <Link href="/lacak" className="underline">
            Lacak dengan kode pesanan
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
