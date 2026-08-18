import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  status: z.enum(['UPCOMING','ONGOING','COMPLETED','AVAILABLE']).optional(),
  investment: z.string().nullable().optional(),
  completionYear: z.number().nullable().optional(),
  sisterConcernId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','EDITOR'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  const project = await prisma.project.update({ where: { id: params.id }, data: parsed.data })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'UPDATE', entity: 'Project', entityId: project.id } })
  return NextResponse.json(project)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  await prisma.project.update({ where: { id: params.id }, data: { deletedAt: new Date() } })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'DELETE', entity: 'Project', entityId: params.id } })
  return NextResponse.json({ success: true })
}
