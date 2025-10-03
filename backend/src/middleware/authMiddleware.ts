import type { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { JWTService } from '../services/jwtService.js'

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