import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/EmptyState'
import { AlbumCard } from '@/components/gallery/AlbumCard'
import { TemplateText } from '@/components/TemplateText'
import { getGalleryPage, getVisibleAchievements } from '@/lib/content'
import { albumMeta, isAlbumKind, KIND_LABELS, KIND_ORDER, photoCount } from '@/lib/gallery'

export const dynamic = 'force-dynamic'

const DEFAULT_TITLE = 'Galeri'
const DEFAULT_INTRO = 'Jejak Tallownara di panggung kompetisi, pameran, dan dapur produksi di Bogor.'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGalleryPage()
  return {
    title: page?.title || DEFAULT_TITLE,
    description: page?.intro || DEFAULT_INTRO,
  }
}

type Props = { searchParams: Promise<{ jenis?: string | string[] }> }

export default async function GalleryPage({ searchParams }: Props) {
  const [albums, page, { jenis }] = await Promise.all([getVisibleAchievements(), getGalleryPage(), searchParams])

  if (albums.length === 0) {
    return (
      <EmptyState
        title="Galeri masih kosong"
        body="Foto dan cerita dari kompetisi serta pameran kami akan tampil di sini."
        href="/tentang-kami"
        action="Baca cerita kami"
      />
    )
  }

  const activeKind = isAlbumKind(jenis) ? jenis : null
  const withPhotos = albums.filter((album) => photoCount(album) > 0)
  const withoutPhotos = albums.filter((album) => photoCount(album) === 0)
  const kinds = KIND_ORDER.filter((kind) => withPhotos.some((album) => album.kind === kind))
  const shown = activeKind ? withPhotos.filter((album) => album.kind === activeKind) : withPhotos

  const filters = [
    { href: '/galeri', label: 'Semua', isActive: activeKind === null },
    ...kinds.map((kind) => ({ href: `/galeri?jenis=${kind}`, label: KIND_LABELS[kind], isActive: activeKind === kind })),
  ]

  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="grid grid-cols-12 gap-x-6 gap-y-6 py-14 sm:py-20">
        <div className="col-span-12 lg:col-span-8">
          <p className="kicker">Galeri</p>
          <h1 className="display mt-4">{page?.title || DEFAULT_TITLE}</h1>
        </div>
        <p className="col-span-12 max-w-xl self-end text-muted lg:col-span-4">{page?.intro || DEFAULT_INTRO}</p>
      </header>

      {kinds.length > 1 && (
        <nav aria-label="Saring album" className="mb-10">
          <ul className="flex flex-wrap gap-2">
            {filters.map(({ href, label, isActive }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className="chip min-h-11 border border-stone bg-white/70 px-5 text-ink no-underline hover:border-olive aria-[current=page]:border-olive-deep aria-[current=page]:bg-olive-deep aria-[current=page]:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {shown.length > 0 ? (
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="panel p-8">
          <p className="text-muted">
            {activeKind ? `Belum ada album ${KIND_LABELS[activeKind].toLowerCase()} yang berfoto.` : 'Foto album menyusul.'}
          </p>
          {activeKind && (
            <Link href="/galeri" className="btn btn-outline mt-5">
              Lihat semua album
            </Link>
          )}
        </div>
      )}

      {withoutPhotos.length > 0 && !activeKind && (
        <section aria-labelledby="judul-juga-hadir" className="mt-24">
          <h2 id="judul-juga-hadir" className="section-title">
            {page?.otherEventsTitle || 'Juga hadir di'}
          </h2>
          <ul className="mt-8 grid gap-x-6 sm:grid-cols-2">
            {withoutPhotos.map((album) => (
              <li key={album.id} className="border-t border-stone py-6">
                <p className="text-sm text-muted">
                  {KIND_LABELS[album.kind]}
                  {albumMeta(album) && (
                    <>
                      {' · '}
                      <TemplateText text={albumMeta(album)} />
                    </>
                  )}
                </p>
                <h3 className="mt-1 text-2xl font-normal">{album.title}</h3>
                {album.summary && (
                  <p className="mt-2 text-base text-muted">
                    <TemplateText text={album.summary} />
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
