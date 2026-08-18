import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  const body: Record<string, string> = await req.json()
  const updates = Object.entries(body).map(([key, value]) =>
    prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
  )
  await Promise.all(updates)
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'UPDATE', entity: 'SiteSetting' } })
  return NextResponse.json({ success: true })
}
