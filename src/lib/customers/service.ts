import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Customer } from '@/payload-types'

import { sendEmail } from '../integrations/email'
import { normalizePhone } from '../phone'
import { burnPasswordCheck, hashPassword, verifyPassword } from './password'
import { hashToken, newToken } from './tokens'

export const MAX_FAILED_LOGINS = 5
export const LOCK_MS = 15 * 60_000
export const SESSION_MS = 14 * 24 * 3_600_000
const VERIFY_TTL_MS = 24 * 3_600_000
const RESET_TTL_MS = 60 * 60_000
const RESEND_GAP_MS = 60_000

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export type SessionCustomer = { id: number; name: string; email: string; phone: string | null; verified: boolean }

export const toSessionCustomer = (customer: Customer): SessionCustomer => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone ?? null,
  verified: Boolean(customer.emailVerifiedAt),
})

async function findByEmail(payload: Payload, email: string): Promise<Customer | null> {
  const { docs } = await payload.find({
    collection: 'customers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    showHiddenFields: true,
  })
  return docs[0] ?? null
}

async function issueToken(payload: Payload, customerId: number, kind: 'verifikasi' | 'reset', ttlMs: number) {
  const token = newToken()
  await payload.create({
    collection: 'customer-tokens',
    data: { customer: customerId, kind, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + ttlMs).toISOString() },
  })
  return token
}

async function recentlyIssued(payload: Payload, customerId: number, kind: 'verifikasi' | 'reset'): Promise<boolean> {
  const { totalDocs } = await payload.count({
    collection: 'customer-tokens',
    where: {
      and: [
        { customer: { equals: customerId } },
        { kind: { equals: kind } },
        { createdAt: { greater_than: new Date(Date.now() - RESEND_GAP_MS).toISOString() } },
      ],
    },
  })
  return totalDocs > 0
}

export async function sendVerificationEmail(customer: Pick<Customer, 'id' | 'name' | 'email'>): Promise<'sent' | 'too_soon'> {
  const payload = await getPayload({ config })
  if (await recentlyIssued(payload, customer.id, 'verifikasi')) return 'too_soon'
  const token = await issueToken(payload, customer.id, 'verifikasi', VERIFY_TTL_MS)
  await sendEmail({
    to: customer.email,
    subject: 'Verifikasi email akun Tallownara',
    text: `Halo ${customer.name},\n\nKlik tautan ini untuk memverifikasi email Anda (berlaku 24 jam):\n${siteUrl()}/verifikasi-email?token=${token}\n\nBila Anda tidak mendaftar di Tallownara, abaikan email ini.`,
  })
  return 'sent'
}

export type RegisterResult =
  | { ok: true; customer: SessionCustomer }
  | { ok: false; errors: Record<string, string> }

export async function registerCustomer(input: {
  name: string
  email: string
  phone: string
  password: string
}): Promise<RegisterResult> {
  const payload = await getPayload({ config })
  if (await findByEmail(payload, input.email)) {
    return {
      ok: false,
      errors: { email: 'Email ini sudah terdaftar. Masuk dengan email tersebut, atau atur ulang kata sandi bila lupa.' },
    }
  }
  const customer = await payload.create({
    collection: 'customers',
    data: {
      name: input.name,
      email: input.email,
      phone: normalizePhone(input.phone) ?? input.phone,
      passwordHash: await hashPassword(input.password),
    },
  })
  try {
    await sendVerificationEmail(customer)
  } catch (error) {
    // Akun tetap jadi; pembeli bisa meminta kirim ulang dari halaman Akun.
    console.error('Email verifikasi gagal dikirim', error)
  }
  return { ok: true, customer: toSessionCustomer(customer) }
}

export type LoginResult =
  | { ok: true; customer: SessionCustomer }
  | { ok: false; message: string }

const BAD_LOGIN = 'Email atau kata sandi salah. Periksa lalu coba lagi, atau atur ulang kata sandi.'

export async function authenticateCustomer(email: string, password: string): Promise<LoginResult> {
  const payload = await getPayload({ config })
  const customer = await findByEmail(payload, email)

  if (!customer?.passwordHash) {
    await burnPasswordCheck(password)
    return { ok: false, message: BAD_LOGIN }
  }

  if (customer.lockedUntil && new Date(customer.lockedUntil).getTime() > Date.now()) {
    const minutes = Math.ceil((new Date(customer.lockedUntil).getTime() - Date.now()) / 60_000)
    return {
      ok: false,
      message: `Terlalu banyak percobaan. Akun dikunci sementara, coba lagi dalam ${minutes} menit atau atur ulang kata sandi.`,
    }
  }

  if (!(await verifyPassword(password, customer.passwordHash))) {
    const failed = (customer.failedLogins ?? 0) + 1
    const lock = failed >= MAX_FAILED_LOGINS
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: { failedLogins: lock ? 0 : failed, lockedUntil: lock ? new Date(Date.now() + LOCK_MS).toISOString() : null },
    })
    return { ok: false, message: BAD_LOGIN }
  }

  await payload.update({
    collection: 'customers',
    id: customer.id,
    data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date().toISOString() },
  })
  return { ok: true, customer: toSessionCustomer(customer) }
}

/** Selalu terlihat berhasil agar tidak membocorkan email mana yang terdaftar. */
export async function requestPasswordReset(email: string): Promise<void> {
  const payload = await getPayload({ config })
  const customer = await findByEmail(payload, email)
  if (!customer || (await recentlyIssued(payload, customer.id, 'reset'))) return
  const token = await issueToken(payload, customer.id, 'reset', RESET_TTL_MS)
  await sendEmail({
    to: customer.email,
    subject: 'Atur ulang kata sandi Tallownara',
    text: `Halo ${customer.name},\n\nKlik tautan ini untuk membuat kata sandi baru (berlaku 1 jam):\n${siteUrl()}/atur-ulang-sandi?token=${token}\n\nBila Anda tidak memintanya, abaikan email ini. Kata sandi Anda tidak berubah.`,
  })
}

async function consumeToken(kind: 'verifikasi' | 'reset', token: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'customer-tokens',
    where: {
      and: [
        { tokenHash: { equals: hashToken(token) } },
        { kind: { equals: kind } },
        { usedAt: { exists: false } },
        { expiresAt: { greater_than: new Date().toISOString() } },
      ],
    },
    limit: 1,
    depth: 0,
  })
  const record = docs[0]
  if (!record) return null
  await payload.update({ collection: 'customer-tokens', id: record.id, data: { usedAt: new Date().toISOString() } })
  return typeof record.customer === 'number' ? record.customer : record.customer.id
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const customerId = await consumeToken('verifikasi', token)
  if (!customerId) return false
  const payload = await getPayload({ config })
  await payload.update({ collection: 'customers', id: customerId, data: { emailVerifiedAt: new Date().toISOString() } })
  return true
}

/** Hanya memeriksa, tidak menghabiskan token. Penghabisan token lewat aksi POST agar pemindai tautan email tidak memakainya. */
export async function isTokenValid(kind: 'verifikasi' | 'reset', token: string): Promise<boolean> {
  const payload = await getPayload({ config })
  const { totalDocs } = await payload.count({
    collection: 'customer-tokens',
    where: {
      and: [
        { tokenHash: { equals: hashToken(token) } },
        { kind: { equals: kind } },
        { usedAt: { exists: false } },
        { expiresAt: { greater_than: new Date().toISOString() } },
      ],
    },
  })
  return totalDocs > 0
}

export async function resetPasswordWithToken(token: string, password: string): Promise<boolean> {
  const customerId = await consumeToken('reset', token)
  if (!customerId) return false
  const payload = await getPayload({ config })
  await payload.update({
    collection: 'customers',
    id: customerId,
    data: {
      passwordHash: await hashPassword(password),
      failedLogins: 0,
      lockedUntil: null,
      // Mengikuti tautan reset di email membuktikan email ini milik pemiliknya.
      emailVerifiedAt: new Date().toISOString(),
    },
  })
  // Semua perangkat harus masuk ulang dengan kata sandi baru.
  await payload.delete({ collection: 'customer-sessions', where: { customer: { equals: customerId } } })
  return true
}
