// pooja.ts
import { PrismaClient } from '@prisma/client'
import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/pooja - All active pooja services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.poojaService.findMany({ where: { isActive: true } })
    res.json({ success: true, data: services })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pooja/bookings - User's pooja bookings
router.get('/bookings', authenticate, async (req: any, res) => {
  try {
    const bookings = await prisma.poojaBooking.findMany({
      where: { userId: req.user.userId },
      include: { service: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: bookings })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/pooja/book - Book a pooja service
router.post('/book', authenticate, async (req: any, res) => {
  try {
    const { serviceId, scheduledDate, notes, paymentId } = req.body
    const service = await prisma.poojaService.findUnique({ where: { id: serviceId } })
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' })

    const booking = await prisma.poojaBooking.create({
      data: {
        userId: req.user.userId, serviceId,
        scheduledDate: new Date(scheduledDate),
        amount: service.price, notes, status: paymentId ? 'confirmed' : 'pending'
      },
      include: { service: true }
    })
    res.json({ success: true, data: booking })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/pooja/:id - Get specific pooja service
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.poojaService.findUnique({ where: { id: req.params.id } })
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' })
    res.json({ success: true, data: service })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
