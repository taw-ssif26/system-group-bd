import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().min(10),
  location: z.string().min(2),
  status: z.enum(['UPCOMING','ONGOING','COMPLETED','AVAILABLE']),
  investment: z.string().nullable().optional(),
  completionYear: z.number().nullable().optional(),
  sisterConcernId: z.string(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().default(0),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','EDITOR'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 })
  const project = await prisma.project.create({ data: parsed.data })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'CREATE', entity: 'Project', entityId: project.id } })
  return NextResponse.json(project, { status: 201 })
}
