import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Clock } from 'lucide-react'

export const revalidate = 60

export async function generateMetadata() {
  return buildMetadata({
    title: 'Careers — System Group Bangladesh',
    description: 'Join System Group Bangladesh. We\'re building the future of real estate, technology, and lifestyle businesses in Bangladesh.',
    path: '/careers',
  })
}

const typeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
}

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">Careers at System Group</span>
          <h1 className="font-display font-light text-display-xl text-sg-white mb-4">Build what comes next.</h1>
          <p className="font-sans text-sg-muted max-w-xl">
            We're looking for ambitious people to help shape Bangladesh's future across real estate, technology, and beyond.
          </p>
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          {jobs.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl font-light text-sg-white mb-4">No open positions right now.</p>
              <p className="font-sans text-sm text-sg-muted">Check back soon — we're always growing.</p>
            </div>
          ) : (
            <div className="divide-y divide-sg-border border-t border-sg-border">
              {jobs.map((job) => (
                <Link key={job.id} href={`/careers/${job.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-4 hover:bg-sg-deep -mx-6 px-6 transition-colors">
                  <div>
                    <h2 className="font-display text-2xl font-light text-sg-white group-hover:text-sg-gold transition-colors mb-2">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 font-sans text-sm text-sg-muted">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {typeLabels[job.employmentType]}</span>
                      <span>{job.department}</span>
                      {job.deadline && (
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-sg-muted group-hover:text-sg-gold transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
