import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireAuth()

  if (error) return error

  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: parsed.error.flatten(),
      },
      { status: 422 }
    )
  }

  const inquiry = await prisma.inquiry.update({
    where: {
      id: params.id,
    },
    data: {
      status: parsed.data.status,
    },
  })

  await prisma.auditLog.create({
    data: {
      adminUserId: session!.user.id!,
      action: 'STATUS_CHANGE',
      entity: 'Inquiry',
      entityId: params.id,
    },
  })

  return NextResponse.json(inquiry)
}
