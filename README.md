# Study Habits

AI-guided web app that helps students build real study skills through a structured progression system. One skill at a time, one habit that sticks — no streaks, no points, just progress.

## How It Works

1. **Onboarding** — Set your study goals and complete a brief self-assessment
2. **Observation Phase** — 7 days of daily check-ins to establish your baseline
3. **Skill Training** — Work through 8 skills across 4 tiers in a 3-week cycle per skill:
   - **Week 1: Stabilize** — Build consistency with a specific time/place/action routine
   - **Week 2: Express** — Adapt the skill to fit your real schedule
   - **Week 3: Probe** — Stress-test and generalize the skill
4. **AI Coaching** — Chat with an AI coach that sees your full context and gives personalized guidance

## Features

- **Dashboard** with weekly trend charts and current progress
- **Daily Check-in** (< 2 min) tracking focus, energy, and mood
- **Skill Progression** with dependency-based unlocking
- **AI Chat** powered by Groq (Llama 3.3 70B)
- **Event Tracking** for exams, deadlines, and projects
- **Check-in History** with detailed logs
- **Password Reset** via email (Resend)
- **Remember Me** for extended sessions

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (JWT + Credentials)
- **AI:** Groq API (Llama 3.3 70B)
- **Email:** Resend
- **UI:** Tailwind CSS + shadcn/ui + Recharts
- **Deployment:** Railway

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

```bash
git clone https://github.com/HlaaDukhan/study-habits.git
cd study-habits
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/study_habits"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GROQ_API_KEY="your-groq-api-key"
RESEND_API_KEY="your-resend-api-key"
```

Push the schema and seed the database:

```bash
npx prisma db push
npx prisma db seed
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for local dev, or visit the [live demo](https://meticulous-enthusiasm-production.up.railway.app).

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Authenticated pages (dashboard, chat, skills, etc.)
│   ├── (auth)/         # Login, register, forgot/reset password
│   └── api/            # API routes
├── components/ui/      # shadcn/ui components
├── lib/
│   ├── ai/             # System prompt + context builder for AI chat
│   ├── db/             # Prisma client
│   └── skills/         # Skill progression logic and thresholds
└── types/              # TypeScript declarations
```

## License

MIT
