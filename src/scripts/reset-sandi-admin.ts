import { randomInt } from 'node:crypto'

import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.argv.at(-1)?.trim().toLowerCase()

if (!email || !email.includes('@')) {
  console.error('Tulis email akun admin. Contoh: corepack pnpm admin:reset-sandi email@anda.com')
  process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
const user = docs[0]

if (!user) {
  console.error(`Tidak ada akun admin dengan email ${email}.`)
  process.exit(1)
}

const alfabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
const angka = '23456789'
const sandi =
  Array.from({ length: 14 }, () => alfabet[randomInt(alfabet.length)]).join('') +
  Array.from({ length: 2 }, () => angka[randomInt(angka.length)]).join('')

await payload.update({ collection: 'users', id: user.id, data: { password: sandi, loginAttempts: 0, lockUntil: null } })
console.info(`Kata sandi sementara untuk ${email}: ${sandi}`)
console.info('Masuk, lalu segera ganti kata sandi ini di halaman akun admin.')
process.exit(0)
