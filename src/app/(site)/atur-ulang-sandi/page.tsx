import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/account/AuthShell'
import { ResetPasswordForm } from '@/components/account/forms'
import { isTokenValid } from '@/lib/customers/service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Atur ulang kata sandi', robots: { index: false } }

type Props = { searchParams: Promise<{ token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams
  const valid = token ? await isTokenValid('reset', token) : false

  if (!token || !valid) {
    return (
      <AuthShell title="Tautan tidak berlaku" lead="Tautannya salah, sudah dipakai, atau sudah lewat satu jam.">
        <Link href="/lupa-sandi" className="btn btn-primary mt-8">
          Minta tautan baru
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Kata sandi baru" lead="Buat kata sandi baru. Semua perangkat akan diminta masuk ulang.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  )
}
