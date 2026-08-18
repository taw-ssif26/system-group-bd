# System Group Bangladesh — Corporate Platform

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (credentials, JWT, HTTP-only cookies) |
| Validation | Zod |
| Fonts | Cormorant Garamond (display) + Inter (body) |

## Folder Structure

```
app/
  (public)/          → Public website (homepage, about, projects, news...)
  admin/             → Protected admin dashboard
  api/               → REST API routes

components/
  navigation/        → Navigation bar + footer
  hero/              → Hero section
  sections/          → All homepage sections
  admin/             → Admin UI components

lib/
  auth/              → NextAuth config
  db/                → Prisma client singleton
  validation/        → Zod schemas
  rate-limit/        → Rate limiter

prisma/
  schema.prisma      → Full database schema
  seed.ts            → Real System Group data
```

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
# Fill in DATABASE_URL and AUTH_SECRET at minimum
```

Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Database

```bash
# Create DB and run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed with System Group data
npm run db:seed
```

### 4. Dev server

```bash
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin/login
```

Default admin credentials (from seed):
- Email: `admin@systemgroupbd.com`
- Password: whatever you set in `SEED_ADMIN_PASSWORD` (default: `ChangeMe@2024!`)

**Change this immediately in any non-local environment.**

## Production Deployment

### Railway (recommended for this stack)

```bash
# Set environment variables in Railway dashboard
# Then deploy:
railway up
```

### Vercel

```bash
vercel deploy
# Set DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL in Vercel dashboard
```

### Migrations in production

```bash
npm run db:migrate:deploy   # runs prisma migrate deploy (safe, no reset)
```

Never run `db:reset` in production.

## Admin Roles

| Role | Access |
|------|--------|
| SUPER_ADMIN | Everything |
| ADMIN | Content + operations |
| EDITOR | News, projects, gallery, businesses |
| RECRUITER | Careers + applications |

## Security Notes

- Passwords hashed with bcrypt (cost factor 12)
- Sessions via JWT in HTTP-only cookies
- Admin routes protected at middleware level AND at API level
- Rate limiting on contact form (5/10min), login (10/15min), applications (3/hour)
- Zod validation on all API inputs
- Soft deletes on news and projects (deletedAt field)
- No plaintext secrets in code — everything via environment variables

## Adding Content

All content is managed through the admin panel:
- `/admin/news` — Create, edit, publish news articles
- `/admin/projects` — Manage real estate and commercial projects
- `/admin/businesses` — Update sister concern information
- `/admin/careers` — Post and manage job listings
- `/admin/applications` — Review and process job applications
- `/admin/inquiries` — Handle contact form submissions
- `/admin/gallery` — Upload and organize photo albums
- `/admin/settings` — Update company-wide settings and stats

## Pages to Build Next

These pages have routing but need their own components:
- `/about` — Full about page
- `/businesses/[slug]` — Individual business pages
- `/projects` — Project directory with filters
- `/projects/[slug]` — Individual project pages
- `/news` — News listing with category filter
- `/news/[slug]` — News article page
- `/gallery` — Gallery with lightbox
- `/careers` — Job listings
- `/careers/[slug]` — Individual job + application form
- `/outlets` — Outlet locator with map
- `/contact` — Standalone contact page

## Design Tokens

| Token | Value | Use |
|-------|-------|-----|
| `sg-black` | `#0A0A0A` | Background |
| `sg-deep` | `#111111` | Cards |
| `sg-surface` | `#1A1A1A` | Elevated |
| `sg-gold` | `#C9A84C` | Accent |
| `sg-light` | `#E8E4DC` | Body text |
| Font (display) | Cormorant Garamond | Headlines |
| Font (body) | Inter | Body copy |
| Font (mono) | JetBrains Mono | Labels, data |
