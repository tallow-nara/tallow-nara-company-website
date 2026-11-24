'use server'

import { redirect } from 'next/navigation'
import type { ZodType } from 'zod'

import { forgotSchema, loginSchema, registerSchema, resetSchema, safeNext } from './schema'
import { getCurrentCustomer, endSession, startSession } from './session'
import {
  authenticateCustomer,
  registerCustomer,
  requestPasswordReset,
  resetPasswordWithToken,
  sendVerificationEmail,
  verifyEmailToken,
} from './service'

export type FormState = {
  errors?: Record<string, string>
  message?: string
  status?: 'ok' | 'error'
}

function read(formData: FormData, ...names: string[]): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, String(formData.get(name) ?? '')]))
}

function fieldErrors(schema: ZodType, values: unknown): Record<string, string> | null {
  const parsed = schema.safeParse(values)
  if (parsed.success) return null
  const errors: Record<string, string> = {}
  for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? 'form')] ??= issue.message
  return errors
}

const BUSY: FormState = { status: 'error', message: 'Permintaan belum bisa diproses. Data Anda aman, silakan coba lagi.' }

export async function registerAction(_previous: FormState, formData: FormData): Promise<FormState> {
  // Kolom jebakan untuk bot; manusia tidak melihatnya.
  if (formData.get('website')) return { status: 'ok' }

  const values = read(formData, 'name', 'email', 'phone', 'password')
  const errors = fieldErrors(registerSchema, values)
  if (errors) return { status: 'error', errors }

  try {
    const result = await registerCustomer(registerSchema.parse(values))
    if (!result.ok) return { status: 'error', errors: result.errors }
    await startSession(result.customer.id)
  } catch (error) {
    console.error('Pendaftaran gagal', error)
    return BUSY
  }
  redirect(safeNext(formData.get('next')))
}

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = read(formData, 'email', 'password')
  const errors = fieldErrors(loginSchema, values)
  if (errors) return { status: 'error', errors }

  try {
    const result = await authenticateCustomer(loginSchema.parse(values).email, values.password!)
    if (!result.ok) return { status: 'error', message: result.message }
    await startSession(result.customer.id)
  } catch (error) {
    console.error('Login pembeli gagal', error)
    return BUSY
  }
  redirect(safeNext(formData.get('next')))
}

export async function logoutAction(): Promise<void> {
  await endSession()
  redirect('/')
}

export async function forgotPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = read(formData, 'email')
  const errors = fieldErrors(forgotSchema, values)
  if (errors) return { status: 'error', errors }

  try {
    await requestPasswordReset(forgotSchema.parse(values).email)
  } catch (error) {
    console.error('Permintaan atur ulang sandi gagal', error)
    return BUSY
  }
  return {
    status: 'ok',
    message: 'Bila email itu terdaftar, tautan untuk membuat kata sandi baru sudah kami kirim. Berlaku 1 jam; periksa juga folder spam.',
  }
}

export async function resetPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = read(formData, 'token', 'password')
  const errors = fieldErrors(resetSchema, values)
  if (errors) return { status: 'error', errors: errors.password ? { password: errors.password } : { form: 'Tautan tidak valid.' } }

  try {
    const done = await resetPasswordWithToken(values.token!, values.password!)
    if (!done) {
      return { status: 'error', message: 'Tautan sudah tidak berlaku. Minta tautan baru dari halaman Lupa kata sandi.' }
    }
  } catch (error) {
    console.error('Atur ulang sandi gagal', error)
    return BUSY
  }
  redirect('/masuk?sandi=baru')
}

export async function resendVerificationAction(): Promise<FormState> {
  const customer = await getCurrentCustomer()
  if (!customer) return { status: 'error', message: 'Masuk dulu untuk mengirim ulang email verifikasi.' }
  if (customer.verified) return { status: 'ok', message: 'Email Anda sudah terverifikasi.' }

  try {
    const result = await sendVerificationEmail(customer)
    return result === 'too_soon'
      ? { status: 'error', message: 'Tunggu 60 detik sebelum meminta email baru.' }
      : { status: 'ok', message: `Email verifikasi sudah dikirim ke ${customer.email}. Berlaku 24 jam.` }
  } catch (error) {
    console.error('Kirim ulang verifikasi gagal', error)
    return { status: 'error', message: 'Email belum bisa dikirim. Coba lagi beberapa saat.' }
  }
}

export async function verifyEmailAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '')
  let ok = false
  try {
    ok = token.length >= 20 && (await verifyEmailToken(token))
  } catch (error) {
    console.error('Verifikasi email gagal', error)
  }
  redirect(ok ? '/verifikasi-email?selesai=1' : '/verifikasi-email')
}
