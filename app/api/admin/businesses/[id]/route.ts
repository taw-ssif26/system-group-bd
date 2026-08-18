import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).optional(),
  shortDescription: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  industry: z.string().optional(),
  website: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','EDITOR'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })

  const concern = await prisma.sisterConcern.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      ...(parsed.data.industry
        ? { industry: parsed.data.industry as any }
        : {}),
    },
  })

  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'UPDATE', entity: 'SisterConcern', entityId: concern.id } })
  return NextResponse.json(concern)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error
  await prisma.sisterConcern.update({ where: { id: params.id }, data: { isPublished: false } })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'DELETE', entity: 'SisterConcern', entityId: params.id } })
  return NextResponse.json({ success: true })
}
