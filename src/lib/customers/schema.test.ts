import { describe, expect, it } from 'vitest'

import { emailField, registerSchema, safeNext } from './schema'

describe('safeNext', () => {
  it('menerima alamat dalam situs', () => {
    expect(safeNext('/checkout')).toBe('/checkout')
    expect(safeNext('/akun?x=1')).toBe('/akun?x=1')
  })

  it('menolak alamat ke luar situs', () => {
    expect(safeNext('https://jahat.example')).toBe('/akun')
    expect(safeNext('//jahat.example')).toBe('/akun')
    expect(safeNext('/\\jahat.example')).toBe('/akun')
    expect(safeNext(undefined)).toBe('/akun')
    expect(safeNext('javascript:alert(1)', '/')).toBe('/')
  })
})

describe('registerSchema', () => {
  it('merapikan email dan menolak data buruk', () => {
    expect(emailField.parse('  Nama@Email.COM ')).toBe('nama@email.com')
    const bad = registerSchema.safeParse({ name: 'A', email: 'x', phone: '1', password: 'abc' })
    expect(bad.success).toBe(false)
    const ok = registerSchema.safeParse({
      name: 'Siti Aminah',
      email: 'siti@example.com',
      phone: '0812 3456 7890',
      password: 'kopi-susu-7-gelas',
    })
    expect(ok.success).toBe(true)
  })
})
