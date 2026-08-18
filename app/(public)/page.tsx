import { prisma } from '@/lib/db/prisma'
import HeroSection from '@/components/hero/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import BusinessEcosystem from '@/components/sections/BusinessEcosystem'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import LeadershipSection from '@/components/sections/LeadershipSection'
import NewsSection from '@/components/sections/NewsSection'
import CareersTeaser from '@/components/sections/CareersTeaser'
import ContactSection from '@/components/sections/ContactSection'

// ISR — revalidate every 5 minutes
export const revalidate = 300

async function getHomeData() {
  const [concerns, featuredProjects, leadership, latestNews, settings, openJobs] = await Promise.all([
    prisma.sisterConcern.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.project.findMany({
      where: { isFeatured: true, isPublished: true, deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
    prisma.leadershipMember.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true, title: true, slug: true, excerpt: true,
        featuredImage: true, category: true, publishedAt: true,
      },
    }),
    prisma.siteSetting.findMany(),
    prisma.job.count({ where: { status: 'OPEN' } }),
  ])

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return { concerns, featuredProjects, leadership, latestNews, settingsMap, openJobs }
}

export default async function HomePage() {
  const { concerns, featuredProjects, leadership, latestNews, settingsMap, openJobs } = await getHomeData()

  return (
    <>
      {/* ACT I — Hero */}
      <HeroSection settings={settingsMap} />

      {/* ACT II — About */}
      <AboutSection />

      {/* ACT III — Business Ecosystem */}
      <BusinessEcosystem concerns={concerns} />

      {/* ACT IV — Projects */}
      <ProjectsSection projects={featuredProjects} />

      {/* ACT V — Timeline */}
      <TimelineSection />

      {/* ACT VI — Leadership */}
      <LeadershipSection members={leadership} />

      {/* ACT VII — (Awards / press — add when data available) */}

      {/* ACT VIII — News */}
      {latestNews.length > 0 && <NewsSection articles={latestNews} />}

      {/* ACT IX — Careers teaser */}
      <CareersTeaser openJobs={openJobs} />

      {/* ACT X — Contact */}
      <ContactSection concerns={concerns} />
    </>
  )
}
