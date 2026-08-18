import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { loginSchema } from '@/lib/validation/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute =
        nextUrl.pathname.startsWith('/admin') &&
        nextUrl.pathname !== '/admin/login'
      if (isAdminRoute) return isLoggedIn
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password } = parsed.data

        const user = await prisma.adminUser.findUnique({ where: { email } })
        if (!user || !user.isActive) return null

        const match = await bcrypt.compare(password, user.passwordHash)
        if (!match) return null

        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
        await prisma.auditLog.create({
          data: {
            adminUserId: user.id,
            action: 'LOGIN',
            entity: 'AdminUser',
            entityId: user.id,
          },
        })

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
})
