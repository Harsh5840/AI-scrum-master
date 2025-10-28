# AI Scrum Master

An AI-powered agile project management tool that helps teams manage sprints, track standups, identify blockers, and get intelligent insights.

## 🚀 Features

- **Sprint Management**: Create and track sprints with start/end dates
- **Daily Standups**: Log daily standup updates for team members
- **Blocker Tracking**: Identify and manage blockers with severity levels
- **AI Insights**: Get AI-powered recommendations and risk assessments
- **Workflows**: Automate tasks with AI-powered background jobs
- **Analytics**: Track team velocity, burndown charts, and performance metrics
- **Google OAuth**: Sign in with Google or use email/password authentication

## 📋 Workflows Explained

### What are Workflows?

Workflows are automated AI-powered background processes that run asynchronously to provide intelligent insights and automate tasks:

1. **Sprint Analysis**: Analyzes sprint progress and predicts completion likelihood
2. **Risk Detection**: Scans standups and blockers to identify project risks
3. **Task Prioritization**: Uses AI to suggest which tasks should be tackled first
4. **Team Productivity**: Analyzes team patterns and suggests improvements
5. **Blocker Resolution**: Suggests solutions for common blockers using RAG (Retrieval-Augmented Generation)

### How Workflows Work

```
User Action → Queue Job → Background Worker → AI Processing → Store Results → Display Insights
```

- Jobs are queued using **Bull** (Redis-based queue)
- Workers process jobs in the background
- Results are stored in **PostgreSQL** database
- Frontend displays insights via **RTK Query**

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

1. **User Registration**: POST `/api/auth/register` with name, email, password
2. **Login**: POST `/api/auth/login` → Returns JWT access token + refresh token
3. **Google OAuth**: GET `/api/auth/google` → Redirects to Google → Callback to `/api/auth/google/callback`
4. **Protected Routes**: Include `Authorization: Bearer {token}` header
5. **Token Refresh**: POST `/api/auth/refresh` with refresh token

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

## 📝 Development Tips

1. **Use the debug logs**: Both frontend and backend have console.log statements for debugging
2. **Check Network tab**: F12 → Network tab shows all API requests and responses
3. **Restart after .env changes**: Environment variables only load on server start
4. **Clear Next.js cache**: Delete `.next` folder if frontend behaves strangely
5. **Check database**: Use Prisma Studio (`npx prisma studio`) to view/edit data

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
