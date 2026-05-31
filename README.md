# Decision Assistant

Document life and work decisions, get structured AI feedback on your reasoning.

## Live Demo

[Decision Assistant Demo](https://decision-assistant-gules.vercel.app)

## GitHub Repository

[Decision Assistant Repository](https://github.com/olehvitriachenko/decision-assistant)

---

## Problem

Important decisions are often made under uncertainty and cognitive bias.

Decision Assistant helps users document their reasoning and receive structured AI feedback — detected biases, alternative options, and a confidence score.

The goal is not to make decisions for the user, but to help them evaluate their own thinking more objectively.

## Overview

Built with Next.js, Supabase, and OpenAI. Users can:

- Register and manage personal decisions
- Run background LLM analysis on each decision
- Review history, filters, and dashboard insights
- Re-analyze or retry after failures

## Screenshots

### Dashboard

![Dashboard](./docs/dashboard.png)

Analytics dashboard showing decision categories, cognitive bias trends, support distribution, and recent decisions.

### AI Decision Analysis

![AI Decision Analysis](./docs/decision-analysis.png)

Detailed AI-generated analysis including summary, detected biases, support score, and alternative options.

## Features

### Authentication

- Registration and login with Supabase Auth
- Protected routes
- Secure session management

### Decision Management

- Create decisions (title, situation, decision, optional thoughts)
- Browse decision history with filters and sorting
- View decision details
- Re-analyze decisions
- Delete decisions

### AI Analysis

Each decision is analyzed using OpenAI and includes:

- Decision category
- Support score (0–100)
- Cognitive bias detection
- Alternative options
- AI-generated summary

### Dashboard Insights

- Category frequency visualization
- Cognitive bias frequency visualization
- Support score distribution
- Recent decisions overview

### UX States

- Loading states (form submission, page skeletons, processing indicator)
- Error states with retry
- Automatic refresh while analysis is in progress

### Background Processing

AI analysis runs asynchronously:

1. User submits a decision
2. Decision is stored with `processing` status
3. User is redirected immediately
4. Analysis runs in the background
5. Results appear automatically when completed

### Bonus

- Dark mode
- Decision filters (status, category, bias)
- Sorting (date, confidence, complexity, title)
- Dashboard visualizations

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)

### AI

- OpenAI GPT-4.1 Mini
- Structured Outputs
- Zod validation

## Project Structure

```
src/
├── app/
├── components/
├── lib/
│   ├── actions/
│   ├── db/
│   ├── openai/
│   └── supabase/
└── types/

supabase/
└── migrations/
```

## Architecture Decisions

### Background AI Processing

The application follows a "save first, analyze later" approach to avoid blocking users while waiting for LLM responses. Analysis is executed asynchronously using Next.js `after()` post-response processing.

### Security

- Row Level Security enabled
- User-level data isolation
- Service role key used only for server-side admin operations (status updates, analysis writes, lock RPCs)
- Database-level validation constraints
- One analysis row per decision (`UNIQUE (decision_id)`)

### Concurrency-Safe Analysis Pipeline

Background analysis uses database-level coordination to avoid duplicate OpenAI calls and stale writes:

1. **`claim_decision_analysis_lock`** — only one worker analyzes a decision at a time
2. **`analysis_generation`** — incremented on re-analyze; invalidates in-flight workers
3. **`insert_decision_analysis_if_generation_matches`** — verifies generation and inserts in one transaction
4. **`reset_decision_analysis`** — atomically deletes the old analysis, bumps generation, and resets status to `processing`

Client recovery polling (`resumePendingAnalysis`) only runs after a grace period so it does not race with the initial `after()` job.

### Validation

Validation is implemented on multiple levels:

- Client-side validation
- Zod schemas
- PostgreSQL constraints

## Environment Variables

Copy `.env.example` to `.env` (or `.env.local` for Next.js):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SECRET_KEY` | Supabase secret (service role) key — server only |
| `OPENAI_API_KEY` | OpenAI API key — server only |

## Local Development

**Prerequisites:** Node.js 20+, Supabase project, OpenAI API key

```bash
git clone https://github.com/olehvitriachenko/decision-assistant.git
cd decision-assistant
npm install
cp .env.example .env   # fill in values
npm run db:link        # once, links local Supabase CLI to remote project
npm run db:push        # apply migrations
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase Auth setup

For registration to work out of the box (immediate session after sign-up):

1. Supabase → **Authentication** → **Providers** → **Email**
2. Disable **Confirm email** (or configure email confirmation + redirect URLs separately)
3. Supabase → **Authentication** → **URL Configuration**
   - **Site URL:** your production URL (e.g. `https://decision-assistant-gules.vercel.app`)
   - **Redirect URLs:** add production and local URLs (e.g. `http://localhost:3000/**`, `https://decision-assistant-gules.vercel.app/**`)

## Deployment

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Apply Supabase migrations: `npm run db:push`
5. Complete the [Supabase Auth setup](#supabase-auth-setup) above

## Database

Migrations live in `supabase/migrations/`:

- `decisions` — user decisions with status (`processing`, `completed`, `failed`), `analysis_generation`, `analysis_locked_at`
- `analyses` — structured AI output linked to decisions (one row per decision)
- RLS policies ensure users access only their own data
- RPC functions: paginated list/stats, analysis lock claim/release, atomic insert, re-analyze reset

## Testing

Automated tests are not included — the assignment focused on a working demo and architecture. Critical flows (auth, create → background analysis → completed, re-analyze, filters) are verified manually against the [live demo](https://decision-assistant-gules.vercel.app).

## Future Improvements

- Additional locales (English UI, shared i18n layer)
- Decision comparison
- Export (PDF / Markdown)
- Advanced analytics
- Email verification and account confirmation flows
- Password reset and account recovery
- Automated tests (unit and end-to-end)
- Rate limiting for auth and AI analysis requests

## Notes

- UI copy is in Ukrainian.
- This project was built as part of a Product Engineer (Fullstack) technical assessment focused on architecture design, AI integration, security, UX, and product thinking.
