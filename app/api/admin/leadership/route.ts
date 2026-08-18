import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  biography: z.string().min(10),
  quote: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  const member = await prisma.leadershipMember.create({ data: parsed.data })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'CREATE', entity: 'LeadershipMember', entityId: member.id } })
  return NextResponse.json(member, { status: 201 })
}
