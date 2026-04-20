import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin)

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers, totalPandits, todayConsultations, todayRevenue,
      pendingPandits, totalOrders, activeConsultations, liveStreams
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.pandit.count({ where: { isApproved: true } }),
      prisma.consultation.count({ where: { createdAt: { gte: today }, status: 'COMPLETED' } }),
      prisma.consultation.aggregate({ where: { createdAt: { gte: today }, status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.pandit.count({ where: { isApproved: false } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.consultation.count({ where: { status: 'ACTIVE' } }),
      prisma.pandit.count({ where: { isLive: true } }),
    ])

    res.json({
      success: true,
      data: {
        totalUsers, totalPandits,
        todayConsultations,
        todayRevenue: todayRevenue._sum.amount || 0,
        pendingPandits, totalOrders,
        activeConsultations, liveStreams
      }
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query
    const where: any = {}
    if (role) where.role = role
    if (search) where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string } },
      { email: { contains: search as string, mode: 'insensitive' } }
    ]

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip: (Number(page) - 1) * Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, phone: true, email: true, role: true, walletBalance: true, isVerified: true, createdAt: true }
      }),
      prisma.user.count({ where })
    ])

    res.json({ success: true, data: users, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/admin/pandits
router.get('/pandits', async (req, res) => {
  try {
    const { page = 1, limit = 20, approved } = req.query
    const where: any = {}
    if (approved !== undefined) where.isApproved = approved === 'true'

    const [pandits, total] = await Promise.all([
      prisma.pandit.findMany({
        where, skip: (Number(page) - 1) * Number(limit), take: Number(limit),
        include: { user: { select: { name: true, phone: true, email: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pandit.count({ where })
    ])

    res.json({ success: true, data: pandits, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/admin/pandits/:id/approve
router.put('/pandits/:id/approve', async (req, res) => {
  try {
    const pandit = await prisma.pandit.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    })
    // Update user role to PANDIT
    await prisma.user.update({ where: { id: pandit.userId }, data: { role: 'PANDIT' } })
    res.json({ success: true, data: pandit, message: 'Pandit approved successfully' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/admin/consultations
router.get('/consultations', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where, skip: (Number(page) - 1) * Number(limit), take: Number(limit),
        include: {
          user: { select: { name: true, phone: true } },
          pandit: { include: { user: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.consultation.count({ where })
    ])

    res.json({ success: true, data: consultations, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const where: any = {}
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip: (Number(page) - 1) * Number(limit), take: Number(limit),
        include: {
          user: { select: { name: true, phone: true } },
          items: { include: { product: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ])

    res.json({ success: true, data: orders, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingId } = req.body
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, trackingId }
    })
    res.json({ success: true, data: order })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/admin/revenue
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'week' } = req.query
    const now = new Date()
    const startDate = new Date()

    if (period === 'today') startDate.setHours(0, 0, 0, 0)
    else if (period === 'week') startDate.setDate(now.getDate() - 7)
    else if (period === 'month') startDate.setMonth(now.getMonth() - 1)
    else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1)

    const [consultationRevenue, orderRevenue, transactions] = await Promise.all([
      prisma.consultation.aggregate({
        where: { createdAt: { gte: startDate }, status: 'COMPLETED' },
        _sum: { amount: true }, _count: true
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true }, _count: true
      }),
      prisma.walletTransaction.findMany({
        where: { createdAt: { gte: startDate }, type: 'credit' },
        orderBy: { createdAt: 'asc' }
      })
    ])

    res.json({
      success: true,
      data: {
        consultationRevenue: consultationRevenue._sum.amount || 0,
        consultationCount: consultationRevenue._count,
        orderRevenue: orderRevenue._sum.totalAmount || 0,
        orderCount: orderRevenue._count,
        totalRevenue: (consultationRevenue._sum.amount || 0) + (orderRevenue._sum.totalAmount || 0),
        transactions
      }
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body })
    res.json({ success: true, data: product })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body })
    res.json({ success: true, data: product })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Product deleted' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
