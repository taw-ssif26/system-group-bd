import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3).max(300).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(10).optional(),

  category: z.enum([
    'PRESS_RELEASE',
    'CORPORATE_ANNOUNCEMENT',
    'PROJECT_LAUNCH',
    'MEDIA_COVERAGE',
    'AWARD',
    'INVESTMENT',
    'CAMPAIGN',
  ]).optional(),

  status: z.enum([
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED',
    'SCHEDULED',
  ]).optional(),

  isFeatured: z.boolean().optional(),

  seoTitle: z.string().max(200).nullable().optional(),

  seoDescription: z.string().max(300).nullable().optional(),

  publishedAt: z.string().nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAuth([
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
  ])

  if (error) return error

  const body = await req.json()

  const parsed = schema.safeParse(body)

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
      id: params.id,
    },
  })

  if (!existing) {
    return NextResponse.json(
      {
        error: 'News article not found.',
      },
      { status: 404 }
    )
  }

  const data: {
    title?: string
    excerpt?: string
    content?: string
    category?: typeof parsed.data.category
    status?: typeof parsed.data.status
    isFeatured?: boolean
    seoTitle?: string | null
    seoDescription?: string | null
    publishedAt?: Date | null
  } = {}

  if (parsed.data.title !== undefined) {
    data.title = parsed.data.title
  }

  if (parsed.data.excerpt !== undefined) {
    data.excerpt = parsed.data.excerpt
  }

  if (parsed.data.content !== undefined) {
    data.content = parsed.data.content
  }

  if (parsed.data.category !== undefined) {
    data.category = parsed.data.category
  }

  if (parsed.data.status !== undefined) {
    data.status = parsed.data.status
  }

  if (parsed.data.isFeatured !== undefined) {
    data.isFeatured = parsed.data.isFeatured
  }

  if (parsed.data.seoTitle !== undefined) {
    data.seoTitle = parsed.data.seoTitle
  }

  if (parsed.data.seoDescription !== undefined) {
    data.seoDescription = parsed.data.seoDescription
  }

  if (parsed.data.publishedAt !== undefined) {
    data.publishedAt = parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt)
      : null
  }

  const article = await prisma.newsArticle.update({
    where: {
      id: params.id,
    },
    data,
  })

  return NextResponse.json(article)
}
