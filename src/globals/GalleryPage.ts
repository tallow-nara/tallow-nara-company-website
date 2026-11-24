import type { GlobalConfig } from 'payload'

export const GalleryPage: GlobalConfig = {
  slug: 'gallery-page',
  label: 'Halaman galeri',
  versions: { max: 20 },
  admin: {
    group: 'Konten',
    description: 'Judul dan pengantar halaman Galeri. Album dan fotonya diatur di menu Galeri.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', label: 'Judul halaman', admin: { description: 'Bawaan: Galeri' } },
    { name: 'intro', type: 'textarea', label: 'Pengantar', admin: { rows: 2 } },
    {
      name: 'otherEventsTitle',
      type: 'text',
      label: 'Judul daftar album tanpa foto',
      admin: { description: 'Bawaan: Juga hadir di' },
    },
  ],
}
