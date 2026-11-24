'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryPhoto = {
  id: number
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Foto album dalam kolom bertingkat (masonry): setiap foto tampil utuh dengan rasio aslinya,
 * tanpa dipotong. Klik foto untuk membuka tampilan besar dengan tombol sebelumnya/berikutnya.
 */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)

  const open = (next: number) => {
    setIndex(next)
    dialogRef.current?.showModal()
  }

  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? null : (current + delta + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    const onClose = () => setIndex(null)
    dialog.addEventListener('keydown', onKey)
    dialog.addEventListener('close', onClose)
    return () => {
      dialog.removeEventListener('keydown', onKey)
      dialog.removeEventListener('close', onClose)
    }
  }, [step])

  const current = index === null ? null : photos[index]

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, photoIndex) => (
          <li key={photo.id} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => open(photoIndex)}
              aria-label={`Perbesar foto ${photoIndex + 1}: ${photo.alt}`}
              className="block w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-md)] bg-paper"
            >
              <Image
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Foto album"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close()
        }}
      >
        {current && index !== null && (
          <div className="flex h-full flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p aria-live="polite" className="tabular text-sm text-stone">
                Foto {index + 1} dari {photos.length}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="btn btn-light"
                autoFocus
              >
                Tutup foto
              </button>
            </div>

            <figure className="flex min-h-0 flex-1 flex-col items-center gap-3">
              <div className="relative min-h-0 w-full flex-1">
                <Image key={current.id} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className="max-w-2xl text-center text-base text-ivory">{current.alt}</figcaption>
            </figure>

            {photos.length > 1 && (
              <div className="flex justify-center gap-3">
                <button type="button" onClick={() => step(-1)} className="btn border-white/50 text-white hover:bg-white/10">
                  <span aria-hidden>←</span> Foto sebelumnya
                </button>
                <button type="button" onClick={() => step(1)} className="btn border-white/50 text-white hover:bg-white/10">
                  Foto berikutnya <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
