import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  industry: z.enum(['REAL_ESTATE','CONSTRUCTION','ICT','TELECOM','TRADING','LIFESTYLE','AGRICULTURE','ELECTRONICS','GROOMING','INDUSTRIAL']),
  website: z.string().nullable().optional(),
  displayOrder: z.number().default(0),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','EDITOR'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  const existing = await prisma.sisterConcern.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 })
  const concern = await prisma.sisterConcern.create({ data: parsed.data })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'CREATE', entity: 'SisterConcern', entityId: concern.id } })
  return NextResponse.json(concern, { status: 201 })
}
