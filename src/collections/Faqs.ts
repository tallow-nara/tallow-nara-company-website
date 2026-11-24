import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Pertanyaan', plural: 'FAQ' },
  admin: {
    useAsTitle: 'question',
    group: 'Konten',
    defaultColumns: ['question', 'category', 'sortOrder'],
    listSearchableFields: ['question', 'answer'],
    description: 'Pertanyaan yang tampil di halaman FAQ. Angka Urutan yang kecil tampil lebih dulu.',
  },
  trash: true,
  versions: { maxPerDoc: 20 },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'question', type: 'text', label: 'Pertanyaan', required: true },
    { name: 'answer', type: 'textarea', label: 'Jawaban', required: true },
    {
      name: 'category',
      type: 'select',
      label: 'Kelompok',
      required: true,
      defaultValue: 'produk',
      options: [
        { label: 'Produk', value: 'produk' },
        { label: 'Pesanan dan pembayaran', value: 'pesanan' },
        { label: 'Pengiriman dan pengembalian', value: 'pengiriman' },
      ],
    },
    { name: 'sortOrder', type: 'number', label: 'Urutan', defaultValue: 100, required: true, admin: { position: 'sidebar' } },
  ],
}
