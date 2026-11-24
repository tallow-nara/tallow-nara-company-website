import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password'
import { hashToken, newToken } from './tokens'

describe('hashPassword', () => {
  it('menyimpan hash, bukan kata sandinya, dan garam berbeda tiap kali', async () => {
    const a = await hashPassword('kopi-susu-7-gelas')
    const b = await hashPassword('kopi-susu-7-gelas')
    expect(a).not.toContain('kopi-susu')
    expect(a).not.toBe(b)
    expect(a.startsWith('scrypt$')).toBe(true)
  })

  it('hanya menerima kata sandi yang benar', async () => {
    const stored = await hashPassword('kopi-susu-7-gelas')
    expect(await verifyPassword('kopi-susu-7-gelas', stored)).toBe(true)
    expect(await verifyPassword('kopi-susu-7-gelasx', stored)).toBe(false)
    expect(await verifyPassword('', stored)).toBe(false)
    expect(await verifyPassword('apa-saja', 'bukan-hash-valid')).toBe(false)
  })
})

describe('tokens', () => {
  it('membuat token acak dan hash yang konsisten', () => {
    const token = newToken()
    expect(token.length).toBeGreaterThanOrEqual(43)
    expect(newToken()).not.toBe(token)
    expect(hashToken(token)).toBe(hashToken(token))
    expect(hashToken(token)).not.toContain(token)
  })
})
