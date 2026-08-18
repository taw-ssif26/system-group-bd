import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import JobApplicationForm from '@/components/forms/JobApplicationForm'

export const revalidate = 60

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({ where: { status: 'OPEN' }, select: { slug: true } })
  return jobs.map((j) => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const job = await prisma.job.findUnique({ where: { slug: params.slug } })
  if (!job) return {}
  return buildMetadata({
    title: `${job.title} — Careers at System Group Bangladesh`,
    description: `${job.department} · ${job.location} · ${job.employmentType}`,
    path: `/careers/${job.slug}`,
  })
}

const typeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await prisma.job.findUnique({
    where: { slug: params.slug, status: 'OPEN' },
  })
  if (!job) notFound()

  const safeDesc = DOMPurify.sanitize(job.description)
  const safeReqs = DOMPurify.sanitize(job.requirements)
  const safeResp = DOMPurify.sanitize(job.responsibilities)

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <Link href="/careers" className="sg-eyebrow inline-flex items-center gap-2 mb-8 hover:text-sg-gold-light transition-colors">
            ← Careers
          </Link>
          <h1 className="font-display font-light text-display-lg text-sg-white mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 font-mono text-xs text-sg-muted">
            <span>{job.department}</span>
            <span>·</span>
            <span>{job.location}</span>
            <span>·</span>
            <span>{typeLabels[job.employmentType]}</span>
            {job.deadline && (
              <>
                <span>·</span>
                <span>Apply by {new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Job details */}
            <div className="space-y-10">
              {job.description && (
                <div>
                  <span className="sg-eyebrow block mb-4">About the Role</span>
                  <div className="font-sans text-sg-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: safeDesc }} />
                </div>
              )}
              {job.responsibilities && (
                <div>
                  <span className="sg-eyebrow block mb-4">Responsibilities</span>
                  <div className="font-sans text-sg-muted leading-relaxed prose prose-invert prose-sm"
                    dangerouslySetInnerHTML={{ __html: safeResp }} />
                </div>
              )}
              {job.requirements && (
                <div>
                  <span className="sg-eyebrow block mb-4">Requirements</span>
                  <div className="font-sans text-sg-muted leading-relaxed prose prose-invert prose-sm"
                    dangerouslySetInnerHTML={{ __html: safeReqs }} />
                </div>
              )}
            </div>

            {/* Application form */}
            <div>
              <span className="sg-eyebrow block mb-8">Apply for this Position</span>
              <JobApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
