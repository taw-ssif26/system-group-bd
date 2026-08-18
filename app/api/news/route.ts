import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const perPage = parseInt(searchParams.get('perPage') ?? '10')
  const category = searchParams.get('category') ?? undefined
  const featured = searchParams.get('featured') === 'true' ? true : undefined

  const where = {
    status: 'PUBLISHED' as const,
    deletedAt: null,
    ...(category ? { category: category as any } : {}),
    ...(featured !== undefined ? { isFeatured: featured } : {}),
  }

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true, title: true, slug: true, excerpt: true,
        featuredImage: true, category: true, publishedAt: true, isFeatured: true,
        author: { select: { name: true } },
      },
    }),
    prisma.newsArticle.count({ where }),
  ])

  return NextResponse.json({ articles, total, pages: Math.ceil(total / perPage) })
}
