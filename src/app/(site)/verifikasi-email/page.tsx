import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/account/AuthShell'
import { verifyEmailAction } from '@/lib/customers/actions'
import { isTokenValid } from '@/lib/customers/service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Verifikasi email', robots: { index: false } }

type Props = { searchParams: Promise<{ token?: string; selesai?: string }> }

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, selesai } = await searchParams

  if (selesai) {
    return (
      <AuthShell title="Email terverifikasi" lead="Terima kasih. Akun Anda siap dipakai untuk memesan.">
        <Link href="/produk" className="btn btn-primary mt-8">
          Lihat produk
        </Link>
      </AuthShell>
    )
  }

  if (token && (await isTokenValid('verifikasi', token))) {
    return (
      <AuthShell title="Verifikasi email" lead="Satu langkah lagi untuk mengaktifkan pemesanan di akun Anda.">
        <form action={verifyEmailAction} className="mt-8">
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="btn btn-primary">
            Verifikasi email saya
          </button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Tautan tidak berlaku"
      lead="Tautannya salah, sudah dipakai, atau sudah lewat 24 jam. Masuk ke akun Anda, lalu minta email verifikasi baru."
    >
      <Link href="/akun" className="btn btn-primary mt-8">
        Buka akun saya
      </Link>
    </AuthShell>
  )
}
