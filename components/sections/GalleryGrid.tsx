'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Album {
  id: string; title: string; slug: string; _count: { items: number }
  items: { media: { url: string; altText: string } }[]
}

interface Props { albums: Album[] }

export default function GalleryGrid({ albums }: Props) {
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null)

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => {
          const cover = album.items[0]?.media
          return (
            <div key={album.id} className="group relative aspect-[4/3] overflow-hidden bg-sg-surface border border-sg-border hover:border-sg-gold/40 transition-colors cursor-pointer"
              onClick={() => cover && setLightbox({ url: cover.url, alt: cover.altText || album.title })}>
              {cover ? (
                <Image src={cover.url} alt={cover.altText || album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-sg-muted text-4xl">{album.title.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-sg-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-display text-lg font-light text-sg-white">{album.title}</h3>
                <span className="font-mono text-xs text-sg-muted">{album._count.items} photos</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-sg-gold transition-colors" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.url} alt={lightbox.alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  )
}
