// ===== panditDash.ts =====
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requirePandit } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate, requirePandit)

router.get('/profile', async (req: any, res) => {
  try {
    const pandit = await prisma.pandit.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { name: true, phone: true, email: true, avatar: true } } }
    })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.put('/profile', async (req: any, res) => {
  try {
    const pandit = await prisma.pandit.update({
      where: { userId: req.user.userId },
      data: req.body
    })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.put('/availability', async (req: any, res) => {
  try {
    const { isOnline } = req.body
    const pandit = await prisma.pandit.update({
      where: { userId: req.user.userId },
      data: { isOnline }
    })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/consultations', async (req: any, res) => {
  try {
    const pandit = await prisma.pandit.findUnique({ where: { userId: req.user.userId } })
    if (!pandit) return res.status(404).json({ success: false, error: 'Pandit not found' })

    const consultations = await prisma.consultation.findMany({
      where: { panditId: pandit.id },
      include: { user: { select: { name: true, phone: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }, take: 50
    })
    res.json({ success: true, data: consultations })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/earnings', async (req: any, res) => {
  try {
    const pandit = await prisma.pandit.findUnique({ where: { userId: req.user.userId } })
    if (!pandit) return res.status(404).json({ success: false, error: 'Pandit not found' })

    const today = new Date(); today.setHours(0, 0, 0, 0)
    const todayEarnings = await prisma.consultation.aggregate({
      where: { panditId: pandit.id, status: 'COMPLETED', createdAt: { gte: today } },
      _sum: { amount: true }, _count: true
    })

    res.json({
      success: true,
      data: {
        todayEarnings: (todayEarnings._sum.amount || 0) * 0.75,
        todayConsultations: todayEarnings._count,
        totalEarnings: pandit.totalEarnings,
        walletBalance: pandit.walletBalance
      }
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/live/start', async (req: any, res) => {
  try {
    const { title, topic } = req.body
    const pandit = await prisma.pandit.update({
      where: { userId: req.user.userId },
      data: { isLive: true, liveStreamTitle: title, liveStreamTopic: topic, liveViewerCount: 0 }
    })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.put('/live/end', async (req: any, res) => {
  try {
    const pandit = await prisma.pandit.update({
      where: { userId: req.user.userId },
      data: { isLive: false, liveViewerCount: 0, liveStreamTitle: null }
    })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
