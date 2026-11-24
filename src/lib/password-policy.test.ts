import { describe, expect, it } from 'vitest'

import { checkPassword, CUSTOMER_PASSWORD_MIN, STAFF_PASSWORD_MIN } from './password-policy'

describe('checkPassword', () => {
  it('menolak yang terlalu pendek', () => {
    expect(checkPassword('abc123', CUSTOMER_PASSWORD_MIN)).toMatch(/minimal 8/)
    expect(checkPassword('abcdefg12345', STAFF_PASSWORD_MIN)).toBeNull()
    expect(checkPassword('abcdef12345', STAFF_PASSWORD_MIN)).toMatch(/minimal 12/)
  })

  it('mewajibkan huruf dan angka', () => {
    expect(checkPassword('hanyahuruf', CUSTOMER_PASSWORD_MIN)).toMatch(/huruf dan angka/)
    expect(checkPassword('1234567890', CUSTOMER_PASSWORD_MIN)).toMatch(/huruf dan angka/)
  })

  it('menolak kata umum', () => {
    expect(checkPassword('Password123', CUSTOMER_PASSWORD_MIN)).toMatch(/mudah ditebak/)
    expect(checkPassword('Tallownara2026', CUSTOMER_PASSWORD_MIN)).toMatch(/mudah ditebak/)
  })

  it('menerima kata sandi yang wajar', () => {
    expect(checkPassword('kopi-susu-7-gelas', CUSTOMER_PASSWORD_MIN)).toBeNull()
  })
})
