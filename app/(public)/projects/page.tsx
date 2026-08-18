import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'Projects — System Group Bangladesh',
    description: 'Explore System Group Bangladesh\'s real estate and commercial projects across Chattogram — from residential towers to commercial complexes and tech hubs.',
    path: '/projects',
  })
}

const statusLabel: Record<string, string> = {
  UPCOMING: 'Upcoming', ONGOING: 'Under Construction', COMPLETED: 'Completed', AVAILABLE: 'Available',
}
const statusColor: Record<string, string> = {
  UPCOMING: 'text-blue-400', ONGOING: 'text-yellow-500', COMPLETED: 'text-sg-gold', AVAILABLE: 'text-green-400',
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; business?: string }
}) {
  const [projects, concerns] = await Promise.all([
    prisma.project.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        ...(searchParams.status ? { status: searchParams.status as any } : {}),
        ...(searchParams.business ? { sisterConcernId: searchParams.business } : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: { sisterConcern: { select: { name: true, slug: true } } },
    }),
    prisma.sisterConcern.findMany({
      where: { isPublished: true },
      select: { id: true, name: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ])

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">Portfolio</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">Our Projects.</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-sg-deep border-b border-sg-border">
        <div className="sg-container py-4 flex flex-wrap gap-3">
          <Link href="/projects"
            className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors
              ${!searchParams.status ? 'border-sg-gold text-sg-gold' : 'border-sg-border text-sg-muted hover:border-sg-gold hover:text-sg-gold'}`}>
            All
          </Link>
          {['COMPLETED', 'ONGOING', 'UPCOMING', 'AVAILABLE'].map((s) => (
            <Link key={s} href={`/projects?status=${s}`}
              className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors
                ${searchParams.status === s ? 'border-sg-gold text-sg-gold' : 'border-sg-border text-sg-muted hover:border-sg-gold hover:text-sg-gold'}`}>
              {statusLabel[s]}
            </Link>
          ))}
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          {projects.length === 0 ? (
            <p className="text-sg-muted font-sans text-sm py-16 text-center">No projects found.</p>
          ) : (
            <div className="divide-y divide-sg-border border-t border-sg-border">
              {projects.map((project, i) => (
                <Link key={project.id} href={`/projects/${project.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-4 hover:bg-sg-deep -mx-6 px-6 transition-colors">
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-xs text-sg-muted mt-1 shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      {project.isFeatured && (
                        <span className="font-mono text-[10px] tracking-[0.2em] text-sg-gold uppercase mb-1 block">Featured</span>
                      )}
                      <h2 className="font-display text-2xl font-light text-sg-white group-hover:text-sg-gold transition-colors mb-1">
                        {project.name}
                      </h2>
                      <p className="font-sans text-sm text-sg-muted">{project.location}</p>
                      <p className="font-sans text-xs text-sg-muted/60 mt-1">
                        {project.sisterConcern.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 pl-12 sm:pl-0 shrink-0">
                    {project.investment && (
                      <span className="font-mono text-sm text-sg-light">{project.investment}</span>
                    )}
                    <span className={`font-mono text-xs ${statusColor[project.status]}`}>
                      {statusLabel[project.status]}
                    </span>
                    <ArrowUpRight size={16} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
