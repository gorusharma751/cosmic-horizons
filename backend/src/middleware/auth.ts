import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, error: 'No token provided' })

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'cosmic-secret-key')
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Admin access required' })
  }
  next()
}

export const requirePandit = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'PANDIT' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Pandit access required' })
  }
  next()
}
