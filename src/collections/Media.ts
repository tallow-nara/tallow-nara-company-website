import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Foto', plural: 'Pustaka foto' },
  admin: {
    group: 'Konten',
    description:
      'Semua foto website. Atur "titik fokus" saat mengunggah agar bagian penting (misalnya wajah) tidak terpotong di kartu.',
  },
  access: { read: () => true },
  trash: true,
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Teks alternatif',
      required: true,
      admin: {
        description:
          'Jelaskan isi foto dalam satu kalimat, misalnya "Tim Tallownara di stan pameran Beograd". Dibacakan untuk pengguna tunanetra dan tampil sebagai keterangan di galeri.',
      },
    },
  ],
}
