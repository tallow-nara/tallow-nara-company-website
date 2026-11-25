import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import { SESSION_MS, toSessionCustomer, type SessionCustomer } from './service'
import { hashToken, newToken } from './tokens'

const isProduction = process.env.NODE_ENV === 'production'
const COOKIE_NAME = isProduction ? '__Host-tln_sesi' : 'tln_sesi'

export async function startSession(customerId: number): Promise<void> {
  const payload = await getPayload({ config })
  const token = newToken()
  const now = Date.now()

  await payload.delete({
    collection: 'customer-sessions',
    where: { and: [{ customer: { equals: customerId } }, { expiresAt: { less_than: new Date(now).toISOString() } }] },
  })
  await payload.create({
    collection: 'customer-sessions',
    data: { customer: customerId, tokenHash: hashToken(token), expiresAt: new Date(now + SESSION_MS).toISOString() },
  })

  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: SESSION_MS / 1000,
  })
}

export async function endSession(): Promise<void> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  store.delete(COOKIE_NAME)
  if (!token) return
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'customer-sessions', where: { tokenHash: { equals: hashToken(token) } } })
}

export async function getCurrentCustomer(): Promise<SessionCustomer | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'customer-sessions',
      where: { and: [{ tokenHash: { equals: hashToken(token) } }, { expiresAt: { greater_than: new Date().toISOString() } }] },
      limit: 1,
      depth: 1,
    })
    const customer = docs[0]?.customer
    return customer && typeof customer === 'object' ? toSessionCustomer(customer) : null
  } catch (error) {
    console.error('Sesi pembeli gagal dibaca', error)
    return null
  }
}
