import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const revalidate = 300

export async function generateMetadata() {
  return buildMetadata({
    title: 'News — System Group Bangladesh',
    description: 'Latest news, press releases, and corporate announcements from System Group Bangladesh.',
    path: '/news',
  })
}

const categoryLabels: Record<string, string> = {
  PRESS_RELEASE: 'Press Release', CORPORATE_ANNOUNCEMENT: 'Announcement',
  PROJECT_LAUNCH: 'Project Launch', MEDIA_COVERAGE: 'Media Coverage',
  AWARD: 'Award', INVESTMENT: 'Investment', CAMPAIGN: 'Campaign',
}

export default async function NewsPage({ searchParams }: { searchParams: { category?: string } }) {
  const articles = await prisma.newsArticle.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
      ...(searchParams.category ? { category: searchParams.category as any } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    include: { author: { select: { name: true } } },
  })

  const featured = articles.filter((a) => a.isFeatured)
  const rest = articles.filter((a) => !a.isFeatured)

  return (
    <>
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container">
          <span className="sg-eyebrow block mb-4">What's Moving</span>
          <h1 className="font-display font-light text-display-xl text-sg-white">News & Updates.</h1>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-sg-deep border-b border-sg-border">
        <div className="sg-container py-4 flex flex-wrap gap-3">
          <Link href="/news"
            className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors
              ${!searchParams.category ? 'border-sg-gold text-sg-gold' : 'border-sg-border text-sg-muted hover:border-sg-gold hover:text-sg-gold'}`}>
            All
          </Link>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link key={key} href={`/news?category=${key}`}
              className={`font-mono text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors
                ${searchParams.category === key ? 'border-sg-gold text-sg-gold' : 'border-sg-border text-sg-muted hover:border-sg-gold hover:text-sg-gold'}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <section className="py-16 bg-sg-black">
        <div className="sg-container">
          {articles.length === 0 ? (
            <p className="text-sg-muted font-sans text-sm py-16 text-center">No articles yet.</p>
          ) : (
            <>
              {/* Featured article */}
              {featured.length > 0 && (
                <Link href={`/news/${featured[0].slug}`}
                  className="group block mb-16 pb-16 border-b border-sg-border hover:bg-sg-deep -mx-6 px-6 py-8 transition-colors">
                  <span className="sg-eyebrow block mb-4">{categoryLabels[featured[0].category]} · Featured</span>
                  <h2 className="font-display text-display-lg font-light text-sg-white group-hover:text-sg-gold transition-colors mb-4 max-w-3xl leading-tight">
                    {featured[0].title}
                  </h2>
                  <p className="font-sans text-sg-muted max-w-2xl leading-relaxed mb-6">{featured[0].excerpt}</p>
                  <span className="font-mono text-xs text-sg-muted">
                    {featured[0].publishedAt ? new Date(featured[0].publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </span>
                </Link>
              )}

              {/* Article grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-sg-border">
                {(featured.length > 0 ? [...featured.slice(1), ...rest] : rest).map((article) => (
                  <Link key={article.id} href={`/news/${article.slug}`}
                    className="group block p-8 bg-sg-black hover:bg-sg-deep transition-colors">
                    <span className="sg-eyebrow block mb-4">{categoryLabels[article.category]}</span>
                    <h3 className="font-display text-xl font-light text-sg-white group-hover:text-sg-gold transition-colors mb-3 leading-snug">
                      {article.title}
                    </h3>
                    <p className="font-sans text-sm text-sg-muted leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-sg-muted">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <ArrowUpRight size={14} className="text-sg-muted group-hover:text-sg-gold transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
