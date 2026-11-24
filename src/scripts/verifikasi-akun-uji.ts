// Khusus tes otomatis: menandai email terverifikasi untuk akun uji (alamat berakhiran @uji.example).
// Tidak menyentuh akun pembeli sungguhan.
import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.argv.at(-1)?.trim().toLowerCase()

if (!email?.endsWith('@uji.example')) {
  console.error('Hanya untuk email berakhiran @uji.example.')
  process.exit(1)
}

const payload = await getPayload({ config })
await payload.update({
  collection: 'customers',
  where: { email: { equals: email } },
  data: { emailVerifiedAt: new Date().toISOString() },
})
process.exit(0)
