import type { GlobalConfig } from 'payload'

const PARAGRAPH_HINT = 'Pisahkan paragraf dengan satu baris kosong.'
const EMPTY_HINT = 'Bila dikosongkan, website memakai teks bawaan.'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Beranda',
  versions: { max: 20 },
  admin: {
    group: 'Konten',
    description: 'Isi halaman depan website. Perubahan langsung tampil setelah disimpan.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Bagian pembuka',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'Judul besar', admin: { description: EMPTY_HINT } },
            { name: 'heroBody', type: 'textarea', label: 'Kalimat pembuka', admin: { rows: 3 } },
            {
              name: 'heroBadges',
              type: 'array',
              label: 'Label kecil di atas judul',
              labels: { singular: 'Label', plural: 'Label' },
              maxRows: 4,
              admin: { description: 'Contoh: Terdaftar BPOM, Halal, Organik.' },
              fields: [{ name: 'text', type: 'text', label: 'Teks', required: true }],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Foto lebar (laptop dan tablet)',
                  admin: { description: 'Foto mendatar, minimal 2000 px. Bagian kiri tertutup kotak teks.' },
                },
                {
                  name: 'heroImageMobile',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Foto tegak (HP)',
                  admin: { description: 'Foto berdiri, rasio 4:5. Bila kosong, memakai foto lebar.' },
                },
              ],
            },
            {
              name: 'heroCaption',
              type: 'text',
              label: 'Keterangan di pojok foto',
              admin: { description: 'Contoh: Diolah di Tuban, Jawa Timur. Hanya tampil di layar lebar.' },
            },
          ],
        },
        {
          label: 'Produk dan cerita',
          fields: [
            { name: 'productsTitle', type: 'text', label: 'Judul bagian produk', admin: { description: EMPTY_HINT } },
            { name: 'storyTitle', type: 'text', label: 'Judul cerita' },
            {
              name: 'storyBody',
              type: 'textarea',
              label: 'Isi cerita',
              admin: { rows: 6, description: `${PARAGRAPH_HINT} Paragraf kedua dan seterusnya tampil lebih redup.` },
            },
            { name: 'storyImage', type: 'upload', relationTo: 'media', label: 'Foto cerita' },
          ],
        },
        {
          label: 'Sejarah',
          fields: [
            { name: 'historyTitle', type: 'text', label: 'Judul bagian' },
            { name: 'historyIntro', type: 'textarea', label: 'Pengantar', admin: { rows: 2 } },
            {
              name: 'history',
              type: 'array',
              label: 'Linimasa',
              labels: { singular: 'Masa', plural: 'Masa' },
              maxRows: 5,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'era', type: 'text', label: 'Masa', required: true, admin: { description: 'Contoh: 500+ SM' } },
                    { name: 'title', type: 'text', label: 'Judul', required: true },
                  ],
                },
                { name: 'body', type: 'textarea', label: 'Penjelasan', required: true, admin: { rows: 2 } },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ilustrasi',
                  admin: { description: 'Gambar persegi berlatar polos atau transparan.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Proses',
          fields: [
            { name: 'processTitle', type: 'text', label: 'Judul bagian' },
            { name: 'processIntro', type: 'textarea', label: 'Pengantar', admin: { rows: 2 } },
            {
              name: 'processImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto latar',
              admin: { description: 'Foto ditutup warna hijau tua agar teks tetap terbaca.' },
            },
            {
              name: 'process',
              type: 'array',
              label: 'Tahapan',
              labels: { singular: 'Tahap', plural: 'Tahapan' },
              maxRows: 6,
              fields: [
                { name: 'title', type: 'text', label: 'Judul tahap', required: true },
                { name: 'body', type: 'textarea', label: 'Penjelasan', required: true, admin: { rows: 2 } },
              ],
            },
          ],
        },
        {
          label: 'Ulasan dan galeri',
          description:
            'Ulasan diambil dari menu Ulasan (yang disetujui dan ditandai unggulan). Album diambil dari menu Galeri.',
          fields: [
            { name: 'reviewsTitle', type: 'text', label: 'Judul bagian ulasan' },
            { name: 'galleryTitle', type: 'text', label: 'Judul bagian galeri' },
          ],
        },
        {
          label: 'Layanan',
          fields: [
            {
              name: 'services',
              type: 'array',
              label: 'Kartu layanan di bagian bawah',
              labels: { singular: 'Layanan', plural: 'Layanan' },
              maxRows: 4,
              admin: { description: 'Tombol tiap kartu membuka WhatsApp toko.' },
              fields: [
                { name: 'title', type: 'text', label: 'Judul', required: true },
                { name: 'body', type: 'textarea', label: 'Penjelasan', required: true, admin: { rows: 2 } },
                {
                  name: 'action',
                  type: 'text',
                  label: 'Teks tombol',
                  required: true,
                  admin: { description: 'Kata kerja + objek. Contoh: Tanyakan jadwal lokakarya' },
                },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Foto latar' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
