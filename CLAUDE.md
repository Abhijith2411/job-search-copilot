# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Job Application Tracker** — A personal job search pipeline management tool with AI-powered content generation. Users maintain a kanban board (wishlist → applied → interviewing → offer → rejected) and use AI to generate tailored cover letters, resume bullets, interview questions, and company research.

**Design System**: Linear.app design language (dark-first, minimal aesthetic). See `DESIGN-linear.app.md` for the canonical color palette, typography, and component specs.

**Approved Implementation Plan**: See `.claude/plans/plan-a-web-application-rustling-gray.md` for architecture, database schema, and feature phases.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 (no custom Linear fonts; use Geist Sans via system fallback)
- **Backend**: Next.js API routes (serverless)
- **Database**: PostgreSQL + Prisma ORM
- **Drag-and-Drop**: dnd-kit (React 19 compatible; replaces react-beautiful-dnd)
- **PDF Export**: jspdf + html2canvas
- **AI**: OpenRouter API for LLM calls
- **Validation**: Zod for runtime type-checking

## Development Commands

```bash
# Start development server (localhost:3000)
npm run dev

# Production build
npm run build

# Run production server
npm start

# Lint TypeScript and ESLint
npm run lint
npm run lint -- --fix  # Auto-fix linting issues
```

## Architecture & Key Files

### Database Layer
- **Prisma Schema**: `prisma/schema.prisma` (to be created)
  - Three tables: `jobs`, `resumes`, `ai_generations`
  - See plan for schema details
- **Setup**: Run `npx prisma migrate dev --name init` after schema is written
- **Env Var**: `DATABASE_URL` must be set in `.env.local`

### API Routes
All routes live in `app/api/` following Next.js conventions:
- `/jobs` — CRUD for job entries (POST, GET)
- `/jobs/[id]` — Single job (GET, PATCH, DELETE)
- `/jobs/[id]/status` — Update status on drag-drop (PATCH)
- `/resumes` — Upload/list resumes (POST, GET)
- `/resumes/[id]` — Update/archive resume (PATCH, DELETE)
- `/ai/generate/cover-letter` — Generate cover letter (POST)
- `/ai/generate/resume-bullets` — Generate bullets (POST)
- `/ai/generate/interview-questions` — Generate questions (POST)
- `/ai/generate/company-brief` — Generate company brief (POST)
- `/ai/export/*-pdf` — Export AI output as PDF (POST)

### Components & Pages
- `app/page.tsx` — Main kanban board view (entry point)
- `app/layout.tsx` — Root layout with Tailwind + Linear design tokens
- `components/` — React components (to be built in phases)

### Utilities
- `lib/db.ts` — Prisma client instance
- `lib/openrouter.ts` — OpenRouter API wrapper (to be created)
- `lib/prompts/` — Prompt templates for each AI generator (to be created)

## Setup Checklist

1. **Database**: Set up PostgreSQL (local or cloud: Supabase, Vercel Postgres, etc.)
   - Set `DATABASE_URL` in `.env.local`
   - Run `npx prisma migrate dev` to initialize schema

2. **Environment**: Create `.env.local`
   ```
   DATABASE_URL=postgresql://...
   OPENROUTER_API_KEY=sk-or-...
   OPENROUTER_MODEL=meta-llama/llama-2-70b-chat  # optional
   ```

3. **Prisma**: 
   ```bash
   npx prisma db push     # Sync schema to DB
   npx prisma generate   # Generate client
   ```

## Design Implementation Notes

- **Color Palette**: Use Tailwind's `extend` to map Linear colors (canvas #010102, surface-1 #0f1011, primary #5e6ad2). See `tailwind.config.ts`.
- **Typography**: Fallback to `SF Pro Display` for headers (Linear's custom font unavailable). Body uses Geist via Next.js default.
- **Components**: Reference `DESIGN-linear.app.md` for component specs (buttons, cards, inputs).
- **Dark-First**: No light mode; all surfaces on deep canvas (#010102).
- **Accent Usage**: Lavender (#5e6ad2) reserved for: primary CTA ("Generate Kit"), focus rings, link emphasis. Never use as background.

## Key Architectural Decisions

1. **Drag-and-Drop**: dnd-kit over react-beautiful-dnd (React 19 support).
2. **No cascading deletes**: AI generations persist even after job deletion (for reference).
3. **Resume versioning**: Multiple resumes stored; one marked "active" for default use in AI generation.
4. **URL parsing**: Server-side fetch (Node.js bypasses CORS); fallback to manual entry if fetch fails.
5. **PDF export**: Individual PDFs per AI output type, not bundled (jspdf + html2canvas).

## Implementation Phases (from plan)

**Phase 1 (Weeks 1-2)**: Core board + drag-drop + job CRUD + resume management
**Phase 2 (Weeks 2-3)**: AI integration + 4 generators + PDF export + generation history
**Phase 3 (Weeks 3+)**: Polish, styling refinement, search/filter, stats dashboard

## Next Steps

1. Initialize Prisma schema (`prisma/schema.prisma`)
2. Set up `.env.local` with DATABASE_URL and OpenRouter key
3. Build kanban board component (Phase 1)
4. Implement job API routes (Phase 1)
5. Create resume management UI (Phase 1)
