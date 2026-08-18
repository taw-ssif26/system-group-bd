import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, DollarSign, ArrowUpRight } from 'lucide-react'

export const revalidate = 300

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true, deletedAt: null },
    select: { slug: true },
  })
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { sisterConcern: true },
  })
  if (!project) return {}
  return buildMetadata({
    title: `${project.name} — System Group Bangladesh`,
    description: project.description.slice(0, 160),
    image: project.featuredImage,
    path: `/projects/${project.slug}`,
  })
}

const statusLabel: Record<string, string> = {
  UPCOMING: 'Upcoming', ONGOING: 'Under Construction', COMPLETED: 'Completed', AVAILABLE: 'Available',
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, isPublished: true, deletedAt: null },
    include: {
      sisterConcern: true,
      images: { orderBy: { displayOrder: 'asc' } },
      documents: true,
    },
  })
  if (!project) notFound()

  return (
    <>
      {/* Hero */}
      <div className="relative pt-32 pb-20 bg-sg-black border-b border-sg-border overflow-hidden">
        {project.featuredImage && (
          <div className="absolute inset-0 opacity-10">
            <Image src={project.featuredImage} alt={project.name} fill className="object-cover" />
          </div>
        )}
        <div className="sg-container relative z-10">
          <Link href="/projects" className="sg-eyebrow inline-flex items-center gap-2 mb-8 hover:text-sg-gold-light transition-colors">
            ← All Projects
          </Link>
          <span className="sg-eyebrow block mb-4">{project.sisterConcern.name}</span>
          <h1 className="font-display font-light text-display-xl text-sg-white mb-8">{project.name}</h1>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2 font-sans text-sm text-sg-muted">
              <MapPin size={14} className="text-sg-gold" />
              {project.location}
            </div>
            {project.investment && (
              <div className="flex items-center gap-2 font-sans text-sm text-sg-muted">
                <DollarSign size={14} className="text-sg-gold" />
                {project.investment} investment
              </div>
            )}
            {project.completionYear && (
              <div className="flex items-center gap-2 font-sans text-sm text-sg-muted">
                <Calendar size={14} className="text-sg-gold" />
                {project.completionYear}
              </div>
            )}
            <span className="font-mono text-xs text-sg-gold border border-sg-gold/30 px-3 py-1">
              {statusLabel[project.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <p className="font-sans text-sg-light leading-relaxed text-lg">{project.description}</p>
            </div>
            <div>
              {project.documents.length > 0 && (
                <div>
                  <span className="sg-eyebrow block mb-4">Downloads</span>
                  <div className="space-y-3">
                    {project.documents.map((doc) => (
                      <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-sg-border hover:border-sg-gold transition-colors group">
                        <span className="font-sans text-sm text-sg-light">{doc.name}</span>
                        <ArrowUpRight size={14} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.images.length > 0 && (
        <section className="py-16 bg-sg-deep">
          <div className="sg-container">
            <span className="sg-eyebrow block mb-8">Gallery</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {project.images.map((img) => (
                <div key={img.id} className="aspect-video relative overflow-hidden bg-sg-surface">
                  <Image src={img.url} alt={img.altText || project.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-sg-black border-t border-sg-border">
        <div className="sg-container text-center">
          <p className="font-display text-2xl font-light text-sg-white mb-6">Interested in this project?</p>
          <Link href={`/contact?concern=${project.sisterConcernId}`} className="sg-btn-primary">
            Make an Enquiry
          </Link>
        </div>
      </section>
    </>
  )
}
