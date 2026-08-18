import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import GalleryGrid from '@/components/sections/GalleryGrid'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'Gallery — System Group Bangladesh',
    description: 'Photo gallery of System Group Bangladesh projects, events, and milestones.',
    path: '/gallery',
  })
}

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        take: 1,
        include: { media: true },
      },
      _count: { select: { items: true } },
    },
  })

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">Gallery</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">Visual archive.</h1>
        </div>
      </div>
      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          {albums.length === 0 ? (
            <p className="text-sg-muted font-sans text-sm py-16 text-center">Gallery coming soon.</p>
          ) : (
            <GalleryGrid albums={albums as any} />
          )}
        </div>
      </section>
    </>
  )
}
