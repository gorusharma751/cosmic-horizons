import { PrismaClient } from '@prisma/client'
import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, inStock: true },
      take: 8, orderBy: { soldCount: 'desc' }
    })
    res.json({ success: true, data: products })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/products/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { reviews: { include: { user: { select: { name: true, avatar: true } } }, take: 10 } }
    })
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
    res.json({ success: true, data: product })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ success: true, data: [] })
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } }
        ]
      }, take: 20
    })
    res.json({ success: true, data: products })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 20, featured } = req.query
    const where: any = { inStock: true }
    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }

    let orderBy: any = { soldCount: 'desc' }
    if (sort === 'price_low') orderBy = { price: 'asc' }
    if (sort === 'price_high') orderBy = { price: 'desc' }
    if (sort === 'rating') orderBy = { rating: 'desc' }
    if (sort === 'newest') orderBy = { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.product.count({ where })
    ])
    res.json({ success: true, data: products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' })
    res.json({ success: true, data: product })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
