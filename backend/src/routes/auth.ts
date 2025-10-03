import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.get('/google/url', AuthController.googleUrl)
router.post('/google/callback', AuthController.googleCallback)
router.post('/refresh', AuthController.refresh)
router.get('/me', authMiddleware, AuthController.me)
router.post('/logout', AuthController.logout)

export default router