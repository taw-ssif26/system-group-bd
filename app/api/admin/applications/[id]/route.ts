import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['NEW','REVIEWING','SHORTLISTED','INTERVIEW','REJECTED','HIRED']).optional(),
  notes: z.string().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','RECRUITER'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  const app = await prisma.jobApplication.update({ where: { id: params.id }, data: parsed.data })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'STATUS_CHANGE', entity: 'JobApplication', entityId: params.id, metadata: { status: parsed.data.status } } })
  return NextResponse.json(app)
}
