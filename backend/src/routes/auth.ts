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
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`)
  }
)

// Get current user
router.get('/me', authMiddleware, AuthController.me)

// Legacy Google URL endpoint (for compatibility)
router.get('/google/url', AuthController.googleUrl)
router.post('/google/callback', AuthController.googleCallback)

export default router