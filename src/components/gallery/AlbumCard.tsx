import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { TemplateText } from '@/components/TemplateText'
import { albumMeta, KIND_LABELS, photoCount } from '@/lib/gallery'
import type { Achievement } from '@/payload-types'

export function AlbumCard({ album, headingLevel = 'h2' }: { album: Achievement; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  const count = photoCount(album)
  const meta = albumMeta(album)

  return (
    <article className="reveal">
      <Link href={`/galeri/${album.slug}`} className="group block text-ink no-underline">
        <div className="relative">
          <MediaImage
            media={album.photos?.[0]}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="aspect-square sm:aspect-[4/5]"
          />
          <p className="glass-dark chip absolute bottom-3 left-3">
            {KIND_LABELS[album.kind]} · {count} foto
          </p>
        </div>
        {meta && (
          <p className="mt-4 text-sm text-muted">
            <TemplateText text={meta} />
          </p>
        )}
        <Heading className="mt-1 text-[1.75rem] font-normal leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {album.title}
        </Heading>
        {album.summary && !album.summary.startsWith('[[ISI') && (
          <p className="mt-2 line-clamp-3 text-base text-muted">{album.summary}</p>
        )}
      </Link>
    </article>
  )
}
