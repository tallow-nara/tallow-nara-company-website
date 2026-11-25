export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    products: Product;
    orders: Order;
    customers: Customer;
    reviews: Review;
    achievements: Achievement;
    'legal-pages': LegalPage;
    faqs: Faq;
    media: Media;
    users: User;
    'otp-codes': OtpCode;
    'customer-sessions': CustomerSession;
    'customer-tokens': CustomerToken;
    'webhook-events': WebhookEvent;
    'payload-kv': PayloadKv;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    products: ProductsSelect<false> | ProductsSelect<true>;
    orders: OrdersSelect<false> | OrdersSelect<true>;
    customers: CustomersSelect<false> | CustomersSelect<true>;
    reviews: ReviewsSelect<false> | ReviewsSelect<true>;
    achievements: AchievementsSelect<false> | AchievementsSelect<true>;
    'legal-pages': LegalPagesSelect<false> | LegalPagesSelect<true>;
    faqs: FaqsSelect<false> | FaqsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'otp-codes': OtpCodesSelect<false> | OtpCodesSelect<true>;
    'customer-sessions': CustomerSessionsSelect<false> | CustomerSessionsSelect<true>;
    'customer-tokens': CustomerTokensSelect<false> | CustomerTokensSelect<true>;
    'webhook-events': WebhookEventsSelect<false> | WebhookEventsSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  fallbackLocale: null;
  globals: {
    home: Home;
    about: About;
    'gallery-page': GalleryPage;
    'site-settings': SiteSetting;
  };
  globalsSelect: {
    home: HomeSelect<false> | HomeSelect<true>;
    about: AboutSelect<false> | AboutSelect<true>;
    'gallery-page': GalleryPageSelect<false> | GalleryPageSelect<true>;
    'site-settings': SiteSettingsSelect<false> | SiteSettingsSelect<true>;
  };
  locale: null;
  widgets: {
    collections: CollectionsWidget;
  };
  user: User;
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  hasVariants?: boolean | null;
  sizeLabel?: string | null;
  price?: number | null;
  stock?: number | null;
  weightGrams?: number | null;
  variants?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  isExamplePrice?: boolean | null;
  images?: (number | Media)[] | null;
  description?: string | null;
  benefits?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  howToUse?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  ingredients?: string | null;
  storage?: string | null;
  hasBpom?: boolean | null;
  bpomNumber?: string | null;
  showHalalLabel?: boolean | null;
  isBestSeller?: boolean | null;
  isVisible?: boolean | null;
  sortOrder: number;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}
export interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
export interface Order {
  id: number;
  code: string;
  status:
    | 'menunggu_pembayaran'
    | 'dibayar'
    | 'dikemas'
    | 'dikirim'
    | 'selesai'
    | 'kedaluwarsa'
    | 'dibatalkan'
    | 'dikembalikan';
  items: {
    productId: number;
    name: string;
    variantLabel?: string | null;
    variantId?: string | null;
    unitPrice: number;
    quantity: number;
    weightGrams: number;
    id?: string | null;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customer?: (number | null) | Customer;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressStreet: string;
  areaLabel: string;
  areaId: string;
  postalCode: string;
  trackingNumber?: string | null;
  shippingProvider: string;
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  paymentProvider?: string | null;
  paymentUrl?: string | null;
  accessToken: string;
  expiresAt: string;
  paidAt?: string | null;
  statusHistory?:
    | {
        status: string;
        at: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  passwordHash?: string | null;
  failedLogins?: number | null;
  lockedUntil?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface Review {
  id: number;
  authorName: string;
  authorNote?: string | null;
  product?: (number | null) | Product;
  rating: number;
  body: string;
  photo?: (number | null) | Media;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  isFeatured?: boolean | null;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}
export interface Achievement {
  id: number;
  title: string;
  kind: 'lomba' | 'acara' | 'kegiatan';
  dateLabel?: string | null;
  location?: string | null;
  summary?: string | null;
  photos?: (number | Media)[] | null;
  slug?: string | null;
  isFeatured?: boolean | null;
  sortOrder: number;
  isVisible?: boolean | null;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}
export interface LegalPage {
  id: number;
  title: string;
  slug: string;
  lead?: string | null;
  updatedLabel?: string | null;
  sections?:
    | {
        heading: string;
        body: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: 'produk' | 'pesanan' | 'pengiriman';
  sortOrder: number;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}
export interface User {
  id: number;
  name?: string | null;
  role: 'super-admin' | 'admin';
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  resetPasswordRequestedAt?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
  collection: 'users';
}
export interface OtpCode {
  id: number;
  phone: string;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  consumedAt?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface CustomerSession {
  id: number;
  customer: number | Customer;
  tokenHash: string;
  expiresAt: string;
  updatedAt: string;
  createdAt: string;
}
export interface CustomerToken {
  id: number;
  customer: number | Customer;
  kind: 'verifikasi' | 'reset';
  tokenHash: string;
  expiresAt: string;
  usedAt?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface WebhookEvent {
  id: number;
  eventId: string;
  source: string;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadKv {
  id: number;
  key: string;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
}
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'products';
        value: number | Product;
      } | null)
    | ({
        relationTo: 'orders';
        value: number | Order;
      } | null)
    | ({
        relationTo: 'customers';
        value: number | Customer;
      } | null)
    | ({
        relationTo: 'reviews';
        value: number | Review;
      } | null)
    | ({
        relationTo: 'achievements';
        value: number | Achievement;
      } | null)
    | ({
        relationTo: 'legal-pages';
        value: number | LegalPage;
      } | null)
    | ({
        relationTo: 'faqs';
        value: number | Faq;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'otp-codes';
        value: number | OtpCode;
      } | null)
    | ({
        relationTo: 'customer-sessions';
        value: number | CustomerSession;
      } | null)
    | ({
        relationTo: 'customer-tokens';
        value: number | CustomerToken;
      } | null)
    | ({
        relationTo: 'webhook-events';
        value: number | WebhookEvent;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface ProductsSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  tagline?: T;
  hasVariants?: T;
  sizeLabel?: T;
  price?: T;
  stock?: T;
  weightGrams?: T;
  variants?: T;
  isExamplePrice?: T;
  images?: T;
  description?: T;
  benefits?:
    | T
    | {
        text?: T;
        id?: T;
      };
  howToUse?:
    | T
    | {
        text?: T;
        id?: T;
      };
  ingredients?: T;
  storage?: T;
  hasBpom?: T;
  bpomNumber?: T;
  showHalalLabel?: T;
  isBestSeller?: T;
  isVisible?: T;
  sortOrder?: T;
  updatedAt?: T;
  createdAt?: T;
  deletedAt?: T;
}
export interface OrdersSelect<T extends boolean = true> {
  code?: T;
  status?: T;
  items?:
    | T
    | {
        productId?: T;
        name?: T;
        variantLabel?: T;
        variantId?: T;
        unitPrice?: T;
        quantity?: T;
        weightGrams?: T;
        id?: T;
      };
  subtotal?: T;
  shippingCost?: T;
  total?: T;
  customer?: T;
  customerName?: T;
  customerEmail?: T;
  customerPhone?: T;
  addressStreet?: T;
  areaLabel?: T;
  areaId?: T;
  postalCode?: T;
  trackingNumber?: T;
  shippingProvider?: T;
  courierCode?: T;
  courierName?: T;
  serviceCode?: T;
  serviceName?: T;
  paymentProvider?: T;
  paymentUrl?: T;
  accessToken?: T;
  expiresAt?: T;
  paidAt?: T;
  statusHistory?:
    | T
    | {
        status?: T;
        at?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
export interface CustomersSelect<T extends boolean = true> {
  name?: T;
  email?: T;
  phone?: T;
  emailVerifiedAt?: T;
  lastLoginAt?: T;
  passwordHash?: T;
  failedLogins?: T;
  lockedUntil?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface ReviewsSelect<T extends boolean = true> {
  authorName?: T;
  authorNote?: T;
  product?: T;
  rating?: T;
  body?: T;
  photo?: T;
  status?: T;
  isFeatured?: T;
  updatedAt?: T;
  createdAt?: T;
  deletedAt?: T;
}
export interface AchievementsSelect<T extends boolean = true> {
  title?: T;
  kind?: T;
  dateLabel?: T;
  location?: T;
  summary?: T;
  photos?: T;
  slug?: T;
  isFeatured?: T;
  sortOrder?: T;
  isVisible?: T;
  updatedAt?: T;
  createdAt?: T;
  deletedAt?: T;
}
export interface LegalPagesSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  lead?: T;
  updatedLabel?: T;
  sections?:
    | T
    | {
        heading?: T;
        body?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
export interface FaqsSelect<T extends boolean = true> {
  question?: T;
  answer?: T;
  category?: T;
  sortOrder?: T;
  updatedAt?: T;
  createdAt?: T;
  deletedAt?: T;
}
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  deletedAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  role?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  resetPasswordRequestedAt?: T;
  loginAttempts?: T;
  lockUntil?: T;
  sessions?:
    | T
    | {
        id?: T;
        createdAt?: T;
        expiresAt?: T;
      };
}
export interface OtpCodesSelect<T extends boolean = true> {
  phone?: T;
  codeHash?: T;
  expiresAt?: T;
  attempts?: T;
  consumedAt?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface CustomerSessionsSelect<T extends boolean = true> {
  customer?: T;
  tokenHash?: T;
  expiresAt?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface CustomerTokensSelect<T extends boolean = true> {
  customer?: T;
  kind?: T;
  tokenHash?: T;
  expiresAt?: T;
  usedAt?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface WebhookEventsSelect<T extends boolean = true> {
  eventId?: T;
  source?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
}
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
export interface Home {
  id: number;
  heroTitle?: string | null;
  heroBody?: string | null;
  heroBadges?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  heroImage?: (number | null) | Media;
  heroImageMobile?: (number | null) | Media;
  heroCaption?: string | null;
  productsTitle?: string | null;
  storyTitle?: string | null;
  storyBody?: string | null;
  storyImage?: (number | null) | Media;
  historyTitle?: string | null;
  historyIntro?: string | null;
  history?:
    | {
        era: string;
        title: string;
        body: string;
        image?: (number | null) | Media;
        id?: string | null;
      }[]
    | null;
  processTitle?: string | null;
  processIntro?: string | null;
  processImage?: (number | null) | Media;
  process?:
    | {
        title: string;
        body: string;
        id?: string | null;
      }[]
    | null;
  reviewsTitle?: string | null;
  galleryTitle?: string | null;
  services?:
    | {
        title: string;
        body: string;
        action: string;
        image?: (number | null) | Media;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface About {
  id: number;
  heroTitle?: string | null;
  storyBody?: string | null;
  storyImage?: (number | null) | Media;
  vision?: string | null;
  missions?:
    | {
        text: string;
        id?: string | null;
      }[]
    | null;
  sourcingTitle?: string | null;
  sourcingBody?: string | null;
  sourcingImage?: (number | null) | Media;
  sourcingPoints?:
    | {
        title: string;
        body: string;
        id?: string | null;
      }[]
    | null;
  team?:
    | {
        name: string;
        role: string;
        group: 'founder' | 'advisor';
        photo?: (number | null) | Media;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface GalleryPage {
  id: number;
  title?: string | null;
  intro?: string | null;
  otherEventsTitle?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface SiteSetting {
  id: number;
  legalName?: string | null;
  legalAddress?: string | null;
  nib?: string | null;
  hours?: string | null;
  stats?:
    | {
        value: string;
        label: string;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface HomeSelect<T extends boolean = true> {
  heroTitle?: T;
  heroBody?: T;
  heroBadges?:
    | T
    | {
        text?: T;
        id?: T;
      };
  heroImage?: T;
  heroImageMobile?: T;
  heroCaption?: T;
  productsTitle?: T;
  storyTitle?: T;
  storyBody?: T;
  storyImage?: T;
  historyTitle?: T;
  historyIntro?: T;
  history?:
    | T
    | {
        era?: T;
        title?: T;
        body?: T;
        image?: T;
        id?: T;
      };
  processTitle?: T;
  processIntro?: T;
  processImage?: T;
  process?:
    | T
    | {
        title?: T;
        body?: T;
        id?: T;
      };
  reviewsTitle?: T;
  galleryTitle?: T;
  services?:
    | T
    | {
        title?: T;
        body?: T;
        action?: T;
        image?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
export interface AboutSelect<T extends boolean = true> {
  heroTitle?: T;
  storyBody?: T;
  storyImage?: T;
  vision?: T;
  missions?:
    | T
    | {
        text?: T;
        id?: T;
      };
  sourcingTitle?: T;
  sourcingBody?: T;
  sourcingImage?: T;
  sourcingPoints?:
    | T
    | {
        title?: T;
        body?: T;
        id?: T;
      };
  team?:
    | T
    | {
        name?: T;
        role?: T;
        group?: T;
        photo?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
export interface GalleryPageSelect<T extends boolean = true> {
  title?: T;
  intro?: T;
  otherEventsTitle?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
export interface SiteSettingsSelect<T extends boolean = true> {
  legalName?: T;
  legalAddress?: T;
  nib?: T;
  hours?: T;
  stats?:
    | T
    | {
        value?: T;
        label?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
export interface CollectionsWidget {
  data?: {
    [k: string]: unknown;
  };
  width: 'full';
}
export interface Auth {
  [k: string]: unknown;
}

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}