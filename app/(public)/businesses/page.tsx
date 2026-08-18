import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'Our Businesses — System Group Bangladesh',
    description: 'Explore the full portfolio of System Group Bangladesh sister concerns across real estate, construction, ICT, telecom, trading, agriculture, and lifestyle.',
    path: '/businesses',
  })
}

const industryLabels: Record<string, string> = {
  REAL_ESTATE: 'Real Estate', CONSTRUCTION: 'Construction', ICT: 'Technology',
  TELECOM: 'Telecommunications', TRADING: 'Trading', LIFESTYLE: 'Lifestyle',
  AGRICULTURE: 'Agriculture', ELECTRONICS: 'Electronics', GROOMING: 'Grooming', INDUSTRIAL: 'Industrial',
}

export default async function BusinessesPage() {
  const concerns = await prisma.sisterConcern.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { projects: { where: { isPublished: true, deletedAt: null } } } } },
  })

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">Business Portfolio</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">Our Businesses.</h1>
          <p className="font-sans text-sg-muted mt-4 max-w-xl">
            A diversified ecosystem of companies, each built to accelerate Bangladesh's economic growth through modern technology and entrepreneurship.
          </p>
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          <div className="divide-y divide-sg-border border-t border-sg-border">
            {concerns.map((concern, i) => (
              <Link key={concern.id} href={`/businesses/${concern.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-4 hover:bg-sg-deep -mx-6 px-6 transition-colors">
                <div className="flex items-start gap-6">
                  <span className="font-mono text-xs text-sg-muted mt-1 shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-light text-sg-white group-hover:text-sg-gold transition-colors mb-1">
                      {concern.name}
                    </h2>
                    <p className="font-sans text-sm text-sg-muted max-w-lg">{concern.shortDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pl-12 sm:pl-0 shrink-0">
                  <span className="sg-eyebrow">{industryLabels[concern.industry]}</span>
                  {concern._count.projects > 0 && (
                    <span className="font-mono text-xs text-sg-muted">
                      {concern._count.projects} project{concern._count.projects !== 1 ? 's' : ''}
                    </span>
                  )}
                  <ArrowUpRight size={16} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
