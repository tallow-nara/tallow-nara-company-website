import Image from 'next/image'

import type { Media } from '@/payload-types'

export function focalPosition(media: Pick<Media, 'focalX' | 'focalY'>): string {
  return `${media.focalX ?? 50}% ${media.focalY ?? 50}%`
}

type MediaImageProps = {
  media: number | Media | null | undefined
  sizes: string
  className?: string
  fit?: 'cover' | 'contain'
  priority?: boolean
}

export function MediaImage({
  media,
  sizes,
  className = 'aspect-[3/2]',
  fit = 'cover',
  priority,
}: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) return null

  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-md)] ${fit === 'cover' ? 'bg-paper' : ''} ${className}`}>
      <Image
        src={media.url}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === 'cover' ? 'object-cover' : 'object-contain'}
        style={fit === 'cover' ? { objectPosition: focalPosition(media) } : undefined}
      />
    </div>
  )
}
