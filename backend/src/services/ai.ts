import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const ZODIAC_BY_MONTH: Record<string, string> = {
  '1': 'Capricorn', '2': 'Aquarius', '3': 'Pisces', '4': 'Aries',
  '5': 'Taurus', '6': 'Gemini', '7': 'Cancer', '8': 'Leo',
  '9': 'Virgo', '10': 'Libra', '11': 'Scorpio', '12': 'Sagittarius'
}

// Calculate basic kundli data from birth details
function calculateBasicKundli(dateOfBirth: string, timeOfBirth: string, placeOfBirth: string) {
  const date = new Date(dateOfBirth)
  const month = (date.getMonth() + 1).toString()
  const day = date.getDate()
  const hour = parseInt(timeOfBirth.split(':')[0])

  const sunSign = ZODIAC_BY_MONTH[month]
  const moonSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  const moonSign = moonSigns[(day + parseInt(month)) % 12]
  const ascendant = moonSigns[Math.floor(hour / 2) % 12]

  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati']
  const nakshatra = nakshatras[day % 27]

  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
  const planetary = planets.map((planet, i) => ({
    planet,
    sign: moonSigns[(parseInt(month) + i * 3) % 12],
    house: ((i * 2 + day) % 12) + 1,
    degree: `${(i * 7 + day) % 30}°${(i * 3 + 15) % 60}'`,
    isRetrograde: [2, 5, 6, 7, 8].includes(i) && day % 3 === 0
  }))

  return { sunSign, moonSign, ascendant, nakshatra, planetary }
}

export async function generateKundliWithAI(person1: any, person2?: any): Promise<any> {
  const basic = calculateBasicKundli(person1.dateOfBirth, person1.timeOfBirth, person1.placeOfBirth)

  // If OpenAI key available, use AI for predictions
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `You are a Vedic astrology expert. Generate a detailed kundli reading for:
Name: ${person1.name}
Date of Birth: ${person1.dateOfBirth}
Time of Birth: ${person1.timeOfBirth}
Place of Birth: ${person1.placeOfBirth}
Sun Sign: ${basic.sunSign}, Moon Sign: ${basic.moonSign}, Ascendant: ${basic.ascendant}

Respond ONLY in JSON format with these fields:
{
  "predictions": {
    "general": "general life prediction in Hindi (2-3 sentences)",
    "career": "career prediction in Hindi",
    "love": "love/marriage prediction in Hindi",
    "health": "health prediction in Hindi",
    "finance": "finance prediction in Hindi"
  },
  "remedies": ["remedy 1", "remedy 2", "remedy 3"],
  "luckyColor": "color name",
  "luckyNumber": number,
  "luckyDay": "day name",
  "gemstone": "gemstone name"
}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800
      })

      const content = completion.choices[0].message.content || '{}'
      const aiData = JSON.parse(content)
      return { ...basic, ...aiData }
    } catch (err) {
      console.error('AI generation failed, using fallback:', err)
    }
  }

  // Fallback predictions without AI
  const predictions: Record<string, Record<string, string>> = {
    hindi: {
      general: `${person1.name} ji, aapka ${basic.sunSign} rashi mein janam hua hai. Aapke jeevan mein aane wale samay mein bahut saari khushiyan aane wali hain. Aap ek pratibhashali aur mehnat karne wale vyakti hain.`,
      career: `Vyavsayik kshetra mein aapke liye shubh samay aa raha hai. Naukri mein tarrakki ke yog hain. Vyapar mein bhi labh milega.`,
      love: `Prem jeevan mein madhurta rahegi. Jo log vivahit hain unke liye grah stithi anukool hai. Vivah ke yog ban rahe hain.`,
      health: `Swasthya par vishesh dhyan dena zaroori hai. Niyamit vyayam aur sahi bhojan se aap swasth rahenge.`,
      finance: `Arthik stithi mein sudhar aayega. Niveish ke liye sahi samay hai. Vyarth kharch se bachein.`
    },
    english: {
      general: `${person1.name}, born under ${basic.sunSign}, you are entering a period of growth and prosperity. Your natural talents will be recognized.`,
      career: `Career prospects are excellent. Opportunities for promotion and business growth are indicated.`,
      love: `Your love life will blossom. Existing relationships will deepen and new bonds may form.`,
      health: `Pay attention to your wellbeing. Regular exercise and balanced diet will keep you healthy.`,
      finance: `Financial situation improves. Good time for investments. Avoid unnecessary expenses.`
    }
  }

  const lang = person1.language || 'hindi'
  const pred = predictions[lang] || predictions.hindi

  return {
    ...basic,
    predictions: pred,
    remedies: [
      'Surya namaskar karo rozana',
      'Guruwaar ko peele kapde pehno',
      'Shukravar ko Devi Maa ki pooja karo',
      'Navagraha mantra ka jaap karo'
    ],
    luckyColor: ['Red', 'Yellow', 'Blue', 'Green', 'White'][parseInt(person1.dateOfBirth.split('-')[2]) % 5],
    luckyNumber: (parseInt(person1.dateOfBirth.replace(/-/g, '')) % 9) + 1,
    luckyDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(person1.dateOfBirth).getDay()],
    gemstone: ['Ruby', 'Pearl', 'Red Coral', 'Emerald', 'Yellow Sapphire', 'Diamond', 'Blue Sapphire'][parseInt(person1.dateOfBirth.split('-')[1]) % 7]
  }
}

export async function generateHoroscope(sign: string, type: string, language: string = 'hindi'): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Generate a ${type} horoscope for ${sign} zodiac sign in ${language === 'hindi' ? 'Hindi' : 'English'}. Keep it 3-4 sentences, positive and insightful. Focus on practical advice.`
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
      return completion.choices[0].message.content || ''
    } catch {
      // Fallback
    }
  }

  return `${sign} rashi ke liye ${type === 'daily' ? 'aaj' : type === 'weekly' ? 'is hafte' : 'is mahine'} ka din bahut shubh hai. Naye avsar milenge, karya kshetra mein tarrakki hogi aur parivarik jeevan mein khushi rahegi. Dhyan aur mehnat se sab kuchh sambhav hai.`
}

export async function generateSocialContent(topic: string, platform: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Create a ${platform} post about "${topic}" for an Indian astrology platform. Make it engaging, include relevant emojis, and keep it under ${platform === 'twitter' ? '280' : '500'} characters. Mix Hindi and English naturally.`
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300
      })
      return completion.choices[0].message.content || ''
    } catch {
      // Fallback
    }
  }
  return `🌟 Aaj ka din bahut shubh hai! Apni rashi jaaniye aur pandit ji se guidance lijiye. ✨ #AstrologyIndia #CosmicHorizons #Jyotish`
}
