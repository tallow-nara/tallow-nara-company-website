import { z } from 'zod'

import { checkPassword, CUSTOMER_PASSWORD_MIN } from '../password-policy'
import { normalizePhone } from '../phone'

/** Aturan isian akun. Bebas dari modul server agar bisa dipakai juga untuk validasi di browser. */
export const nameField = z.string().trim().min(2, 'Isi nama lengkap, minimal 2 huruf.').max(80, 'Nama maksimal 80 huruf.')

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Periksa alamat email, contoh: nama@email.com.'))

export const phoneField = z
  .string()
  .refine((value) => normalizePhone(value) !== null, 'Isi nomor WhatsApp aktif, contoh: 0812 3456 7890.')

export const newPasswordField = z.string().superRefine((value, context) => {
  const problem = checkPassword(value, CUSTOMER_PASSWORD_MIN)
  if (problem) context.addIssue({ code: 'custom', message: problem })
})

export const loginPasswordField = z.string().min(1, 'Isi kata sandi Anda.')

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  password: newPasswordField,
})

export const loginSchema = z.object({ email: emailField, password: loginPasswordField })
export const forgotSchema = z.object({ email: emailField })
export const resetSchema = z.object({ token: z.string().min(20), password: newPasswordField })

/** Hanya mengizinkan alamat di situs ini sebagai tujuan setelah masuk. */
export function safeNext(value: unknown, fallback = '/akun'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}
