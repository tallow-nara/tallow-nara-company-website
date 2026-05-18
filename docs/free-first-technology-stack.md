# Stack Teknologi Gratis untuk MVP Checkout dan Shipping Tallownara

Terakhir diperbarui: 10 Mei 2026  
Scope: rekomendasi stack teknologi untuk memulai checkout, payment, shipping, dan order management langsung di website Tallownara dengan biaya bulanan serendah mungkin.

## Prinsip Utama

Target dokumen ini adalah **zero monthly cost first**, bukan zero cost total. Untuk commerce, ada biaya yang hampir tidak bisa dihindari:

- Payment gateway biasanya tidak mengenakan subscription bulanan, tetapi mengenakan biaya per transaksi berhasil.
- Shipping provider/kurir mengenakan biaya pengiriman, dan beberapa API shipping mengenakan biaya per request.
- Domain `tallownara.com` tetap butuh biaya domain tahunan.
- Jika traffic/order tumbuh, free tier hosting/database dapat habis dan perlu upgrade.

Jadi definisi "gratis dulu" yang realistis:

- Gratis untuk development.
- Gratis untuk hosting awal selama masih di batas free tier.
- Gratis untuk database awal selama masih di batas free tier.
- Tidak membangun server sendiri.
- Tidak membayar platform e-commerce bulanan.
- Biaya hanya muncul ketika ada transaksi, pengiriman, atau pemakaian melewati limit.

## Rekomendasi Stack MVP

| Area | Rekomendasi Gratis Awal | Alasan |
| --- | --- | --- |
| Framework | Next.js yang sudah ada | Project saat ini sudah memakai Next.js App Router |
| Bahasa | JavaScript dulu, TypeScript fase berikutnya | Menghindari migrasi besar di MVP |
| Hosting | Vercel Hobby | Paling mudah untuk Next.js, ada free tier |
| Database | Supabase Free atau Neon Free | Keduanya menyediakan Postgres free tier |
| ORM | Prisma atau Drizzle | Open-source, cocok untuk Postgres |
| Auth Admin | Auth.js / NextAuth atau Supabase Auth | Bisa mulai gratis |
| Product image | Public folder dulu, lalu Supabase Storage jika perlu admin upload | Paling sederhana untuk MVP |
| Payment | Midtrans Snap atau Xendit Checkout | Tanpa biaya bulanan, biaya per transaksi |
| Shipping rate | Mulai manual flat-rate atau RajaOngkir/Biteship saat siap | Menghindari biaya API sejak hari pertama |
| Email | Resend/SMTP provider free tier atau manual WhatsApp awal | Notifikasi bisa bertahap |
| Monitoring | Vercel logs + console/error logs awal | Cukup untuk MVP kecil |
| Analytics | Vercel Web Analytics free limit atau Google Analytics | Gratis untuk awal |
| CI/CD | GitHub + Vercel auto deploy | Tidak perlu setup server |

Rekomendasi final untuk MVP paling murah:

```text
Next.js + Vercel Hobby
Postgres di Supabase Free
Prisma
Auth.js untuk admin sederhana
Midtrans Snap untuk payment
Shipping flat-rate/manual dulu
Manual fulfillment + input resi di admin
Email/WhatsApp manual dulu, otomatisasi fase berikutnya
```

## Stack Tahap 1: MVP Tanpa Biaya Bulanan

### Frontend dan Backend

Gunakan Next.js yang sudah ada di project.

Yang perlu ditambahkan:

- Route customer:
  - `/shop`
  - `/products/[slug]`
  - `/cart`
  - `/checkout`
  - `/orders/[orderNumber]`
- Route admin:
  - `/admin/login`
  - `/admin/orders`
  - `/admin/products`
- API route:
  - `/api/products`
  - `/api/cart`
  - `/api/orders`
  - `/api/payments/create`
  - `/api/webhooks/midtrans` atau `/api/webhooks/xendit`

Alasan:

- Tidak perlu membuat backend terpisah.
- Deployment tetap sederhana.
- Cocok untuk volume order awal.

### Hosting

Pilihan utama: **Vercel Hobby**.

Alasan:

- Cocok untuk Next.js.
- Free tier tersedia untuk personal/small-scale apps.
- Deploy otomatis dari GitHub.
- Serverless function cukup untuk checkout, order creation, dan webhook awal.

Batasan:

- Ada limit penggunaan bulanan.
- Untuk kebutuhan bisnis yang tumbuh, kemungkinan perlu upgrade.
- Hindari proses background panjang di serverless function.

Alternatif: **Cloudflare Pages/Workers Free**.

Cloudflare menarik untuk static/edge, tetapi untuk project Next.js dengan API route dan webhook, Vercel biasanya lebih praktis sebagai tahap pertama.

### Database

Pilihan utama: **Supabase Free Postgres**.

Alasan:

- Free tier menyediakan Postgres, Auth, Storage, dan dashboard database.
- Cocok jika ingin satu provider untuk database, auth, dan storage.
- Mudah dipakai dari Next.js.

Batasan penting:

- Free plan punya limit database/storage/egress.
- Free project dapat paused setelah tidak aktif.
- Backup dan support production lebih terbatas dibanding plan berbayar.

Alternatif: **Neon Free Postgres**.

Alasan:

- Free Postgres dengan branching dan autoscaling.
- Cocok jika hanya butuh database Postgres ringan.

Rekomendasi untuk Tallownara:

- Pakai Supabase Free jika ingin sekalian memanfaatkan Auth dan Storage.
- Pakai Neon Free jika ingin database Postgres saja dan auth dikelola sendiri.

### ORM dan Migration

Pilihan: **Prisma**.

Alasan:

- Banyak contoh Next.js.
- Schema mudah dibaca.
- Migration jelas.
- Cocok untuk tim kecil.

Alternatif: **Drizzle**.

Alasan:

- Lebih ringan.
- Type-safe jika nanti migrasi ke TypeScript.

Rekomendasi:

- Jika tetap JavaScript dan ingin cepat: Prisma.
- Jika sejak awal ingin TypeScript dan SQL-like: Drizzle.

### Auth Admin

MVP tidak perlu customer account dulu. Customer bisa checkout sebagai guest.

Yang perlu ada:

- Login admin.
- Proteksi route `/admin/*`.
- Satu atau beberapa user admin.

Pilihan gratis:

- Auth.js/NextAuth dengan credentials provider.
- Supabase Auth jika database memakai Supabase.

Rekomendasi:

- Untuk MVP cepat: Auth.js credentials + password hash di database.
- Untuk mengurangi implementasi auth sendiri: Supabase Auth.

### Product Image

Tahap awal:

- Simpan image produk di `public/img/products`.
- Product data menyimpan path image.

Kapan perlu storage:

- Jika admin harus upload foto dari dashboard.
- Jika image sering berubah.
- Jika butuh multi-image per produk yang dikelola non-developer.

Pilihan gratis setelahnya:

- Supabase Storage Free.

## Payment Gratis Bulanan

Payment tidak gratis total. Pilih provider yang tidak mengenakan biaya setup/subscription bulanan, lalu bayar per transaksi sukses.

### Opsi 1: Midtrans Snap

Cocok jika:

- Ingin payment UI cepat dengan popup/redirect.
- Ingin banyak metode pembayaran Indonesia.
- Ingin integrasi umum di Indonesia.

Kelebihan:

- Hosted checkout/popup mengurangi beban UI payment.
- Website tidak menyimpan data kartu.
- Ada webhook/notification.

Biaya:

- Tidak diposisikan sebagai biaya bulanan untuk memakai Snap, tetapi ada biaya transaksi sesuai metode pembayaran.
- Contoh dari pricing Midtrans: VA, QRIS, e-wallet, kartu, dan OTC punya fee berbeda.

### Opsi 2: Xendit Checkout

Cocok jika:

- Ingin alternatif payment gateway Indonesia yang kuat.
- Ingin checkout/payment channel yang fleksibel.

Kelebihan:

- Tidak ada setup/subscription/maintenance fee menurut dokumentasi bantuan Xendit.
- Biaya dikenakan per transaksi berhasil.

### Rekomendasi Payment MVP

Gunakan **Midtrans Snap** dulu.

Alasan:

- Mudah dipahami untuk checkout hosted.
- Dokumentasi banyak.
- Cocok untuk flow MVP: create order, create payment token, redirect/popup, handle webhook.

Catatan:

- Jangan membuat manual transfer tanpa sistem verifikasi otomatis jika targetnya checkout scalable.
- Manual transfer bisa dipakai hanya sebagai fallback sementara, tetapi akan menambah beban CS dan risiko salah rekonsiliasi.

## Shipping Gratis Bulanan

Shipping adalah bagian yang paling sulit dibuat gratis total.

Ada tiga pendekatan:

### Opsi A: Flat Rate Manual

Contoh:

- Jabodetabek: Rp 15.000.
- Jawa/Bali: Rp 25.000.
- Luar Jawa: Rp 40.000.

Kelebihan:

- Tidak butuh API shipping.
- Tidak ada biaya API.
- MVP bisa launch lebih cepat.
- Cocok jika order masih sedikit.

Kekurangan:

- Ongkir bisa tidak akurat.
- Perlu subsidi atau penyesuaian manual.
- Tidak cocok untuk skala besar atau area luas.

### Opsi B: Table Rate Internal

Simpan tabel ongkir sendiri berdasarkan provinsi/kota.

Kelebihan:

- Tidak bergantung API saat checkout.
- Bisa dikontrol.

Kekurangan:

- Harus maintenance data ongkir.
- Tidak real-time.

### Opsi C: API Shipping

Pilihan:

- Biteship.
- RajaOngkir.

Kelebihan:

- Ongkir lebih akurat.
- Bisa memilih kurir/service.
- Bisa berkembang ke tracking dan shipment.

Kekurangan:

- Biteship menampilkan biaya per request untuk Rates API/Tracking API di halaman pricing.
- RajaOngkir perlu dicek paket dan batas API yang sesuai.
- Integrasi lebih kompleks.

### Rekomendasi Shipping MVP Gratis Dulu

Mulai dengan **flat rate manual** atau **table rate internal**.

Flow:

1. Customer isi alamat.
2. Sistem menentukan zona ongkir sederhana.
3. Customer membayar produk + ongkir.
4. Admin packing.
5. Admin membuat resi manual lewat dashboard kurir/aggregator.
6. Admin input resi di dashboard Tallownara.
7. Customer mendapat update resi.

Upgrade ke Biteship/RajaOngkir setelah:

- Order harian mulai stabil.
- CS mulai terbebani cek ongkir/resi.
- Margin ongkir perlu akurat.
- Ingin auto-create shipment.

## Admin dan Operasional Gratis Dulu

### Admin MVP

Fitur wajib:

- Login admin.
- List order.
- Detail order.
- Update fulfillment status.
- Input nomor resi.
- Manage product dasar.

Tidak perlu di MVP:

- Dashboard analytics kompleks.
- Multi-role permission.
- Auto print label.
- Refund otomatis.
- Customer account.
- Loyalty/promo engine.

### Rekonsiliasi

Tahap awal:

- Gunakan dashboard payment gateway untuk settlement.
- Simpan provider transaction ID di database.
- Export order CSV dari admin jika perlu.

Fase berikutnya:

- Import settlement report.
- Cocokkan otomatis payment fee dan net settlement.

## Monitoring dan Backup Gratis Dulu

### Monitoring

Tahap awal:

- Vercel deployment logs.
- Vercel function logs.
- Console error server-side yang rapi.
- Email alert manual dari provider payment/shipping bila tersedia.

Fase berikutnya:

- Sentry free tier.
- Uptime monitoring free tier.
- Log drain berbayar jika traffic naik.

### Backup

Tahap awal:

- Export database manual berkala.
- Simpan migration di Git.
- Hindari edit data langsung di production kecuali perlu.

Catatan:

- Free tier database biasanya punya backup/retention terbatas.
- Untuk production yang mulai menghasilkan revenue stabil, database backup otomatis adalah alasan kuat untuk upgrade.

## Environment Variable yang Dibutuhkan

Contoh:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

APP_BASE_URL=
ADMIN_EMAIL=
```

Jika memakai Xendit:

```env
XENDIT_SECRET_KEY=
XENDIT_WEBHOOK_TOKEN=
```

Jika memakai Supabase Auth/Storage:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Prinsip:

- Secret server tidak boleh memakai prefix `NEXT_PUBLIC_`.
- Webhook secret wajib diverifikasi.
- Environment production dan development harus dipisah.

## Estimasi Biaya Awal

| Komponen | Biaya Bulanan Awal | Catatan |
| --- | --- | --- |
| Next.js | Rp 0 | Open-source |
| Vercel Hobby | Rp 0 | Selama dalam batas free tier |
| Supabase Free | Rp 0 | Selama dalam batas free tier |
| Prisma/Drizzle | Rp 0 | Open-source |
| Auth.js | Rp 0 | Open-source |
| Midtrans/Xendit | Rp 0 subscription | Ada fee per transaksi berhasil |
| Shipping flat/table rate | Rp 0 API | Ongkir tetap dibayar customer/toko |
| Biteship/RajaOngkir | Bisa ada biaya API | Pakai saat sudah siap |
| GitHub repo | Rp 0 | Untuk repo private kecil bisa gratis |
| Domain | Tidak Rp 0 | Domain sudah/harus tetap dibayar tahunan |

## Trade-off Stack Gratis

Keuntungan:

- Cepat mulai.
- Biaya bulanan rendah.
- Cocok validasi channel D2C.
- Tidak bergantung platform e-commerce berlangganan.

Kompromi:

- Limit free tier bisa tercapai.
- Backup dan SLA terbatas.
- Fulfillment masih banyak manual.
- Shipping rate mungkin tidak real-time jika memilih flat/table rate.
- Admin akan sederhana.
- Perlu disiplin operasional karena tidak ada fitur enterprise.

## Kapan Harus Upgrade dari Gratis

Upgrade hosting/database jika:

- Checkout mulai lambat atau sering kena limit.
- Order paid gagal tersinkron karena function/log limit.
- Database mendekati limit storage.
- Butuh backup otomatis yang lebih kuat.
- Butuh support provider untuk production.
- Revenue website sudah cukup untuk membiayai reliability.

Upgrade shipping jika:

- Ongkir manual sering rugi.
- Banyak komplain estimasi ongkir.
- CS kewalahan membuat resi.
- Butuh tracking otomatis.

Upgrade notification jika:

- Customer sering bertanya status order.
- Order sudah terlalu banyak untuk WhatsApp manual.
- Butuh template WhatsApp otomatis.

## Roadmap Implementasi Gratis Dulu

### Fase 0: Data dan Setup

- Rapikan product master data.
- Tentukan berat produk dan packaging.
- Buat akun Vercel.
- Buat database Supabase/Neon.
- Buat akun payment gateway sandbox.
- Tentukan flat/table shipping awal.

### Fase 1: Commerce Basic

- Pindahkan produk hardcoded ke database atau seed file.
- Buat product detail page.
- Buat cart guest.
- Buat checkout address.
- Buat order pending payment.

### Fase 2: Payment

- Integrasi Midtrans Snap atau Xendit Checkout sandbox.
- Buat webhook payment.
- Buat success/pending/failed page.
- Simpan payment payload dan status.

### Fase 3: Admin Manual Fulfillment

- Buat login admin.
- Buat order list/detail.
- Buat update fulfillment status.
- Buat input resi manual.
- Buat halaman order tracking sederhana.

### Fase 4: Shipping Automation

- Evaluasi Biteship/RajaOngkir.
- Tambahkan shipping rate API.
- Tambahkan tracking API.
- Tambahkan auto notification.

## Rekomendasi Keputusan Awal

Untuk Tallownara, keputusan paling pragmatis:

1. Tetap pakai Next.js yang sudah ada.
2. Deploy ke Vercel Hobby.
3. Pakai Supabase Free untuk Postgres, dan gunakan Storage/Auth jika perlu.
4. Pakai Prisma untuk database schema dan migration.
5. Customer checkout sebagai guest.
6. Admin login sederhana.
7. Pakai Midtrans Snap untuk payment.
8. Mulai shipping dengan flat/table rate internal.
9. Fulfillment dan resi manual dulu.
10. Upgrade ke shipping API setelah order mulai stabil.

## Referensi Resmi

- Vercel Hobby Plan: https://vercel.com/docs/accounts/plans/hobby
- Supabase Pricing: https://supabase.com/pricing
- Neon Pricing: https://neon.com/pricing
- Cloudflare Workers Pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Midtrans Pricing: https://midtrans.com/pricing
- Midtrans Snap Documentation: https://docs.midtrans.com/docs/snap
- Xendit pricing help: https://help.xendit.co/hc/en-us/articles/360039086452-What-are-the-pricing-for-Xendit-products
- Xendit integration: https://www.xendit.co/en/products/integration/
- Biteship Pricing: https://biteship.com/en/pricing
- Biteship API Get Started: https://biteship.com/en/docs/getting-started
