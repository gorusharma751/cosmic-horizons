import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { sendSMS } from '../services/sms'

const prisma = new PrismaClient()

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'cosmic-secret-key', { expiresIn: '7d' })
}

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// POST /api/auth/send-otp
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { phone } })
    const isNewUser = !user

    if (!user) {
      // Create temp user
      user = await prisma.user.create({
        data: { phone, name: '', role: 'USER' }
      })
    }

    // Generate OTP
    const otp = phone === '1234567890' ? '1234' : (process.env.NODE_ENV === 'production' ? generateOTP() : '123456') // Dev: fixed OTP

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate old OTPs
    await prisma.oTP.updateMany({
      where: { phone, isUsed: false },
      data: { isUsed: true }
    })

    // Save new OTP
    await prisma.oTP.create({
      data: { userId: user.id, phone, otp, expiresAt }
    })

    // Send SMS in production
    if (process.env.NODE_ENV === 'production' && phone !== '1234567890') {
      await sendSMS(phone, `Your Cosmic Horizons OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`)
    }

    res.json({
      success: true,
      isNewUser,
      message: process.env.NODE_ENV === 'production' ? 'OTP sent successfully' : `OTP: ${otp} (dev mode)`
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// POST /api/auth/verify-otp
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body

    const otpRecord = await prisma.oTP.findFirst({
      where: { phone, otp, isUsed: false, expiresAt: { gt: new Date() } },
      include: { user: true }
    })

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' })
    }

    // Mark OTP as used
    await prisma.oTP.update({ where: { id: otpRecord.id }, data: { isUsed: true } })

    const user = otpRecord.user
    const isNewUser = !user.name

    if (!isNewUser) {
      // Existing user - return token
      const token = generateToken(user.id, user.role)
      return res.json({
        success: true,
        isNewUser: false,
        token,
        user: {
          id: user.id, name: user.name, phone: user.phone,
          email: user.email, role: user.role, walletBalance: user.walletBalance,
          avatar: user.avatar, isVerified: user.isVerified
        }
      })
    }

    // New user - needs registration
    res.json({ success: true, isNewUser: true, phone, message: 'OTP verified. Complete registration.' })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { phone, name, email } = req.body

    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) return res.status(404).json({ success: false, error: 'Phone not verified' })

    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } })
      if (emailExists && emailExists.id !== user.id) {
        return res.status(400).json({ success: false, error: 'Email already registered' })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, email: email || undefined, isVerified: true }
    })

    const token = generateToken(updatedUser.id, updatedUser.role)

    res.json({
      success: true,
      token,
      user: {
        id: updatedUser.id, name: updatedUser.name, phone: updatedUser.phone,
        email: updatedUser.email, role: updatedUser.role,
        walletBalance: updatedUser.walletBalance, isVerified: true
      }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// GET /api/auth/profile
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, name: true, phone: true, email: true, avatar: true,
        role: true, walletBalance: true, dateOfBirth: true, timeOfBirth: true,
        placeOfBirth: true, zodiacSign: true, language: true, isVerified: true,
        createdAt: true
      }
    })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: user })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// PUT /api/auth/profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, dateOfBirth, timeOfBirth, placeOfBirth, zodiacSign, language } = req.body
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, email, dateOfBirth, timeOfBirth, placeOfBirth, zodiacSign, language },
      select: {
        id: true, name: true, phone: true, email: true,
        role: true, walletBalance: true, zodiacSign: true, language: true
      }
    })
    res.json({ success: true, data: user })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// POST /api/auth/logout
export const logout = async (req: any, res: Response) => {
  try {
    // Clear FCM token
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { fcmToken: null }
    })
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
