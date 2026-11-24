import type { CollectionConfig } from 'payload'

import { hiddenUnlessSuperAdmin, superAdminOnly } from '../access'

export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  labels: { singular: 'Webhook', plural: 'Catatan webhook' },
  admin: { useAsTitle: 'eventId', group: 'Sistem', hidden: hiddenUnlessSuperAdmin, defaultColumns: ['eventId', 'source', 'createdAt'] },
  access: { create: () => false, read: superAdminOnly, update: () => false, delete: () => false },
  fields: [
    { name: 'eventId', type: 'text', required: true, unique: true, label: 'ID kejadian' },
    { name: 'source', type: 'text', required: true, label: 'Sumber' },
  ],
}
