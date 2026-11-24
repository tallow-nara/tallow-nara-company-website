import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthShell } from '@/components/account/AuthShell'
import { ForgotPasswordForm } from '@/components/account/forms'

export const metadata: Metadata = { title: 'Lupa kata sandi', robots: { index: false } }

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Lupa kata sandi" lead="Isi email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.">
      <ForgotPasswordForm />
      <p className="mt-8 text-base">
        <Link href="/masuk" className="underline underline-offset-2">
          Kembali ke halaman masuk
        </Link>
      </p>
    </AuthShell>
  )
}
