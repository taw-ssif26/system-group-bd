import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

export const revalidate = 300

export async function generateStaticParams() {
  const concerns = await prisma.sisterConcern.findMany({ where: { isPublished: true }, select: { slug: true } })
  return concerns.map((c: { slug: string }) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const concern = await prisma.sisterConcern.findUnique({ where: { slug: params.slug } })
  if (!concern) return {}
  return buildMetadata({
    title: `${concern.name} — System Group Bangladesh`,
    description: concern.shortDescription,
    image: concern.coverImage,
    path: `/businesses/${concern.slug}`,
  })
}

const statusLabel: Record<string, string> = {
  UPCOMING: 'Upcoming', ONGOING: 'Under Construction', COMPLETED: 'Completed', AVAILABLE: 'Available',
}
const statusColor: Record<string, string> = {
  UPCOMING: 'text-blue-400', ONGOING: 'text-yellow-500', COMPLETED: 'text-sg-gold', AVAILABLE: 'text-green-400',
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const concern = await prisma.sisterConcern.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      projects: {
        where: { isPublished: true, deletedAt: null },
        orderBy: { displayOrder: 'asc' },
      },
    },
  })
  if (!concern) notFound()

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <Link href="/businesses" className="sg-eyebrow inline-flex items-center gap-2 mb-8 hover:text-sg-gold-light transition-colors">
            ← All Businesses
          </Link>
          <span className="sg-eyebrow block mb-4">{concern.industry.replace(/_/g, ' ')}</span>
          <h1 className="font-display font-light text-display-xl text-sg-white mb-6">{concern.name}</h1>
          {concern.website && (
            <a href={concern.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-sg-muted hover:text-sg-gold transition-colors">
              Visit Website <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <p className="font-sans text-sg-light leading-relaxed text-lg">{concern.description}</p>
            </div>
          </div>
        </div>
      </section>

      {concern.projects.length > 0 && (
        <section className="py-16 bg-sg-deep">
          <div className="sg-container">
            <span className="sg-eyebrow block mb-8">Projects</span>
            <div className="divide-y divide-sg-border border-t border-sg-border">
              {concern.projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}
                  className="group flex items-center justify-between py-6 hover:bg-sg-surface -mx-6 px-6 transition-colors">
                  <div>
                    <h3 className="font-display text-xl font-light text-sg-white group-hover:text-sg-gold transition-colors">
                      {project.name}
                    </h3>
                    <span className="font-sans text-sm text-sg-muted">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`font-mono text-xs ${statusColor[project.status]}`}>
                      {statusLabel[project.status]}
                    </span>
                    <ArrowUpRight size={16} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-sg-black border-t border-sg-border">
        <div className="sg-container text-center">
          <p className="font-display text-2xl font-light text-sg-white mb-6">
            Interested in {concern.name}?
          </p>
          <Link href={`/contact?concern=${concern.id}`} className="sg-btn-primary">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
