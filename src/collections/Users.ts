import { APIError, type CollectionConfig } from 'payload'

import { hiddenUnlessSuperAdmin, isStaffUser, isSuperAdminUser, selfOrSuperAdmin, superAdminField, superAdminOnly } from '../access'
import { checkPassword, STAFF_PASSWORD_MIN } from '../lib/password-policy'

const isProduction = process.env.NODE_ENV === 'production'

const fail = (message: string) => new APIError(message, 400, undefined, true)

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Akun admin', plural: 'Akun admin' },
  admin: {
    useAsTitle: 'email',
    group: 'Pengaturan',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    hidden: hiddenUnlessSuperAdmin,
    description:
      'Siapa saja yang bisa masuk ke admin. Super admin mengelola akun dan pengaturan; Admin mengelola konten, produk, dan pesanan.',
  },
  auth: {
    tokenExpiration: 8 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: isProduction },
  },
  access: {
    admin: ({ req }) => isStaffUser(req.user as never),
    create: superAdminOnly,
    read: selfOrSuperAdmin,
    update: selfOrSuperAdmin,
    delete: ({ req, id }) => isSuperAdminUser(req.user as never) && String(req.user?.id) !== String(id),
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data) return data

        // Akun pertama yang dibuat lewat layar "buat admin pertama" otomatis menjadi Super admin.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'super-admin'
        }

        if (typeof data.password === 'string' && data.password.length > 0) {
          const problem = checkPassword(data.password, STAFF_PASSWORD_MIN)
          if (problem) throw fail(problem)
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        // Jaga agar selalu ada minimal satu Super admin.
        if (operation === 'update' && originalDoc?.role === 'super-admin' && data.role && data.role !== 'super-admin') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'super-admin' } },
            req,
          })
          if (totalDocs <= 1) throw fail('Harus ada minimal satu Super admin. Jadikan akun lain Super admin lebih dulu.')
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = await req.payload.findByID({ collection: 'users', id, depth: 0, req })
        if (doc.role !== 'super-admin') return
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          where: { role: { equals: 'super-admin' } },
          req,
        })
        if (totalDocs <= 1) throw fail('Super admin terakhir tidak bisa dihapus.')
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama', admin: { description: 'Nama yang mudah dikenali tim.' } },
    {
      name: 'role',
      type: 'select',
      label: 'Peran',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Super admin (semua akses, termasuk akun admin)', value: 'super-admin' },
        { label: 'Admin (konten, produk, pesanan)', value: 'admin' },
      ],
      access: { create: superAdminField, update: superAdminField },
      admin: {
        position: 'sidebar',
        description: 'Hanya Super admin yang bisa mengubah peran.',
      },
    },
  ],
}
