import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { contactSchema } from '@/lib/validation/auth'
import { contactLimiter } from '@/lib/rate-limit'
import { sendInquiryNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const limit = contactLimiter(ip)
  if (!limit.success) return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid form data.', details: parsed.error.flatten() }, { status: 422 })

  const { name, email, phone, concernId, subject, message } = parsed.data

  try {
    await prisma.inquiry.create({ data: { name, email, phone: phone??null, concernId: concernId||null, subject, message } })
    // Fire email notification (non-blocking)
    sendInquiryNotification({ name, email, subject, message }).catch(() => {})
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 })
  }
}
