import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'Isi DATABASE_URL di berkas .env'),
  PAYLOAD_SECRET: z.string().min(32, 'Isi PAYLOAD_SECRET di .env, minimal 32 karakter acak'),
  ADMIN_PATH: z
    .string()
    .regex(
      /^\/(?!admin(\/|$)|api(\/|$))[a-z0-9][a-z0-9-]{7,39}$/,
      'Isi ADMIN_PATH di .env: alamat rahasia admin, contoh /kelola-k8x2m9qa (8-40 huruf kecil, angka, atau tanda hubung; bukan /admin).',
    ),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  const messages = parsed.error.issues.map((issue) => `- ${issue.message}`).join('\n')
  throw new Error(`Konfigurasi .env belum lengkap:\n${messages}`)
}

export const serverEnv = parsed.data
