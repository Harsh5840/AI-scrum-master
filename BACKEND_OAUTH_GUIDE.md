# Backend OAuth Implementation Guide

This document outlines the required backend endpoints and configuration for implementing JWT authentication with Google OAuth in your AI Scrum Master backend.

## Required Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Required Dependencies

Install these packages in your backend:

```bash
npm install jsonwebtoken passport passport-google-oauth20 bcryptjs cookie-parser cors
npm install --save-dev @types/jsonwebtoken @types/passport @types/passport-google-oauth20 @types/bcryptjs @types/cookie-parser
```

## Database Schema Updates

Update your Prisma schema to include refresh tokens:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  name         String
  password     String?  // Optional for OAuth users
  googleId     String?  @unique
  avatar       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relationships
  standups     Standup[]
  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

## Required Backend Endpoints

### 1. Authentication Routes (`/auth`)

#### POST `/auth/login`
```typescript
// Request Body
{
  email: string
  password: string
}

// Response
{
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
  token: string
  refreshToken: string
}
```

#### POST `/auth/register`
```typescript
// Request Body
{
  name: string
  email: string
  password: string
}

// Response
{
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
  token: string
  refreshToken: string
}
```

#### GET `/auth/google/url`
```typescript
// Response
{
  url: string // Google OAuth authorization URL
}
```

#### POST `/auth/google/callback`
```typescript
// Request Body
{
  code: string
  state?: string
}

// Response
{
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
  token: string
  refreshToken: string
}
```

#### POST `/auth/refresh`
```typescript
// Request Body
{
  refreshToken: string
}

// Response
{
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
  token: string
  refreshToken: string
}
```

#### GET `/auth/me`
```typescript
// Headers: Authorization: Bearer <token>

// Response
{
  id: number
  name: string
  email: string
  createdAt: string
}
```

#### POST `/auth/logout`
```typescript
// Headers: Authorization: Bearer <token>
// Request Body
{
  refreshToken?: string
}

// Response: 200 OK
```

## Implementation Example

### 1. JWT Service (`services/jwtService.ts`)

```typescript
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface JWTPayload {
  userId: number
  email: string
}

export class JWTService {
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })
  }

  static generateRefreshToken(): string {
    return jwt.sign({}, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    })
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
  }

  static async saveRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    })
  }

  static async removeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token }
    })
  }

  static async validateRefreshToken(token: string): Promise<number | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null
    }

    return refreshToken.userId
  }
}
```

### 2. Google OAuth Service (`services/googleOAuthService.ts`)

```typescript
import { google } from 'googleapis'

export class GoogleOAuthService {
  private oauth2Client

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      state: 'some-random-state' // Add CSRF protection
    })
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    return tokens
  }

  async getUserInfo(accessToken: string) {
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: this.oauth2Client
    })

    this.oauth2Client.setCredentials({ access_token: accessToken })
    const { data } = await oauth2.userinfo.get()
    
    return {
      googleId: data.id!,
      email: data.email!,
      name: data.name!,
      avatar: data.picture
    }
  }
}
```

### 3. Auth Controller (`controllers/authController.ts`)

```typescript
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { JWTService } from '../services/jwtService'
import { GoogleOAuthService } from '../services/googleOAuthService'

const prisma = new PrismaClient()
const googleOAuth = new GoogleOAuthService()

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const accessToken = JWTService.generateAccessToken({
        userId: user.id,
        email: user.email
      })

      const refreshToken = JWTService.generateRefreshToken()
      await JWTService.saveRefreshToken(user.id, refreshToken)

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString()
        },
        token: accessToken,
        refreshToken
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      const accessToken = JWTService.generateAccessToken({
        userId: user.id,
        email: user.email
      })

      const refreshToken = JWTService.generateRefreshToken()
      await JWTService.saveRefreshToken(user.id, refreshToken)

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString()
        },
        token: accessToken,
        refreshToken
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async googleUrl(req: Request, res: Response) {
    try {
      const url = googleOAuth.generateAuthUrl()
      res.json({ url })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.body

      const tokens = await googleOAuth.getTokens(code)
      const userInfo = await googleOAuth.getUserInfo(tokens.access_token!)

      let user = await prisma.user.findUnique({
        where: { email: userInfo.email }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userInfo.name,
            email: userInfo.email,
            googleId: userInfo.googleId,
            avatar: userInfo.avatar
          }
        })
      } else if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: userInfo.googleId }
        })
      }

      const accessToken = JWTService.generateAccessToken({
        userId: user.id,
        email: user.email
      })

      const refreshToken = JWTService.generateRefreshToken()
      await JWTService.saveRefreshToken(user.id, refreshToken)

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString()
        },
        token: accessToken,
        refreshToken
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      const userId = await JWTService.validateRefreshToken(refreshToken)
      if (!userId) {
        return res.status(401).json({ message: 'Invalid refresh token' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      // Remove old refresh token
      await JWTService.removeRefreshToken(refreshToken)

      // Generate new tokens
      const accessToken = JWTService.generateAccessToken({
        userId: user.id,
        email: user.email
      })

      const newRefreshToken = JWTService.generateRefreshToken()
      await JWTService.saveRefreshToken(user.id, newRefreshToken)

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString()
        },
        token: accessToken,
        refreshToken: newRefreshToken
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const user = (req as any).user // Set by auth middleware
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body
      
      if (refreshToken) {
        await JWTService.removeRefreshToken(refreshToken)
      }

      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
```

### 4. Auth Middleware (`middleware/authMiddleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { JWTService } from '../services/jwtService'

const prisma = new PrismaClient()

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const payload = JWTService.verifyAccessToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    ;(req as any).user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
```

### 5. Auth Routes (`routes/auth.ts`)

```typescript
import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.get('/google/url', AuthController.googleUrl)
router.post('/google/callback', AuthController.googleCallback)
router.post('/refresh', AuthController.refresh)
router.get('/me', authMiddleware, AuthController.me)
router.post('/logout', AuthController.logout)

export default router
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

## CORS Configuration

Update your CORS configuration to allow credentials:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

## Testing the Integration

1. Start your backend server
2. Update the frontend `NEXT_PUBLIC_API_URL` in `.env.local`
3. Test regular login/signup
4. Test Google OAuth flow
5. Verify JWT tokens are working with protected routes

## Security Notes

1. Use strong, unique secrets for JWT signing
2. Implement rate limiting on auth endpoints
3. Add CSRF protection for OAuth state parameter
4. Use HTTPS in production
5. Regularly rotate JWT secrets
6. Implement proper password validation rules
7. Add account lockout after failed attempts
8. Log authentication events for monitoring