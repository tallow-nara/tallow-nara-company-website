import type { CollectionConfig } from 'payload'

import { parseVariants, summarize, syncItems, variantProblems } from '../lib/products/variants'

const wholeNumber = (value: unknown) =>
  Number.isInteger(value) && Number(value) >= 0 ? true : 'Isi dengan angka bulat tanpa titik atau koma.'

const withoutVariants = (data: Partial<{ hasVariants: boolean | null }> | undefined) => !data?.hasVariants
const withVariants = (data: Partial<{ hasVariants: boolean | null }> | undefined) => Boolean(data?.hasVariants)

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produk', plural: 'Produk' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'stock', 'hasVariants', 'isVisible'],
    group: 'Toko',
    listSearchableFields: ['name', 'slug'],
    description:
      'Harga, stok, foto, dan deskripsi produk. Stok berkurang otomatis saat pesanan dibayar. Produk yang dihapus masuk Sampah dan bisa dipulihkan.',
  },
  defaultSort: 'sortOrder',
  trash: true,
  versions: { maxPerDoc: 20 },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const merged = { ...originalDoc, ...data }
        if (!merged.hasVariants) return data
        const config = parseVariants(merged.variants)
        const items = syncItems(config, { price: merged.price ?? 0, weightGrams: merged.weightGrams ?? 0 })
        const next = { ...config, items }
        const summary = summarize(next)
        return {
          ...data,
          variants: next,
          price: summary?.price ?? 0,
          stock: summary?.stock ?? 0,
          weightGrams: summary?.weightGrams ?? 0,
        }
      },
    ],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Utama',
          fields: [
            { name: 'name', type: 'text', label: 'Nama produk', required: true },
            {
              name: 'slug',
              type: 'text',
              label: 'Alamat halaman',
              required: true,
              unique: true,
              admin: { description: 'Huruf kecil dan tanda hubung. Contoh: luxury-tallow-balm' },
            },
            { name: 'tagline', type: 'text', label: 'Keterangan singkat' },
            {
              name: 'hasVariants',
              type: 'checkbox',
              label: 'Produk ini punya pilihan (volume, aroma, dan sejenisnya)',
              defaultValue: false,
              admin: {
                description:
                  'Centang bila pembeli perlu memilih, misalnya 30 ml / 50 ml / 100 ml atau Unscented / Lavender. Setiap kombinasi punya harga dan stok sendiri.',
              },
            },
            {
              name: 'sizeLabel',
              type: 'text',
              label: 'Ukuran',
              admin: { description: 'Contoh: 120 ml', condition: withoutVariants },
            },
            {
              type: 'row',
              admin: { condition: withoutVariants },
              fields: [
                { name: 'price', type: 'number', label: 'Harga (rupiah)', required: true, validate: wholeNumber, admin: { condition: withoutVariants } },
                { name: 'stock', type: 'number', label: 'Stok', required: true, defaultValue: 0, validate: wholeNumber, admin: { condition: withoutVariants } },
                { name: 'weightGrams', type: 'number', label: 'Berat kirim (gram)', required: true, validate: wholeNumber, admin: { condition: withoutVariants } },
              ],
            },
            {
              name: 'variants',
              type: 'json',
              label: 'Pilihan dan harga',
              defaultValue: { options: [], items: [] },
              admin: {
                condition: withVariants,
                components: { Field: '/components/admin/variants/VariantField#VariantField' },
              },
              validate: (value: unknown, { siblingData }: { siblingData: Partial<{ hasVariants: boolean | null }> }) => {
                if (!siblingData?.hasVariants) return true
                const problems = variantProblems(parseVariants(value))
                return problems.length === 0 ? true : problems[0]
              },
            },
            {
              name: 'isExamplePrice',
              type: 'checkbox',
              label: 'Harga masih contoh',
              defaultValue: true,
              admin: { description: 'Hilangkan centang setelah harga asli diisi. Selama tercentang, website menandai harga sebagai contoh.' },
            },
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: 'Foto produk' },
          ],
        },
        {
          label: 'Keterangan',
          fields: [
            { name: 'description', type: 'textarea', label: 'Deskripsi', admin: { rows: 6, description: 'Pakai bahasa kosmetik. Hindari klaim mengobati atau menyembuhkan.' } },
            { name: 'benefits', type: 'array', label: 'Manfaat', labels: { singular: 'Manfaat', plural: 'Manfaat' }, fields: [{ name: 'text', type: 'text', label: 'Isi', required: true }] },
            { name: 'howToUse', type: 'array', label: 'Cara pakai', labels: { singular: 'Langkah', plural: 'Langkah' }, fields: [{ name: 'text', type: 'textarea', label: 'Isi', required: true }] },
            { name: 'ingredients', type: 'textarea', label: 'Komposisi' },
            { name: 'storage', type: 'textarea', label: 'Penyimpanan' },
          ],
        },
        {
          label: 'Label',
          description: 'Label yang tampil di halaman produk dan kartu katalog.',
          fields: [
            {
              name: 'hasBpom',
              type: 'checkbox',
              label: 'Produk ini terdaftar di BPOM',
              defaultValue: true,
              admin: { description: 'Hilangkan centang bila produk belum punya nomor notifikasi BPOM. Keterangan BPOM tidak akan tampil di website.' },
            },
            {
              name: 'bpomNumber',
              type: 'text',
              label: 'Nomor notifikasi BPOM',
              admin: {
                condition: (data) => Boolean(data?.hasBpom),
                description: 'Contoh: NA18250118219. Tampil di halaman produk.',
              },
              validate: (value: unknown, { siblingData }: { siblingData: Partial<{ hasBpom: boolean | null }> }) =>
                !siblingData?.hasBpom || (typeof value === 'string' && value.trim().length > 0)
                  ? true
                  : 'Isi nomor notifikasi BPOM, atau hilangkan centang "terdaftar di BPOM".',
            },
            {
              name: 'showHalalLabel',
              type: 'checkbox',
              label: 'Tampilkan Label Halal Indonesia',
              defaultValue: true,
              admin: { description: 'Logo Halal Indonesia tampil di halaman produk dan tulisan "Halal" di kartu katalog. Nomor sertifikat tidak ditampilkan.' },
            },
          ],
        },
      ],
    },
    { name: 'isBestSeller', type: 'checkbox', label: 'Produk terlaris', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isVisible', type: 'checkbox', label: 'Tampilkan di website', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', label: 'Urutan', defaultValue: 100, required: true, admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' } },
  ],
}
