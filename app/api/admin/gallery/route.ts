import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  isPublished: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth([
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
  ])

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

  const existing = await prisma.galleryAlbum.findUnique({
    where: {
      slug: parsed.data.slug,
    },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Slug already exists.' },
      { status: 409 }
    )
  }

  const album = await prisma.galleryAlbum.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      category: parsed.data.category,
      isPublished: parsed.data.isPublished,
    },
  })

  return NextResponse.json(album, { status: 201 })
}
