import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth([
    'SUPER_ADMIN',
    'ADMIN',
  ])

  if (error) return error

  const body = await req.json()

  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 422 }
    )
  }

  const updates = Object.entries(body).map(([key, value]) => {
    if (typeof value !== 'string') {
      throw new Error(`Setting "${key}" must be a string.`)
    }

    return prisma.siteSetting.upsert({
      where: {
        key,
      },
      update: {
        value,
      },
      create: {
        key,
        value,
      },
    })
  })

  try {
    await Promise.all(updates)
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed to update settings.',
      },
      { status: 500 }
    )
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: session!.user.id!,
      action: 'UPDATE',
      entity: 'SiteSetting',
    },
  })

  return NextResponse.json({
    success: true,
  })
}
