import { prisma } from '@/lib/db/prisma'
import { buildMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'

export const revalidate = 300

export async function generateStaticParams() {
  const articles = await prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true },
  })
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.newsArticle.findUnique({ where: { slug: params.slug } })
  if (!article) return {}
  return buildMetadata({
    title: article.seoTitle || `${article.title} — System Group Bangladesh`,
    description: article.seoDescription || article.excerpt,
    image: article.featuredImage,
    path: `/news/${article.slug}`,
  })
}

const categoryLabels: Record<string, string> = {
  PRESS_RELEASE: 'Press Release', CORPORATE_ANNOUNCEMENT: 'Announcement',
  PROJECT_LAUNCH: 'Project Launch', MEDIA_COVERAGE: 'Media Coverage',
  AWARD: 'Award', INVESTMENT: 'Investment', CAMPAIGN: 'Campaign',
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED', deletedAt: null },
    include: { author: { select: { name: true } } },
  })
  if (!article) notFound()

  // Increment view count (fire and forget)
  prisma.newsArticle.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  const safeContent = DOMPurify.sanitize(article.content)

  return (
    <>
      {/* Header */}
      <div className="pt-32 pb-16 bg-sg-black border-b border-sg-border">
        <div className="sg-container max-w-4xl">
          <Link href="/news" className="sg-eyebrow inline-flex items-center gap-2 mb-8 hover:text-sg-gold-light transition-colors">
            ← News
          </Link>
          <span className="sg-eyebrow block mb-4">{categoryLabels[article.category]}</span>
          <h1 className="font-display font-light text-display-lg text-sg-white mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 font-mono text-xs text-sg-muted">
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
            <span>By {article.author.name}</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {article.featuredImage && (
        <div className="relative h-[400px] lg:h-[560px] bg-sg-surface">
          <Image src={article.featuredImage} alt={article.title} fill className="object-cover opacity-80" />
        </div>
      )}

      {/* Article body */}
      <article className="py-16 bg-sg-black">
        <div className="sg-container max-w-3xl">
          <p className="font-sans text-sg-light text-lg leading-relaxed mb-12">{article.excerpt}</p>
          <div
            className="prose prose-invert prose-gold max-w-none font-sans text-sg-muted leading-relaxed
              prose-headings:font-display prose-headings:font-light prose-headings:text-sg-white
              prose-a:text-sg-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-sg-light prose-blockquote:border-sg-gold prose-blockquote:text-sg-light"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </article>
    </>
  )
}
