import AxeBuilder from '@axe-core/playwright'
import { execFileSync } from 'node:child_process'

import { expect, test, type Page } from '@playwright/test'

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
  expect(violations.map(({ id, nodes }) => `${id}: ${nodes[0]?.target}`)).toEqual([])
}

test('pembeli harus punya akun, lalu bisa membeli sampai pesanan Dibayar lewat simulasi', async ({ page }) => {
  const email = `uji-${Date.now()}@uji.example`

  await page.goto('/produk/luxury-tallow-balm')
  await page.getByRole('button', { name: /Masukkan .* ke keranjang/ }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Sudah masuk' })).toBeVisible()
  await expectNoAxeViolations(page)

  await page.goto('/keranjang')
  await expect(page.getByRole('heading', { name: 'Keranjang', exact: true })).toBeVisible()
  await expectNoAxeViolations(page)
  await page.getByRole('link', { name: 'Lanjut ke checkout' }).click()

  // Tanpa akun, checkout mengarahkan ke halaman masuk dan keranjang tetap tersimpan.
  await expect(page).toHaveURL(/\/masuk\?lanjut=\/checkout/)
  await page.getByRole('link', { name: 'Daftar sekarang' }).click()
  await page.getByRole('button', { name: 'Buat akun' }).click()
  await expect(page.locator('#f-name')).toBeFocused()
  await expect(page.getByText('Isi nama lengkap, minimal 2 huruf.')).toBeVisible()
  await page.getByLabel('Nama lengkap').fill('Pembeli Uji Coba')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Nomor WhatsApp').fill('0812 3456 7890')
  await page.getByLabel('Kata sandi', { exact: true }).fill('abc123')
  await page.getByRole('button', { name: 'Buat akun' }).click()
  await expect(page.getByText('Kata sandi minimal 8 karakter.')).toBeVisible()
  await page.getByLabel('Kata sandi', { exact: true }).fill('kopi-susu-7-gelas')
  await expectNoAxeViolations(page)
  await page.getByRole('button', { name: 'Buat akun' }).click()

  // Email harus diverifikasi lebih dulu sebelum memesan.
  await expect(page.getByRole('heading', { name: 'Verifikasi email dulu' })).toBeVisible()
  execFileSync('corepack', ['pnpm', 'exec', 'payload', 'run', 'src/scripts/verifikasi-akun-uji.ts', email], {
    stdio: 'ignore',
    env: { ...process.env, NODE_EXTRA_CA_CERTS: process.env.NODE_EXTRA_CA_CERTS ?? '/etc/ssl/cert.pem' },
  })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
  await expect(page.getByLabel('Nama lengkap')).toHaveValue('Pembeli Uji Coba')
  await expect(page.getByText(email)).toBeVisible()

  await page.getByLabel('Kecamatan tujuan').fill('Gubeng')
  await page.getByRole('button', { name: /Gubeng/ }).click()
  await page.getByLabel('Alamat lengkap').fill('Jl. Contoh Nomor 12, RT 01 RW 02')
  await page.getByRole('radio', { name: /JNE Reguler/ }).check()
  await page.getByRole('checkbox').check()
  await expectNoAxeViolations(page)

  await page.reload()
  await expect(page.getByLabel('Alamat lengkap')).toHaveValue('Jl. Contoh Nomor 12, RT 01 RW 02')
  await page.getByRole('radio', { name: /JNE Reguler/ }).check()
  await page.getByRole('checkbox').check()

  await page.getByRole('button', { name: 'Lanjut ke pembayaran' }).click()
  await page.waitForURL(/bayar-simulasi/)
  const code = page.url().match(/TLN-[A-Z0-9]{6}/)?.[0]
  expect(code).toBeTruthy()

  await page.getByRole('button', { name: /Bayar pesanan/ }).click()
  await page.waitForURL(/\/pesanan\//)
  await expect(page.getByRole('heading', { name: code })).toBeVisible()
  await expect(page.locator('[aria-current="step"]')).toContainText('Dibayar')
  await expectNoAxeViolations(page)

  await page.goto('/akun')
  await expect(page.getByRole('heading', { name: 'Riwayat pesanan' })).toBeVisible()
  await expect(page.getByText(code!)).toBeVisible()
  await expectNoAxeViolations(page)

  await page.goto('/lacak')
  await page.getByLabel('Kode pesanan').fill(code!)
  await page.getByLabel('4 digit nomor WA').fill('7890')
  await page.getByRole('button', { name: 'Lacak pesanan' }).click()
  await expect(page.locator('[aria-current="step"]')).toContainText('Dibayar')

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width)
})

for (const path of ['/', '/produk', '/tentang-kami', '/galeri', '/faq', '/kontak', '/syarat-ketentuan', '/masuk', '/daftar', '/lupa-sandi']) {
  test(`halaman ${path} lolos axe dan tanpa scroll horizontal`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(path)
    await expectNoAxeViolations(page)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(375)
  })
}

test('alamat admin umum tidak ada, API tertutup untuk umum', async ({ request }) => {
  expect((await request.get('/admin', { maxRedirects: 0 })).status()).toBe(404)
  expect((await request.get('/admin/login', { maxRedirects: 0 })).status()).toBe(404)
  for (const path of ['/api/users', '/api/customers', '/api/orders', '/api/customer-sessions', '/api/graphql']) {
    expect([403, 404]).toContain((await request.get(path)).status())
  }
})
