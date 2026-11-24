import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AuthShell } from '@/components/account/AuthShell'
import { RegisterForm } from '@/components/account/forms'
import { safeNext } from '@/lib/customers/schema'
import { getCurrentCustomer } from '@/lib/customers/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Daftar', robots: { index: false } }

type Props = { searchParams: Promise<{ lanjut?: string }> }

export default async function RegisterPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).lanjut)
  if (await getCurrentCustomer()) redirect(next)

  return (
    <AuthShell
      title="Daftar"
      lead="Dengan akun, riwayat pesanan tersimpan dan checkout berikutnya lebih singkat."
    >
      <RegisterForm next={next} />
      <p className="mt-6 max-w-md text-sm text-muted">
        Dengan mendaftar, Anda menyetujui{' '}
        <Link href="/syarat-ketentuan" className="underline">
          Syarat &amp; Ketentuan
        </Link>{' '}
        dan{' '}
        <Link href="/kebijakan-privasi" className="underline">
          Kebijakan privasi
        </Link>
        .
      </p>
      <p className="mt-6 text-base">
        Sudah punya akun?{' '}
        <Link href={`/masuk?lanjut=${encodeURIComponent(next)}`} className="underline underline-offset-2">
          Masuk
        </Link>
      </p>
    </AuthShell>
  )
}
