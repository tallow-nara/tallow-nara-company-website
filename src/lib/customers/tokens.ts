import { createHash, randomBytes } from 'node:crypto'

/** Token acak untuk sesi, verifikasi email, dan reset sandi. Yang disimpan di database hanya hash-nya. */
export function newToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
