import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AlbumCard } from '@/components/gallery/AlbumCard'
import { PhotoGallery, type GalleryPhoto } from '@/components/gallery/PhotoGallery'
import { Paragraphs } from '@/components/Paragraphs'
import { TemplateText } from '@/components/TemplateText'
import { getAchievementBySlug, getVisibleAchievements } from '@/lib/content'
import { albumMeta, KIND_LABELS, photoCount } from '@/lib/gallery'
import type { Achievement } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getAchievementBySlug((await params).slug)
  if (!album) return {}
  const cover = album.photos?.[0]
  return {
    title: album.title,
    description: album.summary?.startsWith('[[ISI') ? undefined : (album.summary ?? undefined),
    openGraph: typeof cover === 'object' && cover?.url ? { images: [{ url: cover.url, alt: cover.alt }] } : undefined,
  }
}

function toGalleryPhotos(album: Achievement): GalleryPhoto[] {
  return (album.photos ?? []).flatMap((photo) =>
    typeof photo === 'object' && photo?.url
      ? [{ id: photo.id, src: photo.url, alt: photo.alt, width: photo.width ?? 1200, height: photo.height ?? 900 }]
      : [],
  )
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params
  const [album, albums] = await Promise.all([getAchievementBySlug(slug), getVisibleAchievements()])
  if (!album) notFound()

  const photos = toGalleryPhotos(album)
  const meta = albumMeta(album)
  const others = albums.filter((item) => item.id !== album.id && photoCount(item) > 0).slice(0, 3)

  return (
    <div className="page-shell pb-20 sm:pb-28">
      <nav aria-label="Lokasi halaman" className="pt-8 sm:pt-10">
        <Link href="/galeri" className="link-arrow">
          <span aria-hidden>←</span> Semua album
        </Link>
      </nav>

      <header className="grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-14">
        <div className="col-span-12 lg:col-span-7">
          <p className="kicker">{KIND_LABELS[album.kind]}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal">{album.title}</h1>
          {meta && (
            <p className="mt-4 text-muted">
              <TemplateText text={meta} />
            </p>
          )}
        </div>
        {album.summary && (
          <div className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            <Paragraphs text={album.summary} />
          </div>
        )}
      </header>

      {photos.length > 0 ? (
        <section aria-label={`Foto ${album.title}`}>
          <p className="mb-4 text-sm text-muted">{photos.length} foto · pilih foto untuk memperbesar</p>
          <PhotoGallery photos={photos} />
        </section>
      ) : (
        <div className="panel p-8">
          <p className="text-muted">Foto untuk album ini menyusul.</p>
        </div>
      )}

      {others.length > 0 && (
        <section aria-labelledby="judul-album-lain" className="mt-24 border-t border-stone pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="judul-album-lain" className="section-title">
              Album lainnya
            </h2>
            <Link href="/galeri" className="btn btn-outline">
              Buka galeri lengkap
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <AlbumCard key={item.id} album={item} headingLevel="h3" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
