import { PrismaClient } from '@prisma/client'
import express from 'express'
import { authenticate } from '../middleware/auth'
import { generateKundliWithAI } from '../services/ai'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/kundli/generate
router.post('/generate', async (req: any, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth, gender, language } = req.body
    const userId = req.user?.userId

    const kundliData = await generateKundliWithAI({ name, dateOfBirth, timeOfBirth, placeOfBirth, gender, language })

    const report = await prisma.kundliReport.create({
      data: {
        userId,
        name, dateOfBirth, timeOfBirth, placeOfBirth, gender,
        language: language || 'hindi',
        sunSign: kundliData.sunSign,
        moonSign: kundliData.moonSign,
        ascendant: kundliData.ascendant,
        nakshatra: kundliData.nakshatra,
        planetary: kundliData.planetary,
        predictions: kundliData.predictions,
        remedies: kundliData.remedies,
        luckyColor: kundliData.luckyColor,
        luckyNumber: kundliData.luckyNumber,
        luckyDay: kundliData.luckyDay,
        gemstone: kundliData.gemstone,
      }
    })

    res.json({ success: true, data: report })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/kundli/matchmaking
router.post('/matchmaking', async (req: any, res) => {
  try {
    const { person1, person2 } = req.body

    // AI-powered matchmaking
    const result = await generateKundliWithAI(person1, person2)

    // Mock matchmaking result
    const report = {
      person1, person2,
      totalScore: 28,
      maxScore: 36,
      compatibility: 78,
      kootas: [
        { name: 'Varna', score: 1, maxScore: 1, description: 'Good spiritual compatibility' },
        { name: 'Vashya', score: 2, maxScore: 2, description: 'Excellent mutual attraction' },
        { name: 'Tara', score: 3, maxScore: 3, description: 'Good health & longevity' },
        { name: 'Yoni', score: 3, maxScore: 4, description: 'Physical compatibility is good' },
        { name: 'Graha Maitri', score: 4, maxScore: 5, description: 'Good mental compatibility' },
        { name: 'Gana', score: 5, maxScore: 6, description: 'Excellent temperament match' },
        { name: 'Bhakoot', score: 6, maxScore: 7, description: 'Very good health & prosperity' },
        { name: 'Nadi', score: 4, maxScore: 8, description: 'Moderate health compatibility' },
      ],
      recommendation: 'Yeh match bahut shubh hai. 78% compatibility ke saath yeh jodi lamba sukhi jeevan jeeyegi. Kuch chhoti pareshaniya ho sakti hain lekin pyaar aur samajh se sab theek ho sakta hai.'
    }

    res.json({ success: true, data: report })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/kundli/history
router.get('/history', authenticate, async (req: any, res) => {
  try {
    const reports = await prisma.kundliReport.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    res.json({ success: true, data: reports })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/panchang
router.get('/panchang', async (req, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0]
    const panchang = {
      date,
      tithi: 'Tritiya',
      nakshatra: 'Rohini',
      yoga: 'Siddha',
      karana: 'Taitila',
      sunRise: '06:12 AM',
      sunSet: '06:48 PM',
      moonRise: '08:30 AM',
      auspicious: ['Abhijit Muhurat: 12:07-12:55', 'Vijaya Muhurat: 14:31-15:19'],
      inauspicious: ['Rahu Kaal: 04:30-06:00', 'Gulika Kaal: 06:00-07:30'],
      festivals: [],
      rahukaal: '10:30 AM - 12:00 PM',
      gulika: '07:30 AM - 09:00 AM'
    }
    res.json({ success: true, data: panchang })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/horoscope/:sign
router.get('/horoscope/:sign', async (req, res) => {
  try {
    const { sign } = req.params
    const { type = 'daily' } = req.query
    const today = new Date().toISOString().split('T')[0]

    let horoscope = await prisma.horoscope.findUnique({
      where: { sign_type_date_language: { sign, type: type as string, date: today, language: 'hindi' } }
    })

    if (!horoscope) {
      // Auto-generate via AI (or use fallback)
      horoscope = await prisma.horoscope.create({
        data: {
          sign, type: type as string, date: today,
          prediction: `${sign} rashi ke liye aaj ka din bahut shubh hai. Naye avsar milenge aur safalta milegi.`,
          luckyColor: 'Red', luckyNumber: 7, luckyDay: 'Tuesday',
          areas: { love: 'Acha', career: 'Bahut Acha', health: 'Theek', finance: 'Acha' }
        }
      })
    }

    res.json({ success: true, data: horoscope })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/kundli/:id
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.kundliReport.findUnique({ where: { id: req.params.id } })
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' })
    res.json({ success: true, data: report })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
