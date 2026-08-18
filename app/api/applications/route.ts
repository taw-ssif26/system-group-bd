import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { jobApplicationSchema } from '@/lib/validation/auth'
import { applicationLimiter } from '@/lib/rate-limit'
import { sendApplicationNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = applicationLimiter(ip)
  if (!limit.success) return NextResponse.json({ error: 'Too many applications from this IP.' }, { status: 429 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const parsed = jobApplicationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid application data.', details: parsed.error.flatten() }, { status: 422 })

  const resumeUrl = (body as any).resumeUrl
  if (!resumeUrl || typeof resumeUrl !== 'string') return NextResponse.json({ error: 'Resume URL is required.' }, { status: 422 })

  const { jobId, name, email, phone, coverLetter } = parsed.data
  const job = await prisma.job.findFirst({ where: { id: jobId, status: 'OPEN' } })
  if (!job) return NextResponse.json({ error: 'Job not found or closed.' }, { status: 404 })

  await prisma.jobApplication.create({ data: { jobId, name, email, phone, coverLetter, resumeUrl } })
  sendApplicationNotification({ jobTitle: job.title, applicantName: name, applicantEmail: email }).catch(() => {})
  return NextResponse.json({ success: true }, { status: 201 })
}
