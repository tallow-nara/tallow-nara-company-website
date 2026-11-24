import type { Achievement } from '@/payload-types'

export type AlbumKind = Achievement['kind']

export const KIND_LABELS: Record<AlbumKind, string> = {
  lomba: 'Lomba',
  acara: 'Acara',
  kegiatan: 'Kegiatan',
}

export const KIND_ORDER: AlbumKind[] = ['lomba', 'acara', 'kegiatan']

export function isAlbumKind(value: unknown): value is AlbumKind {
  return typeof value === 'string' && (KIND_ORDER as string[]).includes(value)
}

export function photoCount(album: Pick<Achievement, 'photos'>): number {
  return (album.photos ?? []).filter((photo) => typeof photo === 'object' && photo?.url).length
}

export function albumMeta(album: Pick<Achievement, 'dateLabel' | 'location'>): string {
  return [album.dateLabel, album.location].filter(Boolean).join(' · ')
}
