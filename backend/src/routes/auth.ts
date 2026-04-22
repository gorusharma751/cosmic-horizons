import express from 'express'
import { body } from 'express-validator'
import { sendOTP, verifyOTP, register, getProfile, updateProfile, logout } from '../controllers/auth'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = express.Router()

// Send OTP
router.post('/send-otp',
  [body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit mobile number required')],
  validate,
  sendOTP
)

// Verify OTP
router.post('/verify-otp',
  [
    body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone required'),
    body('otp').isLength({ min: 4, max: 6 }).withMessage('4-6 digit OTP required'),
  ],
  validate,
  verifyOTP
)

// Register
router.post('/register',
  [
    body('phone').matches(/^\d{10}$/),
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').optional().isEmail(),
  ],
  validate,
  register
)

// Protected routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)
router.post('/logout', authenticate, logout)

export default router
