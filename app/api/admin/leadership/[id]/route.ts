import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  const body = await req.json()
  const member = await prisma.leadershipMember.update({ where: { id: params.id }, data: body })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'UPDATE', entity: 'LeadershipMember', entityId: member.id } })
  return NextResponse.json(member)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error
  await prisma.leadershipMember.update({ where: { id: params.id }, data: { isPublished: false } })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'DELETE', entity: 'LeadershipMember', entityId: params.id } })
  return NextResponse.json({ success: true })
}
