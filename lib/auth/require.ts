import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export type AllowedRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'RECRUITER'

export async function requireAuth(roles: AllowedRole[] = ['SUPER_ADMIN','ADMIN','EDITOR','RECRUITER']) {
  const session = await auth()
  if (!session?.user) return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const role = (session.user as any).role as AllowedRole
  if (!roles.includes(role)) return { session: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { session, error: null }
}
