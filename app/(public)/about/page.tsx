import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import AboutSection from '@/components/sections/AboutSection'
import LeadershipSection from '@/components/sections/LeadershipSection'
import TimelineSection from '@/components/sections/TimelineSection'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'About — System Group Bangladesh',
    description: 'Learn about System Group Bangladesh — a diversified business group established in 2009, building real estate, technology, and lifestyle businesses across Bangladesh.',
    path: '/about',
  })
}

export default async function AboutPage() {
  // Fetch leadership members and site settings concurrently
  const [leadership, rawSettings] = await Promise.all([
    prisma.leadershipMember.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
    // Adjust model name if your Prisma schema uses `setting` or `siteSetting`
    prisma.siteSetting.findMany().catch(() => []),
  ])

  // Convert settings array into a Record<string, string> map
  const settingsMap: Record<string, string> = {}
  if (Array.isArray(rawSettings)) {
    rawSettings.forEach((item: { key: string; value: string }) => {
      if (item.key) {
        settingsMap[item.key] = item.value
      }
    })
  }

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">About System Group</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">
            Xplore Beyond.
          </h1>
        </div>
      </div>

      <AboutSection settings={settingsMap} />
      <TimelineSection />
      <LeadershipSection members={leadership} />

      {/* Vision / Mission */}
      <section className="py-32 bg-sg-black">
        <div className="sg-container">
          <div className="grid lg:grid-cols-2 gap-px bg-sg-border">
            <div className="bg-sg-black p-12">
              <span className="sg-eyebrow block mb-6">Vision</span>
              <p className="font-display text-2xl font-light text-sg-white leading-relaxed">
                To build a revolutionary business empire that sets the benchmark for innovation, redefines quality standards, and exceeds customer expectations.
              </p>
            </div>
            <div className="bg-sg-black p-12">
              <span className="sg-eyebrow block mb-6">Mission</span>
              <p className="font-display text-2xl font-light text-sg-white leading-relaxed">
                To harness modern technology for economic acceleration and job creation — empowering communities and creating a legacy of innovation and opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}