import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'

dotenv.config()

import adminRoutes from './routes/admin'
import authRoutes from './routes/auth'
import consultationRoutes from './routes/consultations'
import kundliRoutes from './routes/kundli'
import orderRoutes from './routes/orders'
import panditDashRoutes from './routes/panditDash'
import panditRoutes from './routes/pandits'
import paymentRoutes from './routes/payments'
import poojaRoutes from './routes/pooja'
import productRoutes from './routes/products'
import socialRoutes from './routes/social'
import socialMediaRoutes from './routes/socialMedia'
import { setupCronJobs } from './services/cron'
import { setupSocketHandlers } from './services/socket'

const app = express()
const httpServer = createServer(app)
const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, '')

const configuredFrontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean)

const exactAllowedOrigins = configuredFrontendOrigins.filter((origin) => !origin.includes('*'))
const wildcardAllowedOriginPatterns = configuredFrontendOrigins
  .filter((origin) => origin.includes('*'))
  .map((origin) => {
    const escapedPattern = origin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')
    return new RegExp(`^${escapedPattern}$`)
  })

const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true
  }

  const normalizedOrigin = normalizeOrigin(origin)
  if (exactAllowedOrigins.includes(normalizedOrigin)) {
    return true
  }

  return wildcardAllowedOriginPatterns.some((pattern) => pattern.test(normalizedOrigin))
}

const socketAllowedOrigins = [...exactAllowedOrigins, ...wildcardAllowedOriginPatterns]

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server checks).
    if (isAllowedOrigin(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}

// Socket.io setup
export const io = new SocketServer(httpServer, {
  cors: {
    origin: socketAllowedOrigins.length > 0 ? socketAllowedOrigins : true,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Trust proxy for express-rate-limit (Render sits behind a proxy)
app.set('trust proxy', 1)

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests, please try again later'
})
app.use('/api/', limiter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Cosmic Horizons API' })
})
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Cosmic Horizons API' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/pandits', panditRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/kundli', kundliRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/pooja', poojaRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/pandit', panditDashRoutes)
app.use('/api/social', socialRoutes)
app.use('/api/social-media', socialMediaRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
})

// Setup socket handlers
setupSocketHandlers(io)

// Setup cron jobs
setupCronJobs()

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 Cosmic Horizons API running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
