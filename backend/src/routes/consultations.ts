import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'
import { io } from '../index'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/consultations/initiate
router.post('/initiate', authenticate, async (req: any, res) => {
  try {
    const { panditId, type } = req.body
    const userId = req.user.userId

    const pandit = await prisma.pandit.findUnique({ where: { id: panditId } })
    if (!pandit) return res.status(404).json({ success: false, error: 'Pandit not found' })
    if (!pandit.isOnline) return res.status(400).json({ success: false, error: 'Pandit is offline' })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const rate = type === 'CALL' ? pandit.callRate : type === 'CHAT' ? pandit.chatRate : pandit.videoRate
    if (user.walletBalance < rate * 5) {
      return res.status(400).json({ success: false, error: 'Insufficient wallet balance. Add at least ₹' + (rate * 5) })
    }

    const roomId = `room_${userId}_${panditId}_${Date.now()}`

    const consultation = await prisma.consultation.create({
      data: { userId, panditId, type, status: 'PENDING', roomId },
      include: { pandit: { include: { user: true } }, user: true }
    })

    // Notify pandit via socket
    io.to(`pandit_${panditId}`).emit('incoming_consultation', {
      consultationId: consultation.id,
      type, roomId,
      user: { name: user.name, avatar: user.avatar }
    })

    res.json({ success: true, data: { consultation, roomId } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/consultations/:id/accept (pandit accepts)
router.put('/:id/accept', authenticate, async (req: any, res) => {
  try {
    const consultation = await prisma.consultation.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE', startedAt: new Date() },
      include: { user: true, pandit: { include: { user: true } } }
    })

    io.to(`user_${consultation.userId}`).emit('consultation_accepted', {
      consultationId: consultation.id,
      roomId: consultation.roomId
    })

    res.json({ success: true, data: consultation })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/consultations/:id/end
router.put('/:id/end', authenticate, async (req: any, res) => {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id: req.params.id },
      include: { pandit: true, user: true }
    })
    if (!consultation) return res.status(404).json({ success: false, error: 'Not found' })

    const endedAt = new Date()
    const durationSeconds = consultation.startedAt
      ? Math.floor((endedAt.getTime() - consultation.startedAt.getTime()) / 1000)
      : 0
    const durationMinutes = durationSeconds / 60

    const rate = consultation.type === 'CALL' ? consultation.pandit.callRate
      : consultation.type === 'CHAT' ? consultation.pandit.chatRate
      : consultation.pandit.videoRate

    const amount = Math.ceil(durationMinutes * rate)
    const platformFee = amount * 0.25 // 25% platform cut
    const panditEarning = amount - platformFee

    // Deduct from user wallet
    await prisma.user.update({
      where: { id: consultation.userId },
      data: { walletBalance: { decrement: amount } }
    })

    // Credit pandit wallet
    await prisma.pandit.update({
      where: { id: consultation.panditId },
      data: {
        walletBalance: { increment: panditEarning },
        totalEarnings: { increment: panditEarning },
        totalConsultations: { increment: 1 }
      }
    })

    // Log wallet transactions
    await prisma.walletTransaction.createMany({
      data: [
        {
          userId: consultation.userId,
          type: 'debit',
          amount,
          description: `${consultation.type} consultation with pandit for ${Math.ceil(durationMinutes)} mins`,
          consultationId: consultation.id
        }
      ]
    })

    const updated = await prisma.consultation.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED', endedAt, duration: durationSeconds, amount }
    })

    // Notify both parties
    io.to(consultation.roomId!).emit('consultation_ended', { consultationId: consultation.id, amount, duration: durationSeconds })

    res.json({ success: true, data: { ...updated, amount, duration: durationSeconds } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/consultations/:id/rate
router.post('/:id/rate', authenticate, async (req: any, res) => {
  try {
    const { rating, review } = req.body
    const consultation = await prisma.consultation.update({
      where: { id: req.params.id },
      data: { rating, review }
    })

    // Create review record
    await prisma.review.create({
      data: {
        userId: req.user.userId,
        panditId: consultation.panditId,
        rating, comment: review || ''
      }
    })

    // Recalculate pandit rating
    const reviews = await prisma.review.findMany({ where: { panditId: consultation.panditId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.pandit.update({
      where: { id: consultation.panditId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length }
    })

    res.json({ success: true, data: consultation })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/consultations/history
router.get('/history', authenticate, async (req: any, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { userId: req.user.userId },
      include: { pandit: { include: { user: { select: { name: true, avatar: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    res.json({ success: true, data: consultations })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/consultations/:id/messages
router.get('/:id/messages', authenticate, async (req: any, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { consultationId: req.params.id },
      orderBy: { createdAt: 'asc' }
    })
    res.json({ success: true, data: messages })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/consultations/:id/messages
router.post('/:id/messages', authenticate, async (req: any, res) => {
  try {
    const { message } = req.body
    const msg = await prisma.message.create({
      data: { consultationId: req.params.id, senderId: req.user.userId, message }
    })

    // Broadcast via socket
    const consultation = await prisma.consultation.findUnique({ where: { id: req.params.id } })
    if (consultation?.roomId) {
      io.to(consultation.roomId).emit('new_message', msg)
    }

    res.json({ success: true, data: msg })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
