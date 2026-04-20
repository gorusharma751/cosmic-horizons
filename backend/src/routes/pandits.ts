import { PrismaClient } from '@prisma/client'
import express from 'express'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/pandits/featured
router.get('/featured', async (req, res) => {
  try {
    const pandits = await prisma.pandit.findMany({
      where: { isApproved: true, rating: { gte: 4.5 } },
      orderBy: { totalConsultations: 'desc' },
      take: 8,
      include: { user: { select: { name: true, avatar: true } } }
    })
    res.json({ success: true, data: pandits })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits/online
router.get('/online', async (req, res) => {
  try {
    const pandits = await prisma.pandit.findMany({
      where: { isApproved: true, isOnline: true },
      orderBy: { rating: 'desc' },
      include: { user: { select: { name: true, avatar: true } } }
    })
    res.json({ success: true, data: pandits })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits/live-streams
router.get('/live-streams', async (req, res) => {
  try {
    const pandits = await prisma.pandit.findMany({
      where: { isApproved: true, isLive: true },
      include: { user: { select: { name: true, avatar: true } } }
    })
    res.json({ success: true, data: pandits })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ success: true, data: [] })

    const pandits = await prisma.pandit.findMany({
      where: {
        isApproved: true,
        OR: [
          { user: { name: { contains: q as string, mode: 'insensitive' } } },
          { expertise: { has: q as string } },
          { bio: { contains: q as string, mode: 'insensitive' } }
        ]
      },
      include: { user: { select: { name: true, avatar: true } } },
      take: 20
    })
    res.json({ success: true, data: pandits })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits - All pandits with filters
router.get('/', async (req, res) => {
  try {
    const { expertise, language, minRating, sort, page = 1, limit = 20 } = req.query

    const where: any = { isApproved: true }
    if (expertise) where.expertise = { has: expertise as string }
    if (language) where.languages = { has: language as string }
    if (minRating) where.rating = { gte: parseFloat(minRating as string) }

    let orderBy: any = { totalConsultations: 'desc' }
    if (sort === 'rating') orderBy = { rating: 'desc' }
    if (sort === 'price_low') orderBy = { callRate: 'asc' }
    if (sort === 'experience') orderBy = { experience: 'desc' }
    if (sort === 'online') orderBy = [{ isOnline: 'desc' }, { rating: 'desc' }]

    const [pandits, total] = await Promise.all([
      prisma.pandit.findMany({
        where, orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { user: { select: { name: true, avatar: true } } }
      }),
      prisma.pandit.count({ where })
    ])

    res.json({ success: true, data: pandits, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits/:id
router.get('/:id', async (req, res) => {
  try {
    const pandit = await prisma.pandit.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, avatar: true, createdAt: true } },
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
    if (!pandit) return res.status(404).json({ success: false, error: 'Pandit not found' })
    res.json({ success: true, data: pandit })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pandits/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { panditId: req.params.id },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    res.json({ success: true, data: reviews })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
