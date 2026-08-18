import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPER_ADMIN','ADMIN','EDITOR'])
  if (error) return error
  const body = await req.json()
  const album = await prisma.galleryAlbum.update({ where: { id: params.id }, data: body })
  return NextResponse.json(album)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPER_ADMIN','ADMIN'])
  if (error) return error
  await prisma.galleryAlbum.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
