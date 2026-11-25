import type { CollectionConfig } from 'payload'

import { nobody, staffOnly, superAdminOnly } from '../access'

const readOnly = { readOnly: true }

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { singular: 'Pelanggan', plural: 'Pelanggan' },
  admin: {
    useAsTitle: 'email',
    group: 'Toko',
    defaultColumns: ['name', 'email', 'phone', 'emailVerifiedAt', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description: 'Akun pembeli di tallownara.com. Pembeli mendaftar sendiri; di sini Anda hanya melihat dan membantu.',
  },
  defaultSort: '-createdAt',
  access: {
    create: nobody,
    read: staffOnly,
    update: staffOnly,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true, unique: true, index: true },
    { name: 'phone', type: 'text', label: 'Nomor WhatsApp', index: true },
    {
      name: 'emailVerifiedAt',
      type: 'date',
      label: 'Email terverifikasi pada',
      admin: { ...readOnly, description: 'Kosong berarti pembeli belum mengeklik tautan verifikasi.' },
    },
    { name: 'lastLoginAt', type: 'date', label: 'Terakhir masuk', admin: readOnly },
    {
      name: 'passwordHash',
      type: 'text',
      access: { read: () => false, create: () => false, update: () => false },
      admin: { hidden: true },
    },
    {
      name: 'failedLogins',
      type: 'number',
      defaultValue: 0,
      access: { update: () => false },
      admin: { hidden: true },
    },
    {
      name: 'lockedUntil',
      type: 'date',
      label: 'Dikunci sampai',
      access: { update: () => false },
      admin: { ...readOnly, description: 'Akun terkunci sementara setelah 5 kali salah kata sandi.' },
    },
  ],
}
