# 🤖 AI Scrum Master

> An AI-powered agile project management platform that revolutionizes sprint management, automates standup tracking, identifies blockers intelligently, and provides predictive insights for agile teams.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.x-red)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-variables-explained)
- [Frontend Deep Dive](#-frontend-architecture)
- [Backend Deep Dive](#-backend-architecture)
- [API Documentation](#-api-endpoints)
- [Workflows & AI](#-workflows-explained)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment-guide)
- [Troubleshooting](#-common-issues)

## 🚀 Features

- **Sprint Management**: Create and track sprints with start/end dates, burndown charts, and velocity metrics
- **Daily Standups**: Log daily standup updates for team members with AI sentiment analysis
- **Blocker Tracking**: Identify and manage blockers with severity levels and automated detection
- **AI Insights**: Get AI-powered recommendations, risk assessments, and completion predictions
- **Workflows**: Automate tasks with AI-powered background jobs and queue management
- **Analytics Dashboard**: Track team velocity, burndown charts, sprint health, and performance metrics
- **Google OAuth**: Sign in with Google or use email/password authentication with JWT tokens
- **Real-time Updates**: WebSocket support for live collaboration (coming soon)
- **Task Prioritization**: AI-powered task ranking based on complexity and dependencies
- **RAG-powered Solutions**: Semantic search for similar past issues and blocker resolutions

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │  Redux Store │         │
│  │  (App Router)│  │  (Radix UI)  │  │  (RTK Query) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────▼─────────────────────────────────────┐
│                      Backend (Express.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Routes     │  │ Controllers  │  │   Services   │         │
│  │ (REST + Auth)│  │  (Business   │  │  (AI + DB)   │         │
│  └──────────────┘  │    Logic)    │  └──────────────┘         │
│                    └──────────────┘                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   PostgreSQL   │  │    Redis    │  │  Google Gemini  │
│   (Neon DB)    │  │  (Upstash)  │  │   AI + Pinecone │
│  Prisma ORM    │  │  BullMQ     │  │   Vector Store  │
└────────────────┘  └─────────────┘  └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework with App Router |
| **TypeScript** | 5.x | Type safety |
| **Redux Toolkit** | 2.x | State management |
| **RTK Query** | 2.x | Data fetching & caching |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Framer Motion** | 11.x | Animations |
| **Radix UI** | 1.x | Accessible components |
| **Zod** | 3.x | Schema validation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 5.x | Web framework |
| **TypeScript** | 5.x | Type safety |
| **Prisma** | 6.x | ORM for PostgreSQL |
| **Passport.js** | 0.7.x | Authentication |
| **BullMQ** | 5.x | Job queue management |
| **Google Gemini** | Latest | AI-powered insights |
| **Pinecone** | 5.x | Vector database for RAG |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **PostgreSQL (Neon)** | Serverless database |
| **Redis (Upstash)** | Queue management |
| **Vercel** | Frontend hosting |
| **Railway/Render** | Backend hosting |

## ⚡ Quick Start

### Prerequisites
```bash
# Required
- Node.js 20.x or higher
- npm or yarn
- PostgreSQL database (Neon recommended)
- Redis (Upstash recommended)

# Optional (for AI features)
- Google Gemini API key
- Pinecone account
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-scrum-master.git
cd ai-scrum-master
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start backend server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend/frontend
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local
nano .env.local

# Start frontend server
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `npx prisma studio` (database GUI)

## 🚀 Features

## 🎨 Frontend Architecture

### Project Structure
```
frontend/frontend/src/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page (Hero + Features)
│   ├── globals.css              # Global styles + Tailwind
│   ├── auth/                    # Authentication flows
│   │   ├── login/page.tsx       # Email/password login
│   │   ├── signup/page.tsx      # User registration
│   │   └── callback/page.tsx    # OAuth callback handler
│   ├── dashboard/page.tsx       # Main metrics dashboard
│   ├── sprints/                 # Sprint management
│   │   ├── page.tsx             # Sprint list view
│   │   └── [id]/page.tsx        # Sprint detail (dynamic)
│   ├── standups/page.tsx        # Daily standup logs
│   ├── blockers/page.tsx        # Blocker tracking
│   ├── analytics/page.tsx       # Charts & metrics
│   ├── ai-insights/page.tsx     # AI-powered insights
│   ├── settings/page.tsx        # User preferences
│   └── workflows/page.tsx       # AI workflow automation
│
├── components/                   # Reusable components
│   ├── ui/                      # Base UI (Radix + Tailwind)
│   │   ├── button.tsx           # Button variants
│   │   ├── card.tsx             # Card containers
│   │   ├── dialog.tsx           # Modal dialogs
│   │   ├── input.tsx            # Form inputs
│   │   ├── table.tsx            # Data tables
│   │   └── ... (25+ components)
│   ├── auth/                    # Auth components
│   │   └── ProtectedRoute.tsx  # Route guard
│   └── layout/                  # Layout components
│       └── MainLayout.tsx       # Sidebar + Nav
│
├── store/                        # Redux Toolkit
│   ├── store.ts                 # Store config
│   ├── slices/                  # State slices
│   │   ├── authSlice.ts         # Auth state
│   │   └── sprintsSlice.ts      # Sprint filters
│   └── api/                     # RTK Query APIs
│       ├── apiSlice.ts          # Base API + types
│       ├── sprintsApi.ts        # Sprint endpoints
│       ├── standupsApi.ts       # Standup endpoints
│       ├── blockersApi.ts       # Blocker endpoints
│       ├── backlogApi.ts        # Backlog endpoints
│       ├── aiApi.ts             # AI insights
│       └── workflowsApi.ts      # Workflow endpoints
│
├── services/                     # Business logic
│   └── authService.ts           # Auth helpers
├── lib/                          # Utilities
│   └── utils.ts                 # Helper functions
└── types/                        # TypeScript types
    └── index.ts                 # Shared interfaces
```

### State Management Flow

```typescript
// Redux Store Architecture
┌─────────────────────────────────────────────┐
│           Redux Toolkit Store               │
├─────────────────────────────────────────────┤
│  Auth Slice         │  UI Slice             │
│  - user             │  - theme              │
│  - token            │  - sidebarOpen        │
│  - isAuthenticated  │  - notifications      │
├─────────────────────────────────────────────┤
│         RTK Query API Slice                 │
│  - Automatic caching                        │
│  - Automatic refetching                     │
│  - Optimistic updates                       │
│  - Cache invalidation                       │
└─────────────────────────────────────────────┘
```

### Key Features Implementation

**1. Authentication Flow**
```typescript
// Login → JWT Token → Store → Auto-refresh
User Login → Backend API → JWT + Refresh Token
           ↓
    Redux Store (authSlice)
           ↓
    localStorage persistence
           ↓
    Automatic token refresh (every 6 days)
           ↓
    Protected routes (ProtectedRoute wrapper)
```

**2. Data Fetching with RTK Query**
```typescript
// Automatic caching, deduplication, and refetching
const { data: sprints, isLoading, error } = useGetSprintsQuery({ filter: 'active' })

// Mutations with automatic cache invalidation
const [createSprint] = useCreateSprintMutation()
await createSprint(newSprint).unwrap() // Auto-refetches sprint list
```

**3. Real-time Sprint Progress**
```typescript
// Dashboard calculates progress based on time elapsed
const calculateSprintProgress = (sprint) => {
  const now = new Date().getTime()
  const start = new Date(sprint.startDate).getTime()
  const end = new Date(sprint.endDate).getTime()
  return Math.min(Math.max((now - start) / (end - start) * 100, 0), 100)
}
```

**4. Form Validation with Zod**
```typescript
const sprintSchema = z.object({
  name: z.string().min(1, 'Sprint name required'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
})
```

### Component Library

| Component | Variants | Usage |
|-----------|----------|-------|
| Button | default, destructive, outline, ghost, link | Actions, CTAs |
| Badge | default, secondary, destructive, outline | Status indicators |
| Card | - | Content containers |
| Dialog | - | Modals, forms |
| Table | - | Data grids |
| Input | - | Form fields |
| Select | - | Dropdowns |
| Tabs | - | Navigation |
| Toast | - | Notifications |

### Styling System
```css
/* Tailwind + CSS Variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
}
```

### Performance Optimizations
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component with blur placeholders
- **Font Optimization**: Next.js font optimization with Inter font
- **RTK Query Caching**: 60-second cache for API responses
- **Lazy Loading**: Components loaded on-demand

## 🔧 Backend Architecture

### Project Structure
```
backend/
├── index.ts                     # Express server entry
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── src/
│   ├── config/
│   │   └── passport.ts         # Passport.js config
│   ├── controllers/            # Request handlers
│   │   ├── authController.ts
│   │   ├── sprintController.ts
│   │   ├── standupController.ts
│   │   ├── blockerController.ts
│   │   ├── jiraController.ts
│   │   └── aiController.ts
│   ├── services/               # Business logic
│   │   ├── sprintServices.ts
│   │   ├── standupServices.ts
│   │   ├── blockerServices.ts
│   │   ├── aiServices.ts
│   │   ├── vectorServices.ts   # Pinecone RAG
│   │   ├── queueServices.ts    # BullMQ
│   │   └── ragServices.ts      # AI + Vector search
│   ├── routes/                 # API routes
│   │   ├── auth.ts
│   │   ├── sprints.ts
│   │   ├── standups.ts
│   │   ├── blockers.ts
│   │   ├── ai.ts
│   │   └── workflows.ts
│   ├── middleware/
│   │   └── authMiddleware.ts   # JWT verification
│   └── validation/
│       ├── schemas.ts          # Zod schemas
│       └── middleware.ts       # Validation middleware
└── __tests__/                  # Jest tests
    ├── services/
    ├── routes/
    └── mocks.ts
```

### API Architecture Flow
```
HTTP Request → Routes → Validation → Auth Middleware → Controller
                                                           ↓
                                                    Service Layer
                                                           ↓
                                    ┌──────────────┬──────┴──────┬──────────────┐
                                    ↓              ↓             ↓              ↓
                              Prisma ORM    AI Services   Vector Store   Queue Manager
                                    ↓              ↓             ↓              ↓
                              PostgreSQL    Google Gemini   Pinecone       Redis/BullMQ
```

### Key Backend Features

**1. JWT Authentication**
```typescript
// Dual-token system: Access Token (7 days) + Refresh Token (30 days)
Access Token → Short-lived, sent with every request
Refresh Token → Long-lived, stored in database, used to get new access token
```

**2. Blocker Auto-Detection**
```typescript
// AI-powered blocker detection in standup text
const blockerPatterns = {
  dependency: /blocked by|waiting for|depends on/i,
  technical: /bug|error|issue|problem/i,
  resource: /need.*help|missing.*access/i,
  external: /third.*party|api.*down/i
}
```

**3. Queue Management (BullMQ)**
```typescript
// Background job processing
Queue Job → Redis → Worker Process → AI Analysis → Database
```

**4. Vector Search (Pinecone + RAG)**
```typescript
// Find similar past blockers and solutions
User Blocker → Generate Embedding → Search Pinecone → Return Similar Issues
```

### Database Schema (Prisma)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String?  // Optional for OAuth users
  name      String
  standups  Standup[]
  tokens    RefreshToken[]
}

model Sprint {
  id         Int      @id @default(autoincrement())
  name       String
  startDate  DateTime
  endDate    DateTime
  standups   Standup[]
  backlogItems BacklogItem[]
}

model Standup {
  id        Int      @id @default(autoincrement())
  userId    Int
  sprintId  Int?
  summary   String   @db.Text
  user      User     @relation(fields: [userId], references: [id])
  sprint    Sprint?  @relation(fields: [sprintId], references: [id])
  blockers  Blocker[]
}

model Blocker {
  id          Int      @id @default(autoincrement())
  standupId   Int?
  type        String   // dependency, technical, resource, external
  severity    String   // low, medium, high, critical
  description String
  status      String   // active, resolved, escalated
  standup     Standup? @relation(fields: [standupId], references: [id])
}

model BacklogItem {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  sprintId    Int?
  sprint      Sprint?  @relation(fields: [sprintId], references: [id])
  storyPoints Int?     @default(0)
  priority    String?  @default("medium") // low, medium, high
  status      String?  @default("todo")    // todo, in-progress, done
  assignee    String?
  tags        String[] @default([])
}
```

## 📋 Workflows Explained

### What are Workflows?

Workflows are automated AI-powered background processes that run asynchronously to provide intelligent insights and automate tasks:

1. **Sprint Analysis**: Analyzes sprint progress and predicts completion likelihood
2. **Risk Detection**: Scans standups and blockers to identify project risks
3. **Task Prioritization**: Uses AI to suggest which tasks should be tackled first
4. **Team Productivity**: Analyzes team patterns and suggests improvements
5. **Blocker Resolution**: Suggests solutions for common blockers using RAG (Retrieval-Augmented Generation)

### What are Workflows?

Workflows are automated AI-powered background processes that run asynchronously to provide intelligent insights and automate tasks. They leverage BullMQ (Redis-based queue) for reliable job processing.

### Available Workflows

| Workflow | Purpose | Trigger | AI Model |
|----------|---------|---------|----------|
| **Sprint Analysis** | Analyzes sprint progress and predicts completion likelihood | Manual or Schedule | Google Gemini |
| **Risk Detection** | Scans standups and blockers to identify project risks | Automatic on new standup | Google Gemini |
| **Task Prioritization** | Uses AI to suggest which tasks should be tackled first | Manual | Google Gemini |
| **Team Productivity** | Analyzes team patterns and suggests improvements | Weekly | Google Gemini |
| **Blocker Resolution** | Suggests solutions for blockers using RAG | Automatic | Gemini + Pinecone |
| **Sentiment Analysis** | Analyzes standup sentiment to detect team morale | Automatic | Google Gemini |

### Workflow Architecture

```
User Action/Trigger
        ↓
  Queue Job (BullMQ)
        ↓
  Redis Storage
        ↓
Background Worker Process
        ↓
AI Processing (Google Gemini)
        ↓
Vector Search (Pinecone RAG) [Optional]
        ↓
Store Results (PostgreSQL)
        ↓
Frontend Display (RTK Query auto-refetch)
```

### How Workflows Work

```typescript
// Example: Sprint Analysis Workflow

// 1. User triggers analysis
POST /api/workflows/sprint-analysis
{ "sprintId": 123 }

// 2. Backend queues job
const job = await sprintAnalysisQueue.add('analyze-sprint', {
  sprintId: 123,
  userId: user.id
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
})

// 3. Worker processes job
Worker.on('completed', async (job) => {
  const result = await analyzeSprintWithAI(job.data)
  await db.sprintInsights.create({ data: result })
})

// 4. Frontend automatically refetches
const { data: insights } = useGetSprintInsightsQuery(sprintId)
```

### Queue Status Monitoring
```bash
GET /api/workflows/queue/status

Response:
{
  "queues": {
    "aiWorkflows": {
      "waiting": 3,
      "active": 1,
      "completed": 45,
      "failed": 2
    },
    "notifications": {
      "waiting": 0,
      "active": 0,
      "completed": 120
    }
  }
}
```

## 🔧 Environment Variables Explained

### Backend Environment Variables (`backend/.env`)

#### Database Configuration
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```
- **Purpose**: Connection string for PostgreSQL database (using Neon serverless Postgres)
- **Required**: Yes
- **Format**: Standard PostgreSQL connection string
- **Security**: Keep this secret! Contains database credentials

#### Redis Configuration
```bash
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token_here"
```
- **REDIS_URL**: Local Redis server for job queues (Bull/BullMQ)
- **UPSTASH_REDIS_REST_URL**: Cloud Redis REST API endpoint (alternative to local Redis)
- **UPSTASH_REDIS_REST_TOKEN**: Authentication token for Upstash Redis
- **Purpose**: Queue management for background workflows
- **Required**: One of REDIS_URL or UPSTASH credentials
- **Note**: Workflows won't work without Redis, but app will still run

#### Application Configuration
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```
- **PORT**: Backend server port (default: 5000)
- **NODE_ENV**: Environment mode (development/production)
- **FRONTEND_URL**: Frontend origin for CORS configuration
- **Purpose**: Basic server configuration

#### JWT Configuration
```bash
JWT_SECRET="your-secret-key-minimum-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
```
- **JWT_SECRET**: Secret key for signing access tokens
- **JWT_REFRESH_SECRET**: Secret key for signing refresh tokens
- **JWT_EXPIRES_IN**: Access token expiration time (7 days)
- **JWT_REFRESH_EXPIRES_IN**: Refresh token expiration time (30 days)
- **Purpose**: User authentication and session management
- **Required**: Yes
- **Security**: Must be strong random strings (minimum 32 characters)
- **Generate**: Use `openssl rand -hex 32` or similar

#### OpenAI Configuration
```bash
OPENAI_API_KEY="sk-proj-..."
```
- **Purpose**: AI-powered features (insights, task prioritization, risk detection)
- **Required**: Yes for AI features, No for basic CRUD operations
- **Get Key**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use (typically $0.002 per 1K tokens)
- **Features Disabled Without It**: AI Insights, Sprint Planning Assistant, Risk Assessment

#### Pinecone Configuration
```bash
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="ai-scrum-master"
PINECONE_ENVIRONMENT="us-east-1-aws"
```
- **Purpose**: Vector database for RAG (Retrieval-Augmented Generation)
- **Use Case**: Store embeddings of past solutions to suggest fixes for current blockers
- **Required**: No (optional for advanced AI features)
- **Get Key**: https://www.pinecone.io/
- **Features**: Semantic search for similar past issues, blocker resolution suggestions

#### Google OAuth Configuration
```bash
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```
- **Purpose**: Enable "Sign in with Google" functionality
- **Required**: No (users can still use email/password)
- **Setup**: 
  1. Go to https://console.cloud.google.com/
  2. Create OAuth 2.0 Client ID
  3. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
  4. Copy Client ID and Secret
- **Production**: Update GOOGLE_CALLBACK_URL to your production domain

#### Session Configuration
```bash
SESSION_SECRET="your-session-secret-uuid-or-random-string"
```
- **Purpose**: Encrypts session cookies for Passport.js
- **Required**: Yes
- **Generate**: Use `uuidgen` or `openssl rand -base64 32`
- **Security**: Keep this secret!

### Frontend Environment Variables (`frontend/frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
- **Purpose**: Base URL for all backend API calls
- **Required**: Yes
- **Development**: `http://localhost:5000/api`
- **Production**: Your production API URL (e.g., `https://api.yourdomain.com/api`)
- **Note**: Must include `/api` at the end

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```
- **Purpose**: Google OAuth Client ID for frontend
- **Required**: No (only if using Google Sign-In)
- **Must Match**: Backend GOOGLE_CLIENT_ID

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file with all required variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend/frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your values

# Start the development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs (if configured)

## 📊 Database Schema

The application uses **PostgreSQL** with **Prisma ORM**:

- **Users**: User accounts and authentication
- **Sprints**: Sprint information with start/end dates
- **Standups**: Daily standup updates linked to users and sprints
- **Blockers**: Issues blocking progress with severity levels
- **BacklogItems**: Product backlog items that can be assigned to sprints
- **RefreshTokens**: JWT refresh tokens for session management

## 🔐 Authentication Flow

### Authentication Architecture
```
┌─────────────────────────────────────────────────────┐
│               Authentication Methods                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Email/Password          Google OAuth              │
│       ↓                        ↓                    │
│  POST /auth/login      GET /auth/google            │
│       ↓                        ↓                    │
│  Verify Password       Google Consent              │
│       ↓                        ↓                    │
│  Generate JWT          Callback + Code             │
│       ↓                        ↓                    │
│  Return Tokens         Exchange for User           │
│       ↓                        ↓                    │
│  ┌──────────────────────────────────────┐          │
│  │   JWT Access Token (7 days)          │          │
│  │   + Refresh Token (30 days)          │          │
│  └──────────────────────────────────────┘          │
│                    ↓                                │
│           Store in Redux + localStorage            │
│                    ↓                                │
│      Include in Authorization header               │
│        Bearer {token}                              │
└─────────────────────────────────────────────────────┘
```

### Token Lifecycle
```
1. Login → Generate Access Token (7d) + Refresh Token (30d)
2. Store Refresh Token in database
3. Frontend stores both tokens in localStorage
4. Every API request includes: Authorization: Bearer {accessToken}
5. When Access Token expires (7d):
   - Frontend calls POST /auth/refresh with refreshToken
   - Backend validates refreshToken from database
   - Generate new Access Token
   - Return new token to frontend
6. Logout → Delete refreshToken from database
```

### Protected Routes Implementation

**Frontend Route Guard:**
```typescript
// components/auth/ProtectedRoute.tsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const router = useRouter()
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated])
  
  if (!isAuthenticated) return null
  return <>{children}</>
}
```

**Backend Middleware:**
```typescript
// middleware/authMiddleware.ts
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Google OAuth Setup

1. **Create OAuth Client**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

2. **Configure Backend**
```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

3. **Configure Frontend**
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

4. **OAuth Flow**
```
User clicks "Sign in with Google"
        ↓
Frontend redirects to: GET /api/auth/google
        ↓
Backend redirects to Google consent screen
        ↓
User approves
        ↓
Google redirects to: /api/auth/google/callback?code=xyz
        ↓
Backend exchanges code for user profile
        ↓
Create/update user in database
        ↓
Generate JWT tokens
        ↓
Redirect to frontend: /auth/callback?token=xyz&refreshToken=abc
        ↓
Frontend stores tokens and fetches user data
        ↓
Redirect to /dashboard
```

## 🔐 Authentication Flow

### 1. User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login with Email/Password
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "user": { ... },
  "token": "...",
  "refreshToken": "..."
}
```

### 3. Login with Google OAuth
```bash
# Step 1: Redirect to Google
GET /api/auth/google
→ Redirects to Google consent screen

# Step 2: Google callback
GET /api/auth/google/callback?code=xyz
→ Redirects to frontend: /auth/callback?token=...&refreshToken=...
```

### 4. Refresh Access Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "token": "new_access_token...",
  "refreshToken": "new_refresh_token..."
}
```

### 5. Logout
```bash
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "message": "Logged out successfully"
}
```

### 6. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-12-01T00:00:00.000Z"
}
```

## 🎯 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/login` | No | Login with email/password |
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout and invalidate tokens |
| GET | `/api/auth/me` | Yes | Get current user info |

### Sprint Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sprints` | Yes | List all sprints (`?filter=active\|completed`) |
| POST | `/api/sprints` | Yes | Create new sprint |
| GET | `/api/sprints/:id` | Yes | Get sprint by ID |
| GET | `/api/sprints/:id/summary` | Yes | Sprint details + burndown/velocity |
| PATCH | `/api/sprints/:id` | Yes | Update sprint |
| DELETE | `/api/sprints/:id` | Yes | Delete sprint |

### Standup Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/standups` | Yes | List standups (`?sprintId=X`) |
| POST | `/api/standups` | Yes | Create standup update |
| GET | `/api/standups/:id` | Yes | Get standup details |
| PUT | `/api/standups/:id` | Yes | Update standup |
| DELETE | `/api/standups/:id` | Yes | Delete standup |

### Blocker Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blockers` | Yes | List all blockers (`?sprintId=X`) |
| POST | `/api/blockers` | Yes | Create blocker manually |
| POST | `/api/blockers/detect` | Yes | Auto-detect blockers in text |
| PATCH | `/api/blockers/:id/resolve` | Yes | Mark blocker as resolved |
| DELETE | `/api/blockers/:id` | Yes | Delete blocker |

### Backlog Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/backlog` | Yes | List backlog items (`?sprintId=X`) |
| POST | `/api/backlog` | Yes | Create backlog item |
| PUT | `/api/backlog/:id` | Yes | Update backlog item |
| DELETE | `/api/backlog/:id` | Yes | Delete backlog item |

### AI Workflow Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/workflows/queue/status` | Yes | Get queue status |
| POST | `/api/workflows/sprint-analysis` | Yes | Trigger sprint analysis |
| POST | `/api/workflows/risk-detection` | Yes | Trigger risk detection |
| GET | `/api/ai/insights` | Yes | Get AI-generated insights |
| POST | `/api/ai/task-prioritization` | Yes | AI task ranking |
| GET | `/api/ai/team-productivity` | Yes | Team productivity analysis |

### Jira Integration Endpoints (Optional)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jira/connect` | Yes | Connect Jira account |
| GET | `/api/jira/issues` | Yes | Fetch Jira issues |
| POST | `/api/jira/sync` | Yes | Sync with Jira |

### Slack Integration Endpoints (Optional)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/slack/webhook` | No | Receive Slack events |
| POST | `/api/slack/notify` | Yes | Send Slack notification |

## 📚 API Usage Examples

### Example 1: Create Sprint and Add Backlog Items
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Create Sprint
SPRINT_ID=$(curl -X POST http://localhost:5000/api/sprints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sprint 1 - MVP Features",
    "startDate": "2025-12-01",
    "endDate": "2025-12-15"
  }' | jq -r '.id')

# 3. Add Backlog Item
curl -X POST http://localhost:5000/api/backlog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"User Authentication\",
    \"description\": \"Implement JWT-based auth\",
    \"priority\": \"high\",
    \"storyPoints\": 8,
    \"sprintId\": $SPRINT_ID,
    \"status\": \"todo\"
  }"

# 4. Get Sprint Summary
curl http://localhost:5000/api/sprints/$SPRINT_ID/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Example 2: Log Standup with Blocker Detection
```bash
# Log standup
curl -X POST http://localhost:5000/api/standups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sprintId": 1,
    "summary": "Completed user login. Blocked by API rate limiting issue. Planning to work on password reset."
  }'

# Auto-detected blockers will be created
# Check blockers
curl http://localhost:5000/api/blockers \
  -H "Authorization: Bearer $TOKEN"
```

### Example 3: Trigger AI Sprint Analysis
```bash
# Trigger analysis
curl -X POST http://localhost:5000/api/workflows/sprint-analysis \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sprintId": 1}'

# Check queue status
curl http://localhost:5000/api/workflows/queue/status \
  -H "Authorization: Bearer $TOKEN"

# Get insights (after job completes)
curl http://localhost:5000/api/ai/insights?sprintId=1 \
  -H "Authorization: Bearer $TOKEN"
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate tokens
- `GET /api/auth/me` - Get current user info

### Sprints
- `GET /api/sprints` - List all sprints (supports `?filter=active|completed`)
- `POST /api/sprints` - Create new sprint
- `GET /api/sprints/:id/summary` - Get sprint details with burndown/velocity
- `PUT /api/sprints/:id` - Update sprint
- `DELETE /api/sprints/:id` - Delete sprint

### Standups
- `GET /api/standups` - List standups (supports `?sprintId=X`)
- `POST /api/standups` - Create standup update
- `GET /api/standups/:id` - Get standup details
- `PUT /api/standups/:id` - Update standup
- `DELETE /api/standups/:id` - Delete standup

### Blockers
- `GET /api/blockers` - List all blockers
- `POST /api/blockers` - Create blocker
- `PUT /api/blockers/:id` - Update blocker
- `PATCH /api/blockers/:id/resolve` - Mark blocker as resolved
- `DELETE /api/blockers/:id` - Delete blocker

### AI Workflows
- `GET /api/workflows/queue/status` - Get queue status
- `POST /api/workflows/sprint-analysis` - Trigger sprint analysis
- `POST /api/workflows/risk-detection` - Trigger risk detection
- `GET /api/ai/insights` - Get AI-generated insights

## 🧪 Testing

### Test with cURL

```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Create Sprint
curl -X POST http://localhost:5000/api/sprints \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sprint 1",
    "startDate": "2025-10-27",
    "endDate": "2025-11-10"
  }'

# Get Sprints
curl http://localhost:5000/api/sprints \
  -H "Authorization: Bearer $TOKEN"
```

## 🚨 Common Issues & Solutions

### Frontend Issues

#### Issue 1: "Hydration failed" or "Text content does not match"
**Cause**: Server HTML doesn't match client
**Solution**: 
```typescript
// ❌ Wrong - causes hydration mismatch
const token = localStorage.getItem('token')

// ✅ Correct - client-only execution
const [token, setToken] = useState(null)
useEffect(() => {
  setToken(localStorage.getItem('token'))
}, [])
```

#### Issue 2: "NEXT_PUBLIC_API_URL is undefined"
**Cause**: Environment variable not loaded
**Solution**: 
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart dev server after changing `.env.local`
```bash
# ❌ Wrong
API_URL=http://localhost:5000

# ✅ Correct
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Issue 3: "401 Unauthorized" on all requests
**Cause**: Token not sent with request
**Solution**: Check RTK Query prepareHeaders
```typescript
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
},
```

#### Issue 4: "Cannot find module 'next/font/google'"
**Cause**: Next.js version mismatch
**Solution**:
```bash
npm install next@latest
rm -rf .next
npm run dev
```

### Backend Issues

#### Issue 1: "Authentication required. Please log in."
**Cause**: Missing or invalid JWT token
**Solution**: 
- Check Authorization header format: `Bearer {token}`
- Verify JWT_SECRET matches between token creation and verification
- Check token expiration (default 7 days)

#### Issue 2: "Prisma Client could not locate the binaries"
**Cause**: Prisma client not generated
**Solution**:
```bash
cd backend
npx prisma generate
npm run dev
```

#### Issue 3: Workflows not processing
**Cause**: Redis not running or wrong configuration
**Solution**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Or use Upstash (cloud Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

#### Issue 4: AI features not working
**Cause**: Invalid or missing Google Gemini API key
**Solution**:
```bash
# Verify API key
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Check API quota at: https://console.cloud.google.com/apis/dashboard
```

#### Issue 5: "Double /api/api/ in URLs"
**Cause**: Base URL already includes `/api`
**Solution**:
```typescript
// apiSlice.ts
baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Route definitions should NOT include /api
query: () => '/sprints' // ✅ Correct
query: () => '/api/sprints' // ❌ Wrong
```

### Database Issues

#### Issue 1: "Connection timeout" or "SSL required"
**Cause**: Missing SSL mode for cloud database
**Solution**:
```bash
# For Neon/Supabase/PlanetScale
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

#### Issue 2: "Table does not exist"
**Cause**: Migrations not run
**Solution**:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### Issue 3: "Unique constraint failed"
**Cause**: Duplicate email or other unique field
**Solution**: Check for existing records or reset database
```bash
# View data
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Docker Issues

#### Issue 1: "npm ci failed" during Docker build
**Cause**: Dependency conflicts or outdated lock file
**Solution**:
```bash
# Update lock file locally
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
```

#### Issue 2: "TypeScript compilation errors in Docker"
**Cause**: Different Node/TypeScript versions
**Solution**:
```dockerfile
# Use specific Node version
FROM node:20-alpine

# Match local TypeScript version
RUN npm install -g typescript@5.3.3
```

## 🚨 Common Issues

### Issue: "Authentication required. Please log in."
**Solution**: Make sure you're including the JWT token in the Authorization header

### Issue: "dotenv injecting env (0)"
**Solution**: This is misleading - check if environment variables are actually loaded by adding debug logs

### Issue: Workflows not processing
**Solution**: Ensure Redis is running (`redis-server`) or Upstash credentials are correct

### Issue: AI features not working
**Solution**: Verify OPENAI_API_KEY is valid and you have credits

### Issue: Double /api/api/ in URLs
**Solution**: Ensure NEXT_PUBLIC_API_URL ends with `/api` and authService doesn't add it again

## 📝 Development Tips & Best Practices

### Frontend Development

1. **Use TypeScript Strictly**
   ```typescript
   // Define types for all props and state
   interface SprintCardProps {
     sprint: Sprint
     onEdit: (id: number) => void
   }
   ```

2. **Leverage RTK Query Hooks**
   ```typescript
   // Automatic caching and refetching
   const { data, isLoading, error, refetch } = useGetSprintsQuery()
   ```

3. **Use Server Components Where Possible**
   ```typescript
   // Default to server components for better performance
   // Only add 'use client' when needed
   export default function StaticPage() { /* Server Component */ }
   ```

4. **Implement Error Boundaries**
   ```typescript
   // Catch errors gracefully
   if (error) return <ErrorBanner error={error} />
   if (isLoading) return <Skeleton />
   ```

5. **Use Next.js Image Optimization**
   ```typescript
   import Image from 'next/image'
   <Image src="/hero.png" alt="Hero" width={1200} height={600} priority />
   ```

### Backend Development

1. **Always Use Validation**
   ```typescript
   // Validate all inputs with Zod
   router.post('/', validateBody(createSprintSchema), createSprint)
   ```

2. **Implement Proper Error Handling**
   ```typescript
   try {
     const sprint = await sprintService.create(data)
     res.json(sprint)
   } catch (error) {
     console.error('Create sprint error:', error)
     res.status(500).json({ error: 'Failed to create sprint' })
   }
   ```

3. **Use Transactions for Multi-Step Operations**
   ```typescript
   await prisma.$transaction(async (tx) => {
     const sprint = await tx.sprint.create({ data })
     await tx.backlogItem.updateMany({ where: { sprintId: null }, data: { sprintId: sprint.id } })
   })
   ```

4. **Log Important Events**
   ```typescript
   console.log('🚀 Sprint created:', sprint.id)
   console.error('❌ Failed to analyze sprint:', error)
   ```

5. **Use Environment Variables**
   ```typescript
   const apiKey = process.env.GEMINI_API_KEY
   if (!apiKey) {
     console.warn('⚠️ Gemini API key not configured')
   }
   ```

### Database Best Practices

1. **Always Use Indexes**
   ```prisma
   model Standup {
     @@index([userId])
     @@index([sprintId])
     @@index([createdAt])
   }
   ```

2. **Use Soft Deletes for Important Data**
   ```prisma
   model Sprint {
     deletedAt DateTime?
   }
   ```

3. **Run Migrations in Order**
   ```bash
   # Development
   npx prisma migrate dev --name feature_name
   
   # Production
   npx prisma migrate deploy
   ```

### Testing Best Practices

1. **Write Unit Tests for Services**
   ```typescript
   describe('SprintService', () => {
     it('should create sprint with valid data', async () => {
       const sprint = await sprintService.create(mockData)
       expect(sprint).toHaveProperty('id')
     })
   })
   ```

2. **Test API Endpoints**
   ```typescript
   describe('POST /api/sprints', () => {
     it('should return 401 without token', async () => {
       const res = await request(app).post('/api/sprints')
       expect(res.status).toBe(401)
     })
   })
   ```

3. **Mock External Services**
   ```typescript
   jest.mock('@/services/aiServices', () => ({
     analyzeSprintWithAI: jest.fn().mockResolvedValue(mockInsights)
   }))
   ```

### Security Best Practices

1. **Never Expose Secrets**
   ```bash
   # ❌ Wrong
   git add .env
   
   # ✅ Correct
   echo ".env" >> .gitignore
   ```

2. **Use Strong JWT Secrets**
   ```bash
   # Generate secure random string
   openssl rand -hex 32
   ```

3. **Validate All User Input**
   ```typescript
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8)
   })
   ```

4. **Implement Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit'
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   })
   
   app.use('/api/', limiter)
   ```

5. **Use HTTPS in Production**
   ```typescript
   // next.config.ts
   const securityHeaders = [
     { key: 'X-Frame-Options', value: 'DENY' },
     { key: 'X-Content-Type-Options', value: 'nosniff' },
     { key: 'Strict-Transport-Security', value: 'max-age=31536000' }
   ]
   ```

## 📝 Development Tips

1. **Use the debug logs**: Both frontend and backend have console.log statements for debugging
2. **Check Network tab**: F12 → Network tab shows all API requests and responses
3. **Restart after .env changes**: Environment variables only load on server start
4. **Clear Next.js cache**: Delete `.next` folder if frontend behaves strangely
5. **Check database**: Use Prisma Studio (`npx prisma studio`) to view/edit data

## 🧪 Testing

### Running Tests

The project includes comprehensive unit and integration tests for all backend services and API routes.

#### Run All Tests
```bash
# PowerShell
.\run-tests.ps1

# Or manually
cd backend
npm test
```

#### Run Tests in Watch Mode
```bash
cd backend
npm run test:watch
```

#### Generate Coverage Report
```bash
cd backend
npm run test:coverage
```

Coverage reports are generated in `backend/coverage/` and include:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Test Structure

```
backend/src/__tests__/
├── setup.ts                    # Test configuration
├── mocks.ts                    # Mock utilities and helpers
├── services/                   # Service unit tests
│   ├── sprintServices.test.ts
│   ├── standupServices.test.ts
│   └── blockerServices.test.ts
├── routes/                     # Integration tests
│   ├── sprints.test.ts
│   └── standups.test.ts
└── validation/                 # Middleware tests
    └── middleware.test.ts
```

### Test Coverage

- **Services**: Unit tests for all business logic
- **Controllers**: Integration tests for API endpoints
- **Validation**: Tests for Zod schemas and middleware
- **Error Handling**: Tests for error cases and edge conditions

### CI/CD Testing

Tests automatically run in the CI/CD pipeline:
- On every push to `main` or `develop` branches
- On all pull requests
- Before building Docker images
- Before deployment

The pipeline will fail if:
- Any test fails
- Code coverage drops below thresholds
- Linting errors are detected

## 🔄 Deployment Guide

### Prerequisites Checklist
- [ ] All environment variables configured for production
- [ ] Database migrations run successfully
- [ ] JWT secrets are strong (32+ characters)
- [ ] Google OAuth configured for production domain
- [ ] Redis/Upstash configured
- [ ] Google Gemini API key valid
- [ ] SSL/TLS certificates ready
- [ ] CORS configured for production URLs

### Backend Deployment

#### Option 1: Railway (Recommended)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add

# 5. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret
railway variables set DATABASE_URL=your_db_url

# 6. Deploy
railway up
```

#### Option 2: Render
```yaml
# render.yaml
services:
  - type: web
    name: ai-scrum-backend
    env: node
    buildCommand: cd backend && npm install && npx prisma generate && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

#### Option 3: Docker + AWS/GCP/Azure
```bash
# Build Docker image
docker build -t ai-scrum-backend ./backend

# Tag for registry
docker tag ai-scrum-backend your-registry/ai-scrum-backend:latest

# Push to registry
docker push your-registry/ai-scrum-backend:latest

# Deploy to cloud (example: AWS ECS, GCP Cloud Run, Azure Container Apps)
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy from root
cd frontend/frontend
vercel

# 4. Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_GOOGLE_CLIENT_ID

# 5. Deploy to production
vercel --prod
```

#### Option 2: Netlify
```toml
# netlify.toml
[build]
  base = "frontend/frontend"
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

#### Option 3: Docker
```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/frontend/package*.json ./
RUN npm ci
COPY frontend/frontend .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Deployment

#### Option 1: Neon (Recommended - Serverless PostgreSQL)
```bash
# 1. Create database at https://neon.tech
# 2. Copy connection string
# 3. Set environment variable
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"

# 4. Run migrations
npx prisma migrate deploy
```

#### Option 2: Supabase
```bash
# 1. Create project at https://supabase.com
# 2. Get connection string from Settings > Database
# 3. Enable connection pooling (recommended)
DATABASE_URL="postgresql://postgres.xxx:pass@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

#### Option 3: AWS RDS / GCP Cloud SQL / Azure Database
- Create managed PostgreSQL instance
- Enable SSL connections
- Configure security groups/firewall
- Use connection string with SSL mode

### Redis Deployment

#### Option 1: Upstash (Recommended - Serverless Redis)
```bash
# 1. Create database at https://upstash.com
# 2. Copy REST URL and token
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"
```

#### Option 2: Redis Cloud
```bash
# 1. Create database at https://redis.com/cloud
# 2. Get connection string
REDIS_URL="redis://default:pass@redis-12345.cloud.redislabs.com:12345"
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      # Backend tests
      - name: Test Backend
        run: |
          cd backend
          npm ci
          npm test
      
      # Frontend tests (if configured)
      - name: Test Frontend
        run: |
          cd frontend/frontend
          npm ci
          npm run build
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Deploy to Railway/Render/Fly.io
      - name: Deploy Backend
        run: |
          # Your deployment command
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Deploy to Vercel
      - name: Deploy Frontend
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Production Environment Variables

#### Backend (.env.production)
```bash
NODE_ENV=production
PORT=5000

# Database (with SSL)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Redis
REDIS_URL="rediss://default:pass@redis.provider.com:6380"
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# JWT (strong secrets!)
JWT_SECRET="production_secret_minimum_32_chars"
JWT_REFRESH_SECRET="production_refresh_secret_minimum_32_chars"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Session
SESSION_SECRET="production_session_secret"

# Google OAuth (production URLs)
GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_client_secret"
GOOGLE_CALLBACK_URL="https://api.yourdomain.com/api/auth/google/callback"

# AI Services
GEMINI_API_KEY="your_gemini_key"

# Optional
PINECONE_API_KEY="your_pinecone_key"
PINECONE_INDEX_NAME="ai-scrum-master"

# CORS
FRONTEND_URL="https://yourdomain.com"
```

#### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database migrations applied
- [ ] SSL/TLS certificates active
- [ ] CORS configured for production domain
- [ ] Google OAuth callback URLs updated
- [ ] API endpoints responding correctly
- [ ] Frontend can communicate with backend
- [ ] Authentication flow works end-to-end
- [ ] AI features functioning (if configured)
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Security headers enabled

### Monitoring & Logging

#### Backend Logging
```typescript
// Use structured logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

logger.info('Sprint created', { sprintId: sprint.id, userId: user.id })
```

#### Monitoring Services
- **Sentry**: Error tracking for frontend and backend
- **LogRocket**: Session replay for frontend debugging
- **DataDog/New Relic**: APM for backend performance
- **Uptime Robot**: Uptime monitoring

### Performance Optimization

#### Backend
```typescript
// Enable compression
import compression from 'compression'
app.use(compression())

// Enable caching
import apicache from 'apicache'
app.use('/api/sprints', apicache.middleware('5 minutes'))

// Database connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10'
    }
  }
})
```

#### Frontend
```typescript
// Enable SWC minification
// next.config.ts
export default {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

// Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

## 🔄 Deployment Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Use production database URL
- [ ] Configure CORS for production frontend URL
- [ ] Enable SSL/TLS for database connections
- [ ] Set SESSION_SECRET to secure random value
- [ ] Configure production Redis (Upstash recommended)

### Frontend
- [ ] Update NEXT_PUBLIC_API_URL to production API
- [ ] Update GOOGLE_CALLBACK_URL to production domain
- [ ] Build with `npm run build`
- [ ] Test production build locally with `npm start`
- [ ] Enable security headers in next.config.ts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Support

For issues or questions:
1. Check this README
2. Check the GitHub Issues
3. Review the code comments
4. Check backend/frontend console logs
