# Study Habit Refinement System

## Project Overview
AI-guided web app that helps students improve study efficiency by refining one core habit through skill-based progression. Built with Next.js, Prisma/SQLite, Claude API.

## Tech Stack
- Next.js 14+ (App Router) with TypeScript
- Prisma ORM with SQLite
- Anthropic Claude API for AI coaching
- NextAuth.js for authentication
- Tailwind CSS + shadcn/ui for styling
- Recharts for data visualization

## Key Concepts
- ONE habit, ONE skill at a time
- 8 skills across 4 tiers with explicit dependency chain
- 3-week skill deployment cycle (stabilize -> express -> probe)
- Rolling events model (academic events are checkpoints, not endpoints)
- AI never overrides user choices, never moralizes

## Directory Structure
- prisma/ — schema and seed data (8 skills + dependencies)
- src/app/(app)/ — authenticated app pages (dashboard, check-in, skills, chat)
- src/lib/ai/ — Claude API integration (system prompt, context builder)
- src/lib/skills/ — skill progression logic and thresholds
- src/components/ — React components organized by feature

## Commands
- npm run dev — start dev server
- npx prisma db push — sync schema to database
- npx prisma db seed — seed skills and dependencies
- npm run build — production build

## Important Rules
- Dark theme only (#0d0d14 background)
- No XP, no streaks, no gamification scores
- Daily check-in must complete in < 2 minutes
- System prompt in src/lib/ai/systemPrompt.ts is the single source of truth for AI behavior
- Skill progression thresholds are in src/lib/skills/progression.ts
