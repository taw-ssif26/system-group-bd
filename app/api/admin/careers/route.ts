import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/require'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  employmentType: z.enum(['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP']),
  status: z.enum(['DRAFT','OPEN','CLOSED']),
  description: z.string().min(10),
  responsibilities: z.string().min(5),
  requirements: z.string().min(5),
  deadline: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth(['SUPER_ADMIN','ADMIN','RECRUITER'])
  if (error) return error
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  const existing = await prisma.job.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 })
  const job = await prisma.job.create({ data: { ...parsed.data, deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null } })
  await prisma.auditLog.create({ data: { adminUserId: session!.user.id!, action: 'CREATE', entity: 'Job', entityId: job.id } })
  return NextResponse.json(job, { status: 201 })
}
