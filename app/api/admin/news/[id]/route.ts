import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

async function checkAuth() {
  const session = await auth()
  if (!session?.user) return null
  const role = (session.user as any).role
  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role)) return null
  return session
}

const updateSchema = z.object({
  title: z.string().min(3).max(300).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(10).optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
  publishedAt: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await checkAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const article = await prisma.newsArticle.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
    },
  })

  await prisma.auditLog.create({
    data: { adminUserId: session.user.id!, action: 'UPDATE', entity: 'NewsArticle', entityId: article.id },
  })

  return NextResponse.json(article)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await checkAuth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role
  if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  // Soft delete
  await prisma.newsArticle.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  })

  await prisma.auditLog.create({
    data: { adminUserId: session.user.id!, action: 'DELETE', entity: 'NewsArticle', entityId: params.id },
  })

  return NextResponse.json({ success: true })
}
