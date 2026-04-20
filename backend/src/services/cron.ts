import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { generateHoroscope } from './ai'
import { getSocialSettings, publishPost, scheduleAutoPost } from './socialMedia'

const prisma = new PrismaClient()
const ZODIAC_SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']

const FESTIVALS: Record<string, string> = {
  '01-14':'Makar Sankranti','01-26':'Republic Day','03-25':'Holi',
  '04-14':'Ram Navami','08-15':'Independence Day','10-24':'Navratri Start','11-01':'Diwali',
}

function getTodayFestival() {
  const today = new Date()
  const key = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  return FESTIVALS[key] || null
}

export function setupCronJobs() {
  // Generate daily horoscopes at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🔮 Generating daily horoscopes...')
    const today = new Date().toISOString().split('T')[0]

    for (const sign of ZODIAC_SIGNS) {
      try {
        const prediction = await generateHoroscope(sign, 'daily', 'hindi')
        await prisma.horoscope.upsert({
          where: { sign_type_date_language: { sign, type: 'daily', date: today, language: 'hindi' } },
          update: { prediction },
          create: {
            sign, type: 'daily', date: today, language: 'hindi',
            prediction,
            luckyColor: ['Red', 'Blue', 'Yellow', 'Green', 'White'][Math.floor(Math.random() * 5)],
            luckyNumber: Math.floor(Math.random() * 9) + 1,
            luckyDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]
          }
        })
      } catch (err) {
        console.error(`Failed to generate horoscope for ${sign}:`, err)
      }
    }
    console.log('✅ Daily horoscopes generated')
  }, { timezone: 'Asia/Kolkata' })

  // Cleanup expired OTPs every hour
  cron.schedule('0 * * * *', async () => {
    await prisma.oTP.deleteMany({ where: { expiresAt: { lt: new Date() } } })
    console.log('🧹 Expired OTPs cleaned up')
  })

  // Morning rashifal post - 7 AM IST
  cron.schedule('0 7 * * *', async () => {
    const settings = await getSocialSettings()
    if (!settings.autoPost) return
    const sign = ZODIAC_SIGNS[new Date().getDay() % 12]
    try {
      const post = await scheduleAutoPost({ type:'rashifal', platform: settings.defaultPlatform||'both', sign, scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Rashifal posted:', sign)
    } catch(e) { console.error('Rashifal post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Tip post - 12 PM IST
  cron.schedule('0 12 * * *', async () => {
    const settings = await getSocialSettings()
    if (!settings.autoPost || !settings.postTips) return
    const topics = ['Lucky colors aur upay aaj ke liye', 'Career mein success ke astro secrets', 'Ghar mein positive energy kaise laayein']
    try {
      const post = await scheduleAutoPost({ type:'tip', platform:settings.defaultPlatform||'both', topic:topics[Math.floor(Math.random()*topics.length)], scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Tip posted')
    } catch(e) { console.error('Tip post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Evening ad - 7 PM IST
  cron.schedule('0 19 * * *', async () => {
    const settings = await getSocialSettings()
    if (!settings.autoPost || !settings.postAds) return
    const services = ['Online Kundli Reading', 'Talk to Expert Astrologer', 'Kundli Milan', 'Vastu Consultation']
    try {
      const post = await scheduleAutoPost({ type:'ad', platform:settings.defaultPlatform||'both', service:services[Math.floor(Math.random()*services.length)], scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Ad posted')
    } catch(e) { console.error('Ad post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Festival check - 6 AM IST
  cron.schedule('0 6 * * *', async () => {
    const festival = getTodayFestival()
    if (!festival) return
    const settings = await getSocialSettings()
    if (!settings.autoPost || !settings.postFestivals) return
    try {
      const post = await scheduleAutoPost({ type:'festival', platform:settings.defaultPlatform||'both', festival, scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Festival posted:', festival)
    } catch(e) { console.error('Festival post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Upay - Tuesday & Saturday 8 AM
  cron.schedule('0 8 * * 2,6', async () => {
    const settings = await getSocialSettings()
    if (!settings.autoPost || !settings.postUpaye) return
    const upays = [
      { upayType:'Mangal dosh nivaran', target:'Mars/Mangal' },
      { upayType:'Shani sade sati', target:'Saturn/Shani' },
    ]
    const r = upays[Math.floor(Math.random()*upays.length)]
    try {
      const post = await scheduleAutoPost({ type:'upaye', platform:settings.defaultPlatform||'both', ...r, scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Upay posted')
    } catch(e) { console.error('Upay post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Weekly quote - Sunday 8 AM
  cron.schedule('0 8 * * 0', async () => {
    const settings = await getSocialSettings()
    if (!settings.autoPost) return
    try {
      const post = await scheduleAutoPost({ type:'quote', platform:settings.defaultPlatform||'both', scheduledAt:new Date() })
      await publishPost(post.id)
      console.log('Quote posted')
    } catch(e) { console.error('Quote post failed') }
  }, { timezone: 'Asia/Kolkata' })

  // Generate weekly horoscopes on Sundays
  cron.schedule('0 1 * * 0', async () => {
    console.log('📅 Generating weekly horoscopes...')
    const today = new Date().toISOString().split('T')[0]
    for (const sign of ZODIAC_SIGNS) {
      try {
        const prediction = await generateHoroscope(sign, 'weekly', 'hindi')
        await prisma.horoscope.upsert({
          where: { sign_type_date_language: { sign, type: 'weekly', date: today, language: 'hindi' } },
          update: { prediction },
          create: { sign, type: 'weekly', date: today, language: 'hindi', prediction }
        })
      } catch (err) {
        console.error(`Failed weekly horoscope for ${sign}`)
      }
    }
  }, { timezone: 'Asia/Kolkata' })

  console.log('⏰ Cron jobs initialized with social media auto-posting')
}
