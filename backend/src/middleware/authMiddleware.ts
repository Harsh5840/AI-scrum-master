import type { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { JWTService } from '../services/jwtService.js'

const prisma = new PrismaClient()

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('🔐 Auth Middleware - Checking authentication...');
    console.log('  - Session authenticated:', req.isAuthenticated?.());
    console.log('  - Auth header:', req.headers.authorization ? 'Present' : 'Missing');
    
    // Check if user is authenticated via Passport session (Google OAuth or session-based)
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      console.log('✅ Authenticated via Passport session');
      return next()
    }

    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return res.status(401).json({ message: 'Authentication required. Please log in.' })
    }

    const token = authHeader.substring(7)
    console.log('🔑 Verifying JWT token...');
    const payload = JWTService.verifyAccessToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ message: 'User not found' })
    }

    console.log('✅ Authenticated via JWT token - User:', user.email);
    ;(req as any).user = user
    next()
  } catch (error) {
    console.log('❌ Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' })
  }
}