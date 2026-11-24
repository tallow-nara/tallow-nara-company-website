import type { CollectionConfig } from 'payload'

import { slugify } from '../lib/text'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: { singular: 'Album galeri', plural: 'Galeri' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten',
    defaultColumns: ['title', 'kind', 'dateLabel', 'photos', 'isFeatured', 'isVisible'],
    description:
      'Satu album untuk satu lomba, acara, atau kegiatan. Album dengan foto tampil sebagai kartu di halaman Galeri; album tanpa foto tampil di daftar "Juga hadir di".',
    listSearchableFields: ['title', 'location'],
  },
  defaultSort: 'sortOrder',
  trash: true,
  versions: { maxPerDoc: 20 },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && typeof data.title === 'string') data.slug = slugify(data.title)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Judul album', required: true },
    {
      name: 'kind',
      type: 'select',
      label: 'Jenis',
      required: true,
      defaultValue: 'acara',
      options: [
        { label: 'Lomba atau penghargaan', value: 'lomba' },
        { label: 'Acara atau pameran', value: 'acara' },
        { label: 'Kegiatan (produksi, lokakarya, dll.)', value: 'kegiatan' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dateLabel',
          type: 'text',
          label: 'Waktu',
          admin: { description: 'Contoh: Mei 2026' },
        },
        { name: 'location', type: 'text', label: 'Lokasi', admin: { description: 'Contoh: Beograd, Serbia' } },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Cerita singkat',
      admin: { description: 'Dua sampai tiga kalimat. Di kartu galeri hanya tiga baris pertama yang terlihat.' },
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto',
      admin: {
        description:
          'Foto pertama menjadi sampul. Seret untuk mengubah urutan. Bisa memilih atau mengunggah banyak foto sekaligus. Isi "Teks alternatif" tiap foto dengan keterangan singkat; teks ini juga tampil sebagai keterangan foto.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Alamat halaman',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Terisi otomatis dari judul. Contoh: tei-2026 → tallownara.com/galeri/tei-2026',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Tampilkan di beranda',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Maksimal tiga album dengan foto. Bila tidak ada yang dicentang, beranda memakai tiga album teratas.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Urutan',
      defaultValue: 100,
      required: true,
      admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      label: 'Tampilkan di website',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
