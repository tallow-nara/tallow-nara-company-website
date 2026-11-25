import type { CollectionConfig } from 'payload'

import { nobody } from '../access'

export const CustomerTokens: CollectionConfig = {
  slug: 'customer-tokens',
  admin: { hidden: true },
  access: { create: nobody, read: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, index: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Verifikasi email', value: 'verifikasi' },
        { label: 'Atur ulang kata sandi', value: 'reset' },
      ],
    },
    { name: 'tokenHash', type: 'text', required: true, unique: true, index: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'usedAt', type: 'date' },
  ],
}
