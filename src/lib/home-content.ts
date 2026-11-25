import type { Home, Media } from '@/payload-types'

export type ImageSource = { src: string; alt: string; focal: string }

export function pickImage(media: number | Media | null | undefined, fallback: Omit<ImageSource, 'focal'>): ImageSource {
  if (media && typeof media === 'object' && media.url) {
    return { src: media.url, alt: media.alt, focal: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }
  }
  return { ...fallback, focal: '50% 50%' }
}

function text(value: string | null | undefined, fallback: string): string {
  return value?.trim() ? value : fallback
}

function list<T>(items: T[] | null | undefined, fallback: T[]): T[] {
  return items && items.length > 0 ? items : fallback
}

export const HOME_DEFAULTS = {
  heroTitle: 'Tallow sapi grass-fed untuk kulit yang terawat.',
  heroBody:
    'Balm dan sabun yang melembapkan serta membantu menjaga skin barrier, dibuat dari lemak sapi grass-fed asal Tuban dengan bahan sesederhana mungkin.',
  heroBadges: ['Terdaftar BPOM', 'Halal', 'Organik'],
  heroCaption: 'Diolah di Bogor, Jawa Barat',
  heroImage: {
    src: '/foto/hero-peternakan.webp',
    alt: 'Toples tallow balm dan botol sabun Tallownara di pagar peternakan saat matahari terbenam',
  },
  heroImageMobile: {
    src: '/foto/hero-potret.webp',
    alt: 'Toples tallow balm dan botol sabun Tallownara di pagar peternakan saat matahari terbenam',
  },
  productsTitle: 'Sedikit bahan, dipilih dengan teliti',
  storyTitle: 'Bermula dari seorang ibu',
  storyBody:
    'Tallownara lahir dari pencarian seorang ibu akan perawatan yang lembut untuk bayinya. Pencarian itu berujung pada tallow, bahan yang sudah dikenal sejak ribuan tahun lalu, dan pada para peternak di Tuban.\n\nKini kami mengolah lemak yang sering terbuang menjadi perawatan kulit, sambil melibatkan anak-anak yatim piatu dan kurang mampu dalam proses produksi.',
  storyImage: { src: '/foto/tangan-bayi.webp', alt: 'Tangan seorang ibu mengoleskan balm ke kaki bayi' },
  historyTitle: 'Bahan tertua dalam perawatan kulit',
  historyIntro: 'Jauh sebelum ada botol dan label, manusia sudah memakai tallow untuk menjaga kulitnya.',
  history: [
    {
      era: '2000+ SM',
      title: 'Mesir kuno',
      body: 'Tallow dipakai untuk melembapkan kulit dari iklim gurun yang keras dan kering.',
      image: { src: '/foto/piramida.webp', alt: 'Ilustrasi piramida Mesir' },
    },
    {
      era: '500+ SM',
      title: 'Yunani kuno',
      body: 'Atlet dan prajurit memakainya agar kulit terasa kenyal dan terlindungi.',
      image: { src: '/foto/parthenon.webp', alt: 'Ilustrasi kuil Yunani kuno' },
    },
    {
      era: 'Hari ini',
      title: 'Tuban, Jawa Timur',
      body: 'Asam lemaknya menyerupai sebum manusia, sehingga mudah menyerap ke kulit.',
      image: { src: '/foto/krim.webp', alt: 'Tekstur tallow balm berwarna gading' },
    },
  ],
  processTitle: 'Dari padang rumput ke toples',
  processIntro: 'Lemak dipilih dari peternak lokal di Tuban, lalu diolah sampai dikemas di Bogor.',
  processImage: { src: '/foto/sapi-padang.webp', alt: '' },
  process: [
    { title: 'Sapi yang diberi pakan rumput', body: 'Lemak berasal dari peternak lokal di Tuban, bersertifikat halal dan organik.' },
    { title: 'Rendering suhu rendah', body: 'Dimasak perlahan dengan metode basah pada peralatan baja tahan karat SS 316Ti.' },
    { title: 'Penyaringan ganda', body: 'Tallow disaring dua kali sebelum diolah menjadi balm dan sabun.' },
    { title: 'Uji laboratorium dan BPOM', body: 'Setiap formula melalui pengujian keamanan dan terdaftar di BPOM.' },
  ],
  reviewsTitle: 'Kata mereka yang memakainya',
  galleryTitle: 'Dari Tuban ke panggung dunia',
  services: [
    {
      title: 'Lokakarya perawatan kulit tallow',
      body: 'Mengenal tallow dan perawatan kulit bersama tim kami.',
      action: 'Tanyakan jadwal lokakarya',
      image: { src: '/foto/lokakarya.webp', alt: '' },
    },
    {
      title: 'Tallow sapi sebagai bahan baku',
      body: 'Tallow grass-fed bersertifikat halal, untuk mitra yang membutuhkan pasokan bahan baku.',
      action: 'Minta penawaran bahan baku',
      image: { src: '/foto/beef-tallow.webp', alt: '' },
    },
  ],
}

export function resolveHomeContent(home: Partial<Home> | null) {
  const d = HOME_DEFAULTS
  const heroImage = pickImage(home?.heroImage, d.heroImage)

  return {
    heroTitle: text(home?.heroTitle, d.heroTitle),
    heroBody: text(home?.heroBody, d.heroBody),
    heroBadges: list(home?.heroBadges?.map((badge) => badge.text), d.heroBadges),
    heroCaption: text(home?.heroCaption, d.heroCaption),
    heroImage,
    heroImageMobile: home?.heroImage
      ? pickImage(home?.heroImageMobile, heroImage)
      : pickImage(home?.heroImageMobile, d.heroImageMobile),
    productsTitle: text(home?.productsTitle, d.productsTitle),
    storyTitle: text(home?.storyTitle, d.storyTitle),
    storyBody: text(home?.storyBody, d.storyBody),
    storyImage: pickImage(home?.storyImage, d.storyImage),
    historyTitle: text(home?.historyTitle, d.historyTitle),
    historyIntro: text(home?.historyIntro, d.historyIntro),
    history: home?.history?.length
      ? home.history.map((item, index) => ({
          ...item,
          image: item.image ? pickImage(item.image, d.history[0].image) : null,
          key: item.id ?? String(index),
        }))
      : d.history.map((item) => ({ ...item, image: pickImage(null, item.image), key: item.title })),
    processTitle: text(home?.processTitle, d.processTitle),
    processIntro: text(home?.processIntro, d.processIntro),
    processImage: pickImage(home?.processImage, d.processImage),
    process: list(home?.process, d.process),
    reviewsTitle: text(home?.reviewsTitle, d.reviewsTitle),
    galleryTitle: text(home?.galleryTitle, d.galleryTitle),
    services: home?.services?.length
      ? home.services.map((item, index) => ({
          ...item,
          image: item.image ? pickImage(item.image, d.services[0].image) : null,
          key: item.id ?? String(index),
        }))
      : d.services.map((item) => ({ ...item, image: pickImage(null, item.image), key: item.title })),
  }
}
