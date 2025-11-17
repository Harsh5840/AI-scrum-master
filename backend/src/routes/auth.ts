import { Router } from 'express'
import passport from 'passport'
import { AuthController } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

// Traditional email/password auth
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/refresh', AuthController.refresh)
router.post('/logout', AuthController.logout)

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Successful authentication, generate token and redirect to frontend callback
    const user = req.user as any
    
    // Import JWTService
    const { JWTService } = await import('../services/jwtService.js')
    
    const accessToken = JWTService.generateAccessToken({
      userId: user.id,
      email: user.email
    })
    
    const refreshToken = JWTService.generateRefreshToken()
    await JWTService.saveRefreshToken(user.id, refreshToken)
    
    // Redirect to frontend callback with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`)
  }
)

// Get current user
router.get('/me', authMiddleware, AuthController.me)

// Legacy Google URL endpoint (for compatibility)
router.get('/google/url', AuthController.googleUrl)
router.post('/google/callback', AuthController.googleCallback)

export default router