import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AuthShell } from '@/components/account/AuthShell'
import { LoginForm } from '@/components/account/forms'
import { safeNext } from '@/lib/customers/schema'
import { getCurrentCustomer } from '@/lib/customers/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Masuk', robots: { index: false } }

type Props = { searchParams: Promise<{ lanjut?: string; sandi?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { lanjut, sandi } = await searchParams
  const next = safeNext(lanjut)
  if (await getCurrentCustomer()) redirect(next)

  return (
    <AuthShell
      title="Masuk"
      lead={
        next === '/checkout'
          ? 'Masuk dulu untuk menyelesaikan pesanan. Isi keranjang Anda tetap tersimpan.'
          : 'Masuk untuk melihat riwayat pesanan dan membeli lebih cepat.'
      }
    >
      {sandi === 'baru' && (
        <p role="status" className="mt-6 max-w-md border-l-2 border-forest pl-4 text-forest">
          Kata sandi baru tersimpan. Silakan masuk.
        </p>
      )}
      <LoginForm next={next} />
      <p className="mt-8 text-base">
        Belum punya akun?{' '}
        <Link href={`/daftar?lanjut=${encodeURIComponent(next)}`} className="underline underline-offset-2">
          Daftar sekarang
        </Link>
      </p>
    </AuthShell>
  )
}
