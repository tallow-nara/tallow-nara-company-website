export const STAFF_PASSWORD_MIN = 12
export const CUSTOMER_PASSWORD_MIN = 8

export function checkPassword(password: string, min: number): string | null {
  if (password.length < min) return `Kata sandi minimal ${min} karakter.`
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Kata sandi harus memuat huruf dan angka.'
  if (/^(.)\1+$/.test(password)) return 'Kata sandi terlalu mudah ditebak.'
  if (/(password|kata\s?sandi|12345678|qwerty|tallownara)/i.test(password)) {
    return 'Kata sandi terlalu mudah ditebak. Hindari kata umum dan nama toko.'
  }
  return null
}
