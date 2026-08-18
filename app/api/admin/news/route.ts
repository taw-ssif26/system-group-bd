import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const newsSchema = z.object({
  title: z.string().min(3).max(300),
  slug: z.string().min(3).max(300),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(10),
  category: z.enum([
    'PRESS_RELEASE',
    'CORPORATE_ANNOUNCEMENT',
    'PROJECT_LAUNCH',
    'MEDIA_COVERAGE',
    'AWARD',
    'INVESTMENT',
    'CAMPAIGN',
  ]),
  status: z
    .enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED'])
    .default('DRAFT'),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
  authorId: z.string(),
  publishedAt: z.string().optional(),
})

async function checkAuth() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const role = (session.user as any).role

  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role)) {
    return null
  }

  return session
}

export async function POST(req: NextRequest) {
  const session = await checkAuth()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const body = await req.json()

  const parsed = newsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.flatten(),
      },
      { status: 422 }
    )
  }

  const existing = await prisma.newsArticle.findUnique({
    where: {
      slug: parsed.data.slug,
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Slug already exists.' },
      { status: 409 }
    )
  }

  const article = await prisma.newsArticle.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      category: parsed.data.category,
      status: parsed.data.status ?? 'DRAFT',
      isFeatured: parsed.data.isFeatured ?? false,
      seoTitle: parsed.data.seoTitle ?? null,
      seoDescription: parsed.data.seoDescription ?? null,
      authorId: parsed.data.authorId,
      publishedAt: parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt)
        : null,
    },
  })

  await prisma.auditLog.create({
    data: {
      adminUserId: session.user.id!,
      action: 'CREATE',
      entity: 'NewsArticle',
      entityId: article.id,
    },
  })

  return NextResponse.json(article, { status: 201 })
}
