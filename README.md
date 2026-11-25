# Tallownara

Website profil dan toko online tallownara.com. Next.js, Payload CMS 3, PostgreSQL, dan Tailwind CSS v4.

## Kebutuhan

- Node.js `^22.23.4` atau `>=24.22.1`
- Docker Desktop
- pnpm, tersedia lewat `corepack pnpm` (versi terkunci di `package.json`)

## Menjalankan di komputer lokal

```bash
cp .env.example .env
corepack pnpm install
corepack pnpm db:up
corepack pnpm seed
corepack pnpm dev
```

- Website: http://localhost:3000
- Panel admin: `http://localhost:3000` + nilai `ADMIN_PATH` (kunjungan pertama membuat akun admin)
- `db:up` menyalakan PostgreSQL di port 5433. `seed` mengisi konten awal, aman diulang, dan tidak menimpa konten yang ada.

## Isi `.env`

| Variabel | Isi |
|---|---|
| `POSTGRES_PASSWORD`, `DATABASE_URL` | Kata sandi database lokal; port 5433 agar tidak bentrok dengan PostgreSQL lain |
| `PAYLOAD_SECRET`, `OTP_HASH_SECRET` | Nilai acak minimal 32 karakter: `openssl rand -hex 32` |
| `ADMIN_PATH` | Alamat rahasia admin (bukan `/admin`), 8–40 huruf kecil/angka/tanda hubung, contoh `/kelola-k8x2m9qa` |
| `PAYMENT_PROVIDER` | `midtrans` atau `mock` (simulasi lokal, ditolak di produksi) |
| `SHIPPING_PROVIDER` | `mock` atau `biteship`; `SHIPPING_ORIGIN_AREA_ID` = kode area tempat pengemasan di Bogor |
| `WA_PROVIDER` | `console` (pesan dicetak ke log) atau `meta` |
| `EMAIL_PROVIDER` | `console`, `resend`, atau `smtp` |

Jangan commit `.env`.

## Perintah lain

| Perintah | Fungsi |
|---|---|
| `corepack pnpm lint` | Pemeriksaan kode |
| `corepack pnpm typecheck` | Pemeriksaan tipe TypeScript |
| `corepack pnpm test` | Tes unit |
| `corepack pnpm build` | Build produksi |
| `corepack pnpm db:down` | Mematikan database (data tetap tersimpan) |
| `corepack pnpm generate:types` | Membuat ulang tipe Payload setelah koleksi berubah |
| `corepack pnpm generate:importmap` | Membuat ulang import map admin |

## Masalah umum

Bila muncul `unable to get local issuer certificate` di macOS, arahkan Node ke daftar sertifikat sistem:

```bash
export NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem
```
