# Signal — AI Scrum Master

> Standup in → structured blockers out. A signal pipeline for agile teams, not a chat toy glued to a model.

## Pitch

Most “AI scrum” demos are chat UIs. Signal turns messy standup text into **typed, queryable team state**: summaries, blockers (type + severity), optional Pinecone RAG, and a Next.js dashboard. Heavier analysis runs on **BullMQ + Redis** so the API stays responsive.

**Demo script (≈2 min)**

1. Log in as `demo@scrum.signal` / `demo1234` (after seed)
2. Open **Standups** → submit an update that says you’re *blocked waiting on credentials*
3. Open **Blockers** → see the structured card
4. Open **AI Insights** → ask “what’s blocking the current sprint?”
5. Open **Dashboard** / **Jobs** → health + BullMQ counts

## Stack

| Layer | Tech |
|--------|------|
| Frontend | Next.js 15, React 19, Redux Toolkit / RTK Query, Tailwind 4, Radix, Framer Motion |
| Backend | Express 5, TypeScript, Prisma, PostgreSQL |
| Auth | JWT + refresh tokens, optional Google OAuth |
| AI | Google Gemini (summaries, blocker typing, Q&A) |
| RAG | Optional Pinecone + Gemini embeddings |
| Jobs | BullMQ + Redis (`REDIS_URL`) |
| Infra | Docker Compose, GitHub Actions (test/build/Trivy) |

## What is real vs optional

| Feature | Status |
|---------|--------|
| Auth (email/password, JWT) | Real |
| Org membership + org-scoped sprints/standups/blockers | Real |
| Standup create → summary + blocker detection | Real (regex + Gemini when keyed) |
| AI Insights chat → `POST /api/ai/ask` | Real (needs `GEMINI_API_KEY`) |
| BullMQ workers | Real when `REDIS_URL` is set; otherwise jobs run inline |
| Pinecone RAG | Optional — soft-fails without keys |
| Slack / Jira | Thin real clients — need tokens |
| Password reset email | Not shipped |
| WebSockets | Not implemented |

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis (recommended for BullMQ)
- `GEMINI_API_KEY` for AI features

### Backend

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET, REDIS_URL, GEMINI_API_KEY

npm install
npx prisma migrate deploy
npx prisma generate
npm run db:seed
npm run dev
```

API: `http://localhost:5000`

### Frontend

```bash
cd frontend/frontend
cp .env.example .env.local   # or create with NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

App: `http://localhost:3000`

### Docker

```bash
docker compose up --build
```

## Architecture

```
Standup UI → Express API → Prisma/Postgres
                 ↓
            BullMQ (Redis)
                 ↓
         Workers → Gemini / Pinecone
                 ↓
         Blockers + insights

AI Insights UI → POST /api/ai/ask → RAG (optional) → Gemini
```

## API (core)

- `POST /api/auth/register` — creates user + personal org
- `POST /api/auth/login`
- `GET/POST /api/sprints` — org-scoped
- `GET/POST /api/standups` — org-scoped; detection + queue on create
- `GET /api/blockers` · `PATCH /api/blockers/:id/resolve`
- `POST /api/ai/ask` — `{ question | query, sprintId? }`
- `GET /api/workflows/queue/status` — BullMQ counts

## Seed accounts

| Email | Password | Role |
|-------|----------|------|
| demo@scrum.signal | demo1234 | Engineer |
| pm@scrum.signal | demo1234 | PM |

## Interview talking points

- **Signal extraction**, not chatbot theater: standup → typed blockers
- **Tenant scoping** via `Organization` / `Member` / `currentOrgId`
- **Async boundary**: BullMQ workers call `workflowServices` for sentiment / health
- **Honest RAG**: Pinecone optional; UI shows sources when present
- **UI**: Watermelon-inspired dark charcoal + green — product tool, not purple SaaS cliché

## License

MIT
