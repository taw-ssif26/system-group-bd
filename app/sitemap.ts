import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://systemgroupbd.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, concerns, articles, jobs, albums] = await Promise.all([
    prisma.project.findMany({ where: { isPublished: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.sisterConcern.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED', deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.job.findMany({ where: { status: 'OPEN' }, select: { slug: true, updatedAt: true } }),
    prisma.galleryAlbum.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/businesses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/careers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/outlets`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const businessRoutes: MetadataRoute.Sitemap = concerns.map((c) => ({
    url: `${BASE}/businesses/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const newsRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/news/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'never',
    priority: 0.7,
  }))

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${BASE}/careers/${j.slug}`,
    lastModified: j.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...businessRoutes, ...newsRoutes, ...jobRoutes]
}
