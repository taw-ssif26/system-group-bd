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

export const revalidate = 300

async function getHomeData() {
  const [concerns, featuredProjects, leadership, latestNews, settings, openJobs] =
    await Promise.all([
      prisma.sisterConcern.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),

      prisma.project.findMany({
        where: {
          isFeatured: true,
          isPublished: true,
          deletedAt: null,
        },
        orderBy: { displayOrder: 'asc' },
        take: 6,
      }),

      prisma.leadershipMember.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),

      prisma.newsArticle.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
        },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          publishedAt: true,
        },
      }),

      prisma.siteSetting.findMany(),

      prisma.job.count({
        where: { status: 'OPEN' },
      }),
    ])

  const settingsMap = Object.fromEntries(
    settings.map((setting) => [setting.key, setting.value])
  )

  return {
    concerns,
    featuredProjects,
    leadership,
    latestNews,
    settingsMap,
    openJobs,
  }
}

export default async function HomePage() {
  const {
    concerns,
    featuredProjects,
    leadership,
    latestNews,
    settingsMap,
    openJobs,
  } = await getHomeData()

  return (
    <>
      <HeroSection settings={settingsMap} />

      <AboutSection settings={settingsMap} />

      <BusinessEcosystem concerns={concerns} />

      <ProjectsSection projects={featuredProjects} />

      <TimelineSection />

      <LeadershipSection members={leadership} />

      {latestNews.length > 0 && (
        <NewsSection articles={latestNews} />
      )}

      <CareersTeaser openJobs={openJobs} />

      <ContactSection concerns={concerns} />
    </>
  )
}
