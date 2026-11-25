import type { CollectionConfig } from 'payload'

import { nobody } from '../access'

export const CustomerSessions: CollectionConfig = {
  slug: 'customer-sessions',
  admin: { hidden: true },
  access: { create: nobody, read: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, index: true },
    { name: 'tokenHash', type: 'text', required: true, unique: true, index: true },
    { name: 'expiresAt', type: 'date', required: true, index: true },
  ],
}
