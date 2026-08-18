import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','RECRUITER'])
  if (error) return error
  const body = await req.json()
  const { deadline, ...rest } = body
  const job = await prisma.job.update({
    where: { id: params.id },
    data: { ...rest, ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}) },
  })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'UPDATE', entity: 'Job', entityId: job.id } })
  return NextResponse.json(job)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  await prisma.job.update({ where: { id: params.id }, data: { status: 'CLOSED' } })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'DELETE', entity: 'Job', entityId: params.id } })
  return NextResponse.json({ success: true })
}
