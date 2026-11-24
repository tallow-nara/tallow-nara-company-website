'use client'

import Link from 'next/link'
import type { ZodType } from 'zod'

import { forgotPasswordAction, loginAction, registerAction, resetPasswordAction } from '@/lib/customers/actions'
import { emailField, loginPasswordField, nameField, newPasswordField, phoneField } from '@/lib/customers/schema'

import { AuthForm, type AuthField } from './AuthForm'

const rule = (schema: ZodType) => (value: string) => schema.safeParse(value).error?.issues[0]?.message

const EMAIL: AuthField = {
  name: 'email',
  label: 'Email',
  type: 'email',
  autoComplete: 'email',
  validate: rule(emailField),
}

const linkClass = 'underline underline-offset-2'

export function LoginForm({ next }: { next: string }) {
  return (
    <AuthForm
      action={loginAction}
      hidden={{ next }}
      fields={[
        EMAIL,
        { name: 'password', label: 'Kata sandi', type: 'password', autoComplete: 'current-password', validate: rule(loginPasswordField) },
      ]}
      submitLabel="Masuk ke akun"
      pendingLabel="Memeriksa data…"
      footer={
        <p className="text-base">
          <Link href="/lupa-sandi" className={linkClass}>
            Lupa kata sandi?
          </Link>
        </p>
      }
    />
  )
}

export function RegisterForm({ next }: { next: string }) {
  return (
    <AuthForm
      action={registerAction}
      hidden={{ next }}
      honeypot
      fields={[
        { name: 'name', label: 'Nama lengkap', autoComplete: 'name', validate: rule(nameField) },
        EMAIL,
        {
          name: 'phone',
          label: 'Nomor WhatsApp',
          type: 'tel',
          autoComplete: 'tel',
          hint: 'Dipakai untuk kabar pesanan, contoh: 0812 3456 7890.',
          validate: rule(phoneField),
        },
        {
          name: 'password',
          label: 'Kata sandi',
          type: 'password',
          autoComplete: 'new-password',
          hint: 'Minimal 8 karakter, memuat huruf dan angka.',
          validate: rule(newPasswordField),
        },
      ]}
      submitLabel="Buat akun"
      pendingLabel="Membuat akun…"
    />
  )
}

export function ForgotPasswordForm() {
  return (
    <AuthForm
      action={forgotPasswordAction}
      fields={[EMAIL]}
      submitLabel="Kirim tautan atur ulang"
      pendingLabel="Mengirim tautan…"
    />
  )
}

export function ResetPasswordForm({ token }: { token: string }) {
  return (
    <AuthForm
      action={resetPasswordAction}
      hidden={{ token }}
      fields={[
        {
          name: 'password',
          label: 'Kata sandi baru',
          type: 'password',
          autoComplete: 'new-password',
          hint: 'Minimal 8 karakter, memuat huruf dan angka.',
          validate: rule(newPasswordField),
        },
      ]}
      submitLabel="Simpan kata sandi baru"
      pendingLabel="Menyimpan…"
    />
  )
}
