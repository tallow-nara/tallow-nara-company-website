import type { Payload, TypedUser } from 'payload'
import type { ReactNode } from 'react'

import { formatRupiah } from '@/lib/money'
import { STATUS_LABELS, type OrderStatus } from '@/lib/orders/status'

import { loadDashboard, type Trend } from './data'
import {
  IconAlert,
  IconArrowDown,
  IconArrowUp,
  IconBag,
  IconBox,
  IconChevronRight,
  IconExternal,
  IconHelp,
  IconHome,
  IconImages,
  IconInfo,
  IconPlus,
  IconUsers,
  IconWallet,
} from './icons'
import { RevenueChart } from './RevenueChart'

import './dashboard.css'

type Props = { payload: Payload; user?: TypedUser | null }

const LOW_STOCK = 5
const relative = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' })
const dateShort = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short' })

function timeAgo(iso: string, now: number): string {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60_000)
  if (minutes > -60) return relative.format(Math.min(minutes, -1), 'minute')
  const hours = Math.round(minutes / 60)
  if (hours > -24) return relative.format(hours, 'hour')
  const days = Math.round(hours / 24)
  if (days > -7) return relative.format(days, 'day')
  return dateShort.format(new Date(iso))
}

function TrendNote({ trend, unit }: { trend: Trend; unit: 'rupiah' | 'count' }) {
  const { current, previous } = trend
  if (previous === 0) {
    return <span className="tln-trend">{current === 0 ? 'Belum ada data' : 'Bulan lalu belum ada'}</span>
  }
  const change = Math.round(((current - previous) / previous) * 100)
  const up = change >= 0
  const prevText = unit === 'rupiah' ? formatRupiah(previous) : previous.toLocaleString('id-ID')
  return (
    <span className="tln-trend">
      <span className={up ? 'tln-trend__up' : 'tln-trend__down'}>
        {up ? <IconArrowUp /> : <IconArrowDown />}
        {up ? 'Naik' : 'Turun'} {Math.abs(change)}%
      </span>
      <span>dari bulan lalu ({prevText})</span>
    </span>
  )
}

function StatCard(props: {
  href: string
  label: string
  value: ReactNode
  note: ReactNode
  icon: ReactNode
  tone: 'blue' | 'green' | 'teal' | 'amber'
}) {
  return (
    <a className="tln-stat" href={props.href}>
      <span className="tln-stat__text">
        <span className="tln-stat__label">{props.label}</span>
        <span className="tln-stat__value">{props.value}</span>
        <span className="tln-stat__note">{props.note}</span>
      </span>
      <span className={`tln-stat__icon tln-tone-${props.tone}`}>{props.icon}</span>
    </a>
  )
}

function Panel(props: { title: string; action?: ReactNode; children: ReactNode; className?: string; tone?: 'blue' }) {
  const id = `panel-${props.title.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <section className={`tln-panel ${props.className ?? ''}`} aria-labelledby={id}>
      <header className={`tln-panel__head ${props.tone === 'blue' ? 'tln-panel__head--blue' : ''}`}>
        <h2 id={id}>{props.title}</h2>
        {props.action}
      </header>
      {props.children}
    </section>
  )
}

function Unavailable() {
  return (
    <p className="tln-state tln-state--error" role="status">
      <IconAlert /> Data ini gagal dimuat. Muat ulang halaman untuk mencoba lagi.
    </p>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`tln-status tln-status--${status}`}>{STATUS_LABELS[status] ?? status}</span>
}

export async function Dashboard({ payload, user }: Props) {
  const admin = payload.config.routes.admin
  const data = await loadDashboard(payload)
  const { now } = data
  const name = user && 'name' in user && user.name ? String(user.name) : undefined
  const ordersUrl = `${admin}/collections/orders`
  const maxSold = Math.max(1, ...(data.products ?? []).map((p) => p.sold))
  const pendingReviews = data.reviews?.total ?? 0

  return (
    <div className="tln-dash">
      <div className="tln-dash__top">
        <div>
          <h1 className="tln-dash__title">Dasbor</h1>
          <p className="tln-dash__lead">
            {name ? `Halo, ${name}. ` : ''}Ringkasan toko bulan {data.monthLabel}.
          </p>
        </div>
        <div className="tln-dash__actions">
          <a className="tln-btn tln-btn--ghost" href="/" target="_blank" rel="noreferrer">
            <IconExternal /> Lihat website
          </a>
          <a className="tln-btn tln-btn--primary" href={`${admin}/collections/products/create`}>
            <IconPlus /> Tambah produk
          </a>
        </div>
      </div>

      <div className="tln-stats">
        <StatCard
          href={ordersUrl}
          label="Pendapatan bulan ini"
          value={data.sales ? formatRupiah(data.sales.revenue.current) : '–'}
          note={data.sales ? <TrendNote trend={data.sales.revenue} unit="rupiah" /> : 'Gagal dimuat'}
          icon={<IconWallet />}
          tone="blue"
        />
        <StatCard
          href={ordersUrl}
          label="Pesanan dibayar"
          value={data.sales ? data.sales.paidOrders.current.toLocaleString('id-ID') : '–'}
          note={data.sales ? <TrendNote trend={data.sales.paidOrders} unit="count" /> : 'Gagal dimuat'}
          icon={<IconBag />}
          tone="green"
        />
        <StatCard
          href={`${admin}/collections/customers`}
          label="Pelanggan baru"
          value={data.newCustomers ? data.newCustomers.current.toLocaleString('id-ID') : '–'}
          note={data.newCustomers ? <TrendNote trend={data.newCustomers} unit="count" /> : 'Gagal dimuat'}
          icon={<IconUsers />}
          tone="teal"
        />
        <StatCard
          href={`${ordersUrl}?where[status][equals]=dibayar`}
          label="Siap dikemas"
          value={data.toPack !== undefined ? data.toPack.toLocaleString('id-ID') : '–'}
          note={
            data.toPack === undefined
              ? 'Gagal dimuat'
              : data.toPack > 0
                ? 'Sudah dibayar, segera kemas'
                : 'Semua pesanan sudah dikemas'
          }
          icon={<IconBox />}
          tone="amber"
        />
      </div>

      <div className="tln-row">
        <Panel title="Pendapatan 6 bulan terakhir" className="tln-row__wide">
          {data.sales ? (
            <>
              <RevenueChart data={data.sales.chart} />
              {data.sales.chart.every((point) => point.value === 0) && (
                <p className="tln-state">Belum ada pembayaran yang masuk dalam 6 bulan ini.</p>
              )}
            </>
          ) : (
            <Unavailable />
          )}
        </Panel>

        <Panel
          title="Produk terjual bulan ini"
          action={
            <a className="tln-link" href={`${admin}/collections/products`}>
              Kelola produk <IconChevronRight />
            </a>
          }
        >
          {!data.products ? (
            <Unavailable />
          ) : data.products.length === 0 ? (
            <div className="tln-state">
              <p>Belum ada produk.</p>
              <a className="tln-btn tln-btn--ghost" href={`${admin}/collections/products/create`}>
                <IconPlus /> Tambah produk
              </a>
            </div>
          ) : (
            <ul className="tln-products">
              {data.products.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <a href={`${admin}/collections/products/${product.id}`} className="tln-products__row">
                    <span className="tln-products__name">
                      {product.name}
                      {!product.isVisible && <span className="tln-chip">Disembunyikan</span>}
                    </span>
                    <span className="tln-products__meta">
                      {product.sold} terjual ·{' '}
                      {product.stock <= LOW_STOCK ? (
                        <span className="tln-products__low">
                          <IconAlert /> stok {product.stock}
                        </span>
                      ) : (
                        `stok ${product.stock}`
                      )}
                    </span>
                    <span className="tln-bar" aria-hidden="true">
                      <span style={{ width: `${(product.sold / maxSold) * 100}%` }} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="tln-row tln-row--top">
        <Panel
          title="Pesanan terbaru"
          className="tln-row__wide"
          action={
            <a className="tln-link" href={ordersUrl}>
              Semua pesanan <IconChevronRight />
            </a>
          }
        >
          {!data.recentOrders ? (
            <Unavailable />
          ) : data.recentOrders.length === 0 ? (
            <p className="tln-state">Belum ada pesanan. Pesanan baru muncul di sini begitu pembeli checkout.</p>
          ) : (
            <div className="tln-table-wrap">
              <table className="tln-table">
                <thead>
                  <tr>
                    <th scope="col">Kode</th>
                    <th scope="col">Pelanggan</th>
                    <th scope="col">Produk</th>
                    <th scope="col" className="tln-num">
                      Total
                    </th>
                    <th scope="col">Status</th>
                    <th scope="col">
                      <span className="tln-sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => {
                    const [first, ...rest] = order.items ?? []
                    return (
                      <tr key={order.id}>
                        <td>
                          <a className="tln-code" href={`${ordersUrl}/${order.id}`}>
                            {order.code}
                          </a>
                          <span className="tln-sub">{timeAgo(order.createdAt, now)}</span>
                        </td>
                        <td>{order.customerName}</td>
                        <td>
                          {first ? `${first.name} ×${first.quantity}` : '–'}
                          {rest.length > 0 && <span className="tln-sub">+{rest.length} produk lain</span>}
                        </td>
                        <td className="tln-num">{formatRupiah(order.total)}</td>
                        <td>
                          <StatusBadge status={order.status} />
                        </td>
                        <td>
                          <a className="tln-btn tln-btn--small" href={`${ordersUrl}/${order.id}`}>
                            Buka<span className="tln-sr-only"> pesanan {order.code}</span>
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="tln-stack">
          <Panel
            title="Ulasan menunggu persetujuan"
            tone="blue"
            action={pendingReviews > 0 ? <span className="tln-count">{pendingReviews}</span> : undefined}
          >
            {!data.reviews ? (
              <Unavailable />
            ) : data.reviews.docs.length === 0 ? (
              <p className="tln-state">Tidak ada ulasan baru. Ulasan dari pembeli muncul di sini sebelum tampil di website.</p>
            ) : (
              <>
                <ul className="tln-reviews">
                  {data.reviews.docs.map((review) => (
                    <li key={review.id}>
                      <a href={`${admin}/collections/reviews/${review.id}`}>
                        <span className="tln-reviews__body">{review.body}</span>
                        <span className="tln-sub">
                          {review.authorName} · nilai {review.rating}/5
                          {review.productName ? ` · ${review.productName}` : ''} · {timeAgo(review.createdAt, now)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a className="tln-link tln-link--foot" href={`${admin}/collections/reviews?where[status][equals]=menunggu`}>
                  Periksa semua ulasan <IconChevronRight />
                </a>
              </>
            )}
          </Panel>

          <Panel title="Pintasan konten">
            <ul className="tln-shortcuts">
              <li>
                <a href={`${admin}/globals/home`}>
                  <IconHome /> Beranda
                </a>
              </li>
              <li>
                <a href={`${admin}/collections/achievements/create`}>
                  <IconImages /> Album baru
                </a>
              </li>
              <li>
                <a href={`${admin}/globals/about`}>
                  <IconInfo /> Tentang kami
                </a>
              </li>
              <li>
                <a href={`${admin}/collections/faqs`}>
                  <IconHelp /> FAQ
                </a>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
