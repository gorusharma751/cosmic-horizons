import express from 'express'
import { authenticate, requireAdmin } from '../middleware/auth'
import { generateSocialContent } from '../services/ai'

const router = express.Router()

router.get('/youtube', async (req, res) => {
  try {
    const videos = [
      { id: '1', title: 'Aaj Ka Rashifal - Daily Horoscope', views: 45000, thumbnail: '', publishedAt: new Date().toISOString() },
      { id: '2', title: 'Kundli Kaise Banayein - Complete Guide', views: 32000, thumbnail: '', publishedAt: new Date().toISOString() },
    ]
    res.json({ success: true, data: videos })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/instagram', async (req, res) => {
  try {
    const posts = [
      { id: '1', caption: 'Aaj ka din bahut shubh hai ✨', likes: 1240, image: '', publishedAt: new Date().toISOString() },
    ]
    res.json({ success: true, data: posts })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/social/generate-content (admin only)
router.post('/generate-content', authenticate, requireAdmin, async (req, res) => {
  try {
    const { topic, platform } = req.body
    const content = await generateSocialContent(topic, platform)
    res.json({ success: true, data: { content } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
