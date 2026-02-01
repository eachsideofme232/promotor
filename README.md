# PromoHub

**Promotion Calendar SaaS for K-Beauty Brands**

A B2B platform for cosmetic companies to manage promotions across Korean e-commerce channels (Oliveyoung, Coupang, Naver, Kakao, Musinsa).

![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-red.svg)

---

## Features

### Phase 1 (Current)
- **Promotion Calendar** - Month/week/day views with drag-and-drop
- **Promotion CRUD** - Create, edit, delete promotions with forms
- **Channel Filtering** - Filter by Korean e-commerce channels
- **Team Sharing** - Multi-user access with role-based permissions
- **Template System** - Reusable promotion patterns
- **Conflict Detection** - Alert when promotions overlap

### Coming Soon (Phase 2-3)
- Strategy planning & competitor monitoring
- Price monitoring & P&L simulation
- AI-powered recommendations

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | Turborepo |
| **Frontend** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Language** | TypeScript (strict mode) |
| **Validation** | Zod |
| **Deploy** | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (Cloud or Local with Docker)

### 1. Clone & Install

```bash
git clone https://github.com/eachsideofme232/promotor.git
cd promotor
npm install
```

### 2. Setup Supabase

**Option A: Cloud Supabase**
1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Dashboard → Settings → API

**Option B: Local Supabase**
```bash
# Requires Docker
npx supabase start
```

### 3. Configure Environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

### 4. Run Database Migrations

```bash
# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations and seed data
npx supabase db push
```

Or run migrations manually via Supabase Dashboard → SQL Editor.

### 5. Start Development Server

```bash
npm run dev --filter=web
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
promohub/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   │   ├── (auth)/     # Login, signup
│   │   │   │   ├── (dashboard)/# Calendar, promotions, settings
│   │   │   │   └── api/        # API routes
│   │   │   ├── components/     # UI components
│   │   │   └── lib/            # Supabase clients
│   │   └── middleware.ts       # Auth middleware
│   └── landing/                # Marketing site
├── packages/
│   ├── db/                     # Database queries
│   ├── types/                  # Shared TypeScript types
│   ├── ui/                     # Shared UI components
│   └── utils/                  # Shared utilities
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed.sql                # Demo data
└── turbo.json
```

---

## Development Commands

```bash
# Start all apps
npm run dev

# Start web app only
npm run dev --filter=web

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Database reset (local Supabase)
npx supabase db reset
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key (sb_publishable_...) |
| `SUPABASE_SECRET_KEY` | No | Supabase secret key (server-side only) |

---

## Database Schema

### Core Tables

- **teams** - Multi-tenant team management
- **team_members** - User-team relationships with roles
- **channels** - Korean e-commerce platforms
- **products** - Product/SKU management
- **promotions** - Promotion calendar entries
- **promo_templates** - Reusable promotion patterns
- **promo_products** - Promotion-product relationships

All tables have Row Level Security (RLS) enabled for multi-tenant isolation.

---

## Current Status

**Phase 1 Progress: ~55%**

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Calendar UI | ✅ Complete |
| Promotion Forms | ✅ Complete |
| Database Schema | ✅ Complete |
| API Integration | 🔄 In Progress |
| Team Management | ⏳ Pending |

See [CLAUDE.md](CLAUDE.md) for detailed implementation status.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

```
feat(scope): message    # New feature
fix(scope): message     # Bug fix
chore(scope): message   # Maintenance
refactor(scope): message # Code refactoring
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Built for K-beauty brand managers
- Designed for Korean e-commerce channels
- Powered by [Supabase](https://supabase.com) and [Next.js](https://nextjs.org)
