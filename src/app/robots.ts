import type { MetadataRoute } from 'next'

// Alamat admin sengaja tidak ditulis di sini agar tidak bocor lewat robots.txt; admin sudah noindex.
export default function robots(): MetadataRoute.Robots {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/akun', '/masuk', '/daftar', '/lupa-sandi', '/atur-ulang-sandi', '/verifikasi-email', '/checkout', '/keranjang', '/pesanan/', '/bayar-simulasi/'],
    },
    sitemap: `${site}/sitemap.xml`,
  }
}
