import { PrismaClient } from '@prisma/client'
import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/orders - Create new order
router.post('/', authenticate, async (req: any, res) => {
  try {
    const { items, shippingAddress, notes } = req.body
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' })
    }

    // Calculate total
    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productId} not found` })
      }
      totalAmount += product.price * item.quantity
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        totalAmount,
        status: 'PENDING',
        shippingAddress,
        notes,
        items: {
          createMany: {
            data: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      },
      include: { items: { include: { product: true } } }
    })

    res.status(201).json({ success: true, data: order })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/orders - Get user's orders
router.get('/', authenticate, async (req: any, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const where: any = { userId: req.user.userId }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ])

    res.json({ success: true, data: orders, total, totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/orders/:id - Get specific order
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    // Verify ownership
    if (order.userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    res.json({ success: true, data: order })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', authenticate, async (req: any, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ success: false, error: 'Only pending orders can be cancelled' })
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      include: { items: { include: { product: true } } }
    })

    res.json({ success: true, data: updated })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
