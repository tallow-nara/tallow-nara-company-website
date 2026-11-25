import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.argv.at(-1)?.trim().toLowerCase()

if (!email || !email.includes('@')) {
  console.error('Tulis email akun admin. Contoh: corepack pnpm admin:super-admin email@anda.com')
  process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
const user = docs[0]

if (!user) {
  console.error(`Tidak ada akun admin dengan email ${email}. Buat akunnya lebih dulu di halaman admin.`)
  process.exit(1)
}

await payload.update({ collection: 'users', id: user.id, data: { role: 'super-admin' } })
console.info(`${email} sekarang Super admin.`)
process.exit(0)
