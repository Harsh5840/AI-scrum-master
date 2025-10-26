import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { JWTService } from '../services/jwtService.js'
import { GoogleOAuthService } from '../services/googleOAuthService.js'

const prisma = new PrismaClient()
const googleOAuth = new GoogleOAuthService()

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

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
      console.error('Login error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' })
      }

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
      console.error('Register error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async googleUrl(req: Request, res: Response) {
    try {
      const url = googleOAuth.generateAuthUrl()
      res.json({ url })
    } catch (error) {
      console.error('Google URL error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.body

      if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' })
      }

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
            avatar: userInfo.avatar || null
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
      console.error('Google callback error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' })
      }

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
      console.error('Refresh token error:', error)
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
      console.error('Get user error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body || {}
      
      if (refreshToken) {
        await JWTService.removeRefreshToken(refreshToken)
      }

      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}