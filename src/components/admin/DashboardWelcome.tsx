import type { Payload, TypedUser } from 'payload'

import './dashboard-welcome.css'

type Props = { payload: Payload; user?: TypedUser | null }

type Shortcut = { href: string; title: string; body: string; count?: number; external?: boolean }

async function safeCount(run: () => Promise<{ totalDocs: number }>): Promise<number | undefined> {
  try {
    return (await run()).totalDocs
  } catch {
    return undefined
  }
}

function ShortcutCard({ href, title, body, count, external }: Shortcut) {
  return (
    <li>
      <a
        className="tln-card"
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        <span className="tln-card__title">
          {title}
          {count !== undefined && count > 0 && <span className="tln-badge">{count}</span>}
        </span>
        <span className="tln-card__body">{body}</span>
      </a>
    </li>
  )
}

/** Panel sambutan di atas dashboard admin: pintasan ke tugas yang paling sering dilakukan. */
export async function DashboardWelcome({ payload, user }: Props) {
  const adminRoute = payload.config.routes.admin
  const [toPack, pendingReviews, albums, customers] = await Promise.all([
    safeCount(() => payload.count({ collection: 'orders', where: { status: { equals: 'dibayar' } } })),
    safeCount(() => payload.count({ collection: 'reviews', where: { status: { equals: 'menunggu' } } })),
    safeCount(() => payload.count({ collection: 'achievements' })),
    safeCount(() => payload.count({ collection: 'customers' })),
  ])

  const shop: Shortcut[] = [
    {
      href: `${adminRoute}/collections/orders?where[status][equals]=dibayar`,
      title: 'Pesanan siap dikemas',
      body: toPack ? `${toPack} pesanan sudah dibayar dan menunggu dikemas.` : 'Belum ada pesanan baru yang dibayar.',
      count: toPack,
    },
    {
      href: `${adminRoute}/collections/reviews?where[status][equals]=menunggu`,
      title: 'Ulasan menunggu persetujuan',
      body: 'Ulasan baru tampil di website setelah Anda setujui.',
      count: pendingReviews,
    },
    {
      href: `${adminRoute}/collections/customers`,
      title: 'Pelanggan',
      body: customers ? `${customers} akun pembeli terdaftar.` : 'Belum ada pembeli yang mendaftar.',
    },
    { href: `${adminRoute}/collections/products`, title: 'Produk dan stok', body: 'Ubah harga, stok, foto, dan deskripsi produk.' },
  ]

  const content: Shortcut[] = [
    {
      href: `${adminRoute}/collections/achievements/create`,
      title: 'Tambah album galeri',
      body: albums ? `Saat ini ada ${albums} album. Unggah beberapa foto sekaligus.` : 'Unggah foto lomba, pameran, atau kegiatan.',
    },
    { href: `${adminRoute}/globals/home`, title: 'Ubah isi beranda', body: 'Judul besar, foto pembuka, cerita, proses, dan layanan.' },
    { href: `${adminRoute}/globals/about`, title: 'Ubah Tentang kami', body: 'Cerita merek, visi-misi, bahan baku, dan tim.' },
    { href: `${adminRoute}/globals/gallery-page`, title: 'Atur halaman galeri', body: 'Judul dan pengantar di atas album.' },
    { href: `${adminRoute}/collections/faqs`, title: 'Kelola FAQ', body: 'Pertanyaan yang sering diajukan pembeli.' },
    { href: '/', title: 'Lihat website', body: 'Buka tallownara.com di tab baru untuk memeriksa hasilnya.', external: true },
  ]

  return (
    <section className="tln-welcome" aria-labelledby="tln-welcome-title">
      <h2 id="tln-welcome-title" className="tln-welcome__title">
        Selamat datang{user && 'name' in user && user.name ? `, ${String(user.name)}` : ''}
      </h2>
      <p className="tln-welcome__lead">
        Pilih tugas di bawah, atau buka menu di kiri. Setiap perubahan langsung tampil di website setelah Anda
        menekan <strong>Simpan</strong>.
      </p>

      <h3 className="tln-welcome__group">Perlu ditangani</h3>
      <ul className="tln-grid">
        {shop.map((item) => (
          <ShortcutCard key={item.href} {...item} />
        ))}
      </ul>

      <h3 className="tln-welcome__group">Tugas cepat</h3>
      <ul className="tln-grid">
        {content.map((item) => (
          <ShortcutCard key={item.href} {...item} />
        ))}
      </ul>
    </section>
  )
}
