import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
})

// POST /api/payments/create-order
router.post('/create-order', authenticate, async (req: any, res) => {
  try {
    const { amount, type } = req.body // amount in INR

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { type, userId: req.user.userId }
    })

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/payments/verify
router.post('/verify', authenticate, async (req: any, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, type } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' })
    }

    // Credit wallet
    if (type === 'wallet') {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { walletBalance: { increment: amount } }
      })

      await prisma.walletTransaction.create({
        data: {
          userId: req.user.userId,
          type: 'credit',
          amount,
          description: 'Wallet recharge via Razorpay',
          paymentId: razorpay_payment_id
        }
      })
    }

    res.json({ success: true, message: 'Payment verified successfully' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/payments/wallet/add
router.post('/wallet/add', authenticate, async (req: any, res) => {
  try {
    const { amount } = req.body
    if (amount < 100) return res.status(400).json({ success: false, error: 'Minimum recharge ₹100' })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `wallet_${Date.now()}`,
      notes: { type: 'wallet', userId: req.user.userId }
    })

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/payments/transactions
router.get('/transactions', authenticate, async (req: any, res) => {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { walletBalance: true }
    })
    res.json({ success: true, data: { transactions, balance: user?.walletBalance || 0 } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
