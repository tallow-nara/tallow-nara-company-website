import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { id } from '@payloadcms/translations/languages/id'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Achievements } from './collections/Achievements'
import { CustomerSessions } from './collections/CustomerSessions'
import { CustomerTokens } from './collections/CustomerTokens'
import { Customers } from './collections/Customers'
import { Faqs } from './collections/Faqs'
import { LegalPages } from './collections/LegalPages'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { OtpCodes } from './collections/OtpCodes'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { WebhookEvents } from './collections/WebhookEvents'
import { About } from './globals/About'
import { GalleryPage } from './globals/GalleryPage'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { serverEnv } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const trustedOrigins = [
  serverEnv.NEXT_PUBLIC_SITE_URL,
  ...(isProduction
    ? []
    : [3000, 3001, 3002].flatMap((port) => [`http://localhost:${port}`, `http://127.0.0.1:${port}`])),
]

export default buildConfig({
  routes: { admin: serverEnv.ADMIN_PATH },
  graphQL: { disable: true },
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    theme: 'light',
    user: Users.slug,
    importMap: {
      baseDir: dirname,
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/importMap.js'),
    },
    meta: { titleSuffix: ' · Tallownara' },
    components: {
      views: { dashboard: { Component: '/components/admin/dashboard/Dashboard#Dashboard' } },
      beforeNavLinks: ['/components/admin/NavDashboardLink#NavDashboardLink'],
      graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Logo#Icon' },
    },
  },
  collections: [
    Products,
    Orders,
    Customers,
    Reviews,
    Achievements,
    LegalPages,
    Faqs,
    Media,
    Users,
    OtpCodes,
    CustomerSessions,
    CustomerTokens,
    WebhookEvents,
  ],
  globals: [Home, About, GalleryPage, SiteSettings],
  db: postgresAdapter({
    pool: { connectionString: serverEnv.DATABASE_URL },
  }),
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'id',
    supportedLanguages: { id },
    translations: { id: { general: { true: 'Ya', false: 'Tidak' } } },
  },
  secret: serverEnv.PAYLOAD_SECRET,
  sharp,
  typescript: {
    autoGenerate: false,
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
