## Project: System Group Bangladesh — Corporate Platform
## Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + NextAuth v5 + Framer Motion
## Current State: COMPLETE — all pages, all admin CRUD, all API routes, SEO, email, file uploads
## Key Files:
- prisma/schema.prisma — Full 16-model DB schema
- prisma/seed.ts — All real System Group data
- app/(public)/ — All 10 public pages
- app/admin/ — Full admin dashboard (14 sections)
- app/api/admin/ — All protected CRUD APIs
- lib/auth/index.ts — NextAuth v5 singleton
- lib/auth/require.ts — Auth helper for API routes
- lib/email/index.ts — Nodemailer email service
- lib/storage/index.ts — File upload (local dev / S3 prod)
- app/sitemap.ts — Dynamic XML sitemap
- app/robots.ts — robots.txt
## Decisions Made:
- NextAuth v5 beta with JWT strategy (8hr sessions)
- Soft deletes on News and Projects (deletedAt field)
- In-memory rate limiter (swap to Upstash Redis for multi-instance prod)
- STORAGE_PROVIDER=local for dev, s3 for prod
- All admin API routes protected server-side via requireAuth()
- Audit logging on all mutations
## Deploy Steps:
1. npm install
2. cp .env.example .env && fill DATABASE_URL + AUTH_SECRET
3. npm run db:generate
4. npm run db:migrate
5. npm run db:seed
6. npm run build
7. npm start
## Next Step: Deploy to Railway or VPS
