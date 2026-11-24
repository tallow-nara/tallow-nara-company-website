import type { Metadata } from 'next'
import Image, { getImageProps } from 'next/image'
import Link from 'next/link'

import { CertStrip } from '@/components/CertStrip'
import { MediaImage } from '@/components/MediaImage'
import { ProductCard } from '@/components/shop/ProductCard'
import { TemplateText } from '@/components/TemplateText'
import { UsageGuide } from '@/components/UsageGuide'
import { getFeaturedReviews, getHome, getProducts, getSiteSettings, getVisibleAchievements } from '@/lib/content'
import { resolveHomeContent } from '@/lib/home-content'
import { toParagraphs } from '@/lib/text'
import { CONTACT } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tallownara · Perawatan kulit tallow sapi grass-fed dari Tuban',
}

export default async function HomePage() {
  const [products, reviews, achievements, settings, home] = await Promise.all([
    getProducts(),
    getFeaturedReviews(),
    getVisibleAchievements(),
    getSiteSettings(),
    getHome(),
  ])
  const content = resolveHomeContent(home)
  const stats = settings?.stats ?? []
  const withPhotos = achievements.filter((item) => (item.photos ?? []).length > 0)
  const featured = withPhotos.filter((item) => item.isFeatured)
  const highlights = (featured.length > 0 ? featured : withPhotos).slice(0, 3)
  const [storyLead, ...storyRest] = toParagraphs(content.storyBody)

  const heroCommon = { alt: content.heroImage.alt, fill: true, loading: 'eager', fetchPriority: 'high' } as const
  const {
    props: { srcSet: heroDesktop },
  } = getImageProps({ ...heroCommon, src: content.heroImage.src, sizes: '(min-width: 1440px) 1360px, 100vw' })
  const { props: heroImage } = getImageProps({
    ...heroCommon,
    alt: content.heroImageMobile.alt,
    src: content.heroImageMobile.src,
    sizes: '100vw',
  })

  return (
    <>
      <section aria-labelledby="judul-beranda" className="page-shell pt-4 sm:pt-6">
        <div className="relative">
          <div className="media-round relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(54rem,calc(100dvh-7.5rem))] lg:min-h-[38rem]">
            <picture>
              <source media="(min-width: 640px)" srcSet={heroDesktop} />
              <img
                {...heroImage}
                alt={content.heroImageMobile.alt}
                className={`object-cover ${home?.heroImage ? '' : 'sm:object-right'}`}
                style={home?.heroImage ? { ...heroImage.style, objectPosition: content.heroImage.focal } : heroImage.style}
              />
            </picture>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/30 via-ink/5 to-transparent" />
            <p className="glass-dark chip absolute bottom-5 right-5 hidden lg:inline-flex">
              {content.heroCaption}
            </p>
          </div>

          <div className="relative mx-3 -mt-24 sm:mx-6 sm:-mt-32 lg:absolute lg:inset-y-0 lg:left-0 lg:m-0 lg:flex lg:items-center lg:p-12">
            <div className="glass glass-strong max-w-xl rounded-[var(--radius-lg)] p-7 sm:p-10">
              <ul aria-label="Sertifikasi" className="flex flex-wrap gap-2">
                {content.heroBadges.map((label) => (
                  <li key={label} className="chip border border-stone bg-white/70 text-forest">
                    {label}
                  </li>
                ))}
              </ul>
              <h1 id="judul-beranda" className="mt-6 text-[clamp(2.5rem,5.2vw,4.5rem)] font-normal">
                {content.heroTitle}
              </h1>
              <p className="mt-5 text-ink/85">{content.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/produk" className="btn btn-primary">
                  Lihat produk
                </Link>
                <Link href="/#cara-pakai" className="btn btn-glass">
                  Pelajari cara pakai
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Sertifikasi dan pengujian" className="page-shell pt-8 sm:pt-10">
        <div className="panel-white px-6 py-6 sm:px-10">
          <CertStrip />
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Produk</p>
            <h2 className="section-title mt-4 max-w-2xl">{content.productsTitle}</h2>
          </div>
          <Link href="/produk" className="btn btn-outline">
            Lihat semua produk
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="panel mt-10 p-8">
            <p className="text-muted">Produk sedang disiapkan. Hubungi kami untuk pemesanan.</p>
            <a href={CONTACT.whatsappUrl} className="btn btn-primary mt-5">
              Tanya lewat WhatsApp
            </a>
          </div>
        ) : (
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-stone/70 bg-paper/50">
        <UsageGuide />
      </div>

      <section className="page-shell py-20 sm:py-28">
        <div className="reveal panel grid grid-cols-12 items-center overflow-hidden">
          <div className="relative col-span-12 aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:h-full lg:min-h-[36rem]">
            <Image
              src={content.storyImage.src}
              alt={content.storyImage.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              style={{ objectPosition: content.storyImage.focal }}
            />
          </div>
          <div className="col-span-12 p-7 sm:p-12 lg:col-span-5 lg:p-14">
            <p className="kicker">Cerita kami</p>
            <h2 className="section-title mt-4">{content.storyTitle}</h2>
            {storyLead && <p className="mt-6">{storyLead}</p>}
            {storyRest.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-muted">
                {paragraph}
              </p>
            ))}
            <Link href="/tentang-kami" className="btn btn-outline mt-8">
              Baca kisah lengkapnya
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell grid grid-cols-12 gap-x-6 pb-20 sm:pb-28">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="kicker">Sejarah</p>
            <h2 className="section-title mt-4">{content.historyTitle}</h2>
            <p className="mt-6 max-w-sm text-muted">{content.historyIntro}</p>
          </div>
        </div>
        <ol className="col-span-12 mt-10 space-y-4 lg:col-span-7 lg:col-start-6 lg:mt-0">
          {content.history.map(({ key, era, title, body, image }) => (
            <li key={key} className="reveal panel-white grid grid-cols-12 items-center gap-x-6 p-6 sm:p-8">
              <div className={image ? 'col-span-8' : 'col-span-12'}>
                <p className="font-serif text-4xl text-olive sm:text-5xl">{era}</p>
                <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal text-ink">{title}</h3>
                <p className="mt-1 text-muted">{body}</p>
              </div>
              {image && (
                <div className="relative col-span-4 aspect-square">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-contain" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="page-shell">
        <div className="media-round relative isolate">
          <Image
            src={content.processImage.src}
            alt=""
            fill
            sizes="(min-width: 1440px) 1360px, 100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: content.processImage.focal }}
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-forest/85" />
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 p-7 sm:p-12 lg:p-16">
            <div className="col-span-12 lg:col-span-5">
              <p className="kicker text-stone">Proses</p>
              <h2 className="section-title mt-4 text-white">{content.processTitle}</h2>
              <p className="mt-6 max-w-md text-ivory">{content.processIntro}</p>
            </div>
            <ol className="col-span-12 grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {content.process.map(({ title, body }, index) => (
                <li key={title} className="glass-dark rounded-[var(--radius-md)] p-6">
                  <span aria-hidden className="tabular font-serif text-3xl text-stone">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-2xl font-normal text-white">{title}</h3>
                  <p className="mt-2 text-base text-ivory">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section aria-label="Tallownara dalam angka" className="page-shell pt-8">
          <dl className="panel-white grid grid-cols-2 gap-y-10 px-6 py-10 sm:px-10 lg:grid-cols-4">
            {stats.map(({ id, value, label }) => (
              <div key={id ?? label} className="flex flex-col-reverse">
                <dt className="mt-2 text-muted">{label}</dt>
                <dd className="font-serif text-5xl text-olive sm:text-6xl">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="page-shell py-20 sm:py-28">
          <p className="kicker">Ulasan</p>
          <h2 className="section-title mt-4">{content.reviewsTitle}</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {reviews.map((review) => (
              <figure key={review.id} className="reveal panel-white grid grid-cols-12 gap-x-6 p-5 sm:p-6">
                <div className="col-span-4">
                  <MediaImage media={review.photo} sizes="(min-width: 1024px) 15vw, 33vw" className="aspect-[3/4]" />
                </div>
                <div className="col-span-8 py-2">
                  <p aria-label={`Nilai ${review.rating} dari 5`} className="text-amber">
                    {'★'.repeat(review.rating)}
                  </p>
                  <blockquote className="mt-3 font-serif text-2xl leading-snug text-ink">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-4 text-base text-muted">
                    {review.authorName}
                    {review.authorNote ? `, ${review.authorNote}` : ''}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      {highlights.length > 0 && (
        <section className="page-shell pb-20 sm:pb-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Galeri</p>
              <h2 className="section-title mt-4 max-w-2xl">{content.galleryTitle}</h2>
            </div>
            <Link href="/galeri" className="btn btn-outline">
              Buka galeri lengkap
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12">
            {highlights.map((item, index) => (
              <article
                key={item.id}
                className={`reveal col-span-12 sm:col-span-6 ${index === 0 ? 'lg:col-span-6' : 'lg:col-span-3'}`}
              >
                <Link href={`/galeri/${item.slug}`} className="group block no-underline">
                  <MediaImage
                    media={item.photos?.[0]}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4] lg:aspect-[3/4.05]'}
                  />
                  <p className="mt-4 text-sm text-muted">
                    <TemplateText text={item.dateLabel} />
                  </p>
                  <h3 className="mt-1 text-[1.75rem] font-normal text-ink group-hover:underline">{item.title}</h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="page-shell grid gap-4 pb-20 sm:pb-28 lg:grid-cols-2">
        {content.services.map(({ key, image, title, body, action }) => (
          <article
            key={key}
            className={`media-round relative isolate flex min-h-[30rem] flex-col justify-end p-4 sm:p-6 ${image ? '' : 'bg-forest'}`}
          >
            {image && (
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="-z-10 object-cover"
                style={{ objectPosition: image.focal }}
              />
            )}
            <div className="glass-dark rounded-[var(--radius-md)] p-6 sm:p-8">
              <h2 className="text-[clamp(1.875rem,3vw,2.5rem)] font-normal text-white">{title}</h2>
              <p className="mt-2 max-w-md text-base text-ivory">{body}</p>
              <a href={CONTACT.whatsappUrl} className="btn btn-light mt-6">
                {action}
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
