import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import axios from 'axios'
import Redis from 'ioredis'

// ===== REDIS CLIENT =====
let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })
    redis.on('error', (err) => {
      console.log('Redis not connected (optional):', err.message)
    })
  }
  return redis
}

// ===== STORAGE KEYS =====
const KEYS = {
  posts: 'cosmic:posts',
  scheduled: 'cosmic:scheduled',
  templates: 'cosmic:templates',
  settings: 'cosmic:social_settings',
  stats: 'cosmic:post_stats',
}

// ===== GEMINI LLM SETUP =====
function getLLM() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-1.5-flash',
    temperature: 0.85,
    maxOutputTokens: 800,
  })
}

// ===== POST TYPES =====
export type PostType = 'rashifal' | 'upaye' | 'festival' | 'ad' | 'tip' | 'quote' | 'product'
export type Platform = 'instagram' | 'facebook' | 'both'

export interface PostContent {
  id: string
  type: PostType
  platform: Platform
  caption: string
  hashtags: string[]
  imagePrompt: string
  emoji: string
  scheduledAt?: string
  publishedAt?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  instagramPostId?: string
  facebookPostId?: string
  sign?: string
  createdAt: string
}

// ===== TRENDING HASHTAGS =====
const HASHTAG_SETS: Record<PostType, string[]> = {
  rashifal: [
    '#rashifal', '#horoscope', '#astrology', '#jyotish', '#kundli',
    '#rashiphal', '#aajkarashifal', '#vedicastrology', '#zodiac',
    '#astrologer', '#cosmichorizons', '#bhavishyavani', '#rashi',
    '#dailyhoroscope', '#todayhoroscope', '#indianastrology',
  ],
  upaye: [
    '#upaye', '#remedy', '#vastutips', '#astrologytips', '#jyotishtips',
    '#grahshanti', '#navgraha', '#mantra', '#puja', '#vastu',
    '#spirituality', '#hindudharma', '#cosmichorizons', '#astroremedy',
  ],
  festival: [
    '#festival', '#tyohar', '#hinduculture', '#india', '#celebration',
    '#puja', '#tradition', '#bhakti', '#dharma', '#cosmichorizons',
    '#festivalsofIndia', '#templevibes', '#devotion',
  ],
  ad: [
    '#cosmichorizons', '#astrologyconsultancy', '#talktoastrologer',
    '#onlinekundli', '#astrologerIndia', '#jyotish', '#vedicastrology',
    '#freekundli', '#kundlireading', '#horoscopereading',
  ],
  tip: [
    '#astrotip', '#jyotishtip', '#dailytip', '#spiritualtip',
    '#vastutip', '#cosmichorizons', '#astrologyfacts', '#hinduwisdom',
  ],
  quote: [
    '#astroquote', '#spiritualquote', '#motivation', '#wisdom',
    '#hinduwisdom', '#jyotishquote', '#cosmichorizons', '#dailyquote',
  ],
  product: [
    '#gemstone', '#rudraksha', '#yantra', '#navratna', '#crystalhealing',
    '#spiritualproducts', '#cosmichorizons', '#astrologyjewelry',
  ],
}

// ===== PROMPT TEMPLATES =====
const RASHIFAL_PROMPT = PromptTemplate.fromTemplate(`
Tu ek expert Vedic astrologer aur social media content creator hai — "Cosmic Horizons" ke liye.

Aaj ki taareekh: {date}
Rashi: {sign} ({signHindi})
Platform: {platform}
Bhasha: Hinglish (Hindi + English mix, natural aur relatable)

Ek VIRAL {platform} post bana aaj ke rashifal ke liye. Post mein hona chahiye:
1. Catchy opening line (emoji ke saath shuru karo)
2. Din ka prediction (career, love, health, finance — koi 2 cover karo)
3. Lucky tip ya upay
4. Call to action — "Comment karo apni rashi 👇"
5. Brand mention: "✨ Cosmic Horizons"

RULES:
- Natural Hinglish mein likho, forced translation nahi
- 3-4 paras, har para 2-3 lines
- Emojis use karo — minimum 8-10
- Trending feel honi chahiye
- Maximum engagement ke liye likho
- ONLY caption likho, koi extra explanation nahi

Caption:`)

const UPAYE_PROMPT = PromptTemplate.fromTemplate(`
Tu ek expert Vedic astrologer hai — "Cosmic Horizons" ke liye viral content banana hai.

Upay type: {upayType}
Grah/Rashi: {target}
Platform: {platform}

Ek practical aur interesting upay post bana. Include karo:
1. Problem statement (log ye problem face karte hain)
2. Simple upay (ghar pe ho sake)
3. Kab aur kaise karein
4. Kya fal milega
5. CTA: "Aur upay jaanne ke liye link in bio! 🔗"

RULES:
- Hinglish mein, real aur believable lagni chahiye
- Simple language, har koi samajh sake
- 8-10 emojis
- Maximum 250 words
- Only caption, no extra text

Caption:`)

const FESTIVAL_PROMPT = PromptTemplate.fromTemplate(`
Tu ek creative social media manager hai "Cosmic Horizons" ke liye.

Festival/Tyohar: {festival}
Date: {date}
Platform: {platform}

Ek warm, engaging festival post bana. Include karo:
1. Greetings (dil se)
2. Festival ka astrological significance
3. Is din ka special muhurat ya upay
4. Blessings aur wishes
5. CTA: Like karo ❤️ aur share karo

RULES:
- Celebratory tone, positive energy
- Respectful aur authentic
- 10-12 emojis
- Only caption

Caption:`)

const AD_PROMPT = PromptTemplate.fromTemplate(`
Tu ek expert social media ads copywriter hai "Cosmic Horizons" ke liye.

Service: {service}
Target audience: {audience}
Platform: {platform}
Offer: {offer}

Ek high-converting promotional post bana. Include karo:
1. Hook — problem ya curiosity (first 2 lines MUST be attention-grabbing)
2. Service ki value proposition
3. Social proof (1 Cr+ consultations, 500+ pandits)
4. Offer/CTA — "Abhi book karo! Link in bio 🔗"
5. Urgency element

RULES:
- Persuasive lekin authentic
- FOMO create karo
- 6-8 emojis
- Only caption, no extra text

Caption:`)

const TIP_PROMPT = PromptTemplate.fromTemplate(`
Tu ek Vedic astrology expert hai "Cosmic Horizons" ke liye.

Tip topic: {topic}
Day: {day}
Platform: {platform}

Ek useful aur shareable astro tip post bana:
1. Did you know? Ya interesting fact se start karo
2. Main tip (practical, doable)
3. Why it works (astrological reason briefly)
4. Save karo 🔖 — "Ye tip kaam aayegi!"

RULES:
- Educational but engaging tone
- Easy to understand
- 8 emojis minimum
- Only caption

Caption:`)

// ===== LANGCHAIN CHAINS =====
function buildChain(promptTemplate: PromptTemplate) {
  return RunnableSequence.from([
    promptTemplate,
    getLLM(),
    new StringOutputParser(),
  ])
}

// ===== MAIN POST GENERATOR =====
export async function generatePost(params: {
  type: PostType
  platform: Platform
  sign?: string
  festival?: string
  topic?: string
  service?: string
  upayType?: string
  target?: string
}): Promise<{ caption: string; hashtags: string[]; imagePrompt: string; emoji: string }> {
  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const day = new Date().toLocaleDateString('en-IN', { weekday: 'long' })

  const SIGN_HINDI: Record<string, string> = {
    aries: 'मेष', taurus: 'वृषभ', gemini: 'मिथुन', cancer: 'कर्क',
    leo: 'सिंह', virgo: 'कन्या', libra: 'तुला', scorpio: 'वृश्चिक',
    sagittarius: 'धनु', capricorn: 'मकर', aquarius: 'कुंभ', pisces: 'मीन',
  }

  let caption = ''

  try {
    switch (params.type) {
      case 'rashifal': {
        const chain = buildChain(RASHIFAL_PROMPT)
        caption = await chain.invoke({
          date, sign: params.sign || 'aries',
          signHindi: SIGN_HINDI[params.sign || 'aries'] || 'मेष',
          platform: params.platform,
        })
        break
      }
      case 'upaye': {
        const chain = buildChain(UPAYE_PROMPT)
        caption = await chain.invoke({
          upayType: params.upayType || 'Shani dosh nivaran',
          target: params.target || 'Shani graha',
          platform: params.platform,
        })
        break
      }
      case 'festival': {
        const chain = buildChain(FESTIVAL_PROMPT)
        caption = await chain.invoke({
          festival: params.festival || 'Navratri',
          date, platform: params.platform,
        })
        break
      }
      case 'ad': {
        const chain = buildChain(AD_PROMPT)
        caption = await chain.invoke({
          service: params.service || 'Online Kundli Reading',
          audience: 'Indians seeking astrology guidance',
          platform: params.platform,
          offer: 'First consultation 50% off',
        })
        break
      }
      case 'tip': {
        const chain = buildChain(TIP_PROMPT)
        caption = await chain.invoke({
          topic: params.topic || 'Monday ke upay',
          day, platform: params.platform,
        })
        break
      }
      case 'quote': {
        const model = getLLM()
        const result = await model.invoke(
          `Generate a profound Vedic astrology quote in Hinglish for Instagram. 
           It should be spiritual, motivational, and shareable. 
           Include 5-6 relevant emojis. End with "— Cosmic Horizons ✨"
           Only the quote, nothing else.`
        )
        caption = result.content as string
        break
      }
      case 'product': {
        const model = getLLM()
        const result = await model.invoke(
          `Write a compelling Instagram product post for "${params.service || 'Blue Sapphire Gemstone'}" 
           from Cosmic Horizons astrology shop. Hinglish, 150 words max.
           Include benefits, authenticity, price range ₹999-₹9999.
           CTA: "DM us or link in bio 🔗". 8+ emojis. Only caption.`
        )
        caption = result.content as string
        break
      }
    }
  } catch (err: any) {
    // Fallback if Gemini fails
    caption = getFallbackCaption(params.type, params.sign, params.festival)
  }

  const hashtags = getHashtags(params.type, params.sign)
  const imagePrompt = getImagePrompt(params.type, params.sign, params.festival)
  const emoji = getMainEmoji(params.type)

  return { caption: caption.trim(), hashtags, imagePrompt, emoji }
}

// ===== FALLBACK CAPTIONS =====
function getFallbackCaption(type: PostType, sign?: string, festival?: string): string {
  const fallbacks: Record<PostType, string> = {
    rashifal: `🌟 Aaj ka din aapke liye khaas hai! ✨\n\n${sign || 'Mesh'} rashi waalon ke liye aaj opportunities ka din hai. Career mein nayi raahein khulenge, relationships mein meethas aayegi. 💕\n\n💡 Lucky tip: Subah surya namaskar karein aur din shuru karein positivity ke saath!\n\n🔮 Aur bhi gehri jankari ke liye humare expert pandits se baat karein.\n\nComment karo apni rashi 👇\n✨ Cosmic Horizons`,
    upaye: `🙏 Ek powerful upay jo aapki zindagi badal sakta hai! ⚡\n\nShan graha ke dosh ko door karne ke liye har Saturday ko shaam ke samay 7 kale til deep pe chadhaayein. 🪔\n\nKyun kaam karta hai: Shani dev ko ye offering bahut priya hai, jo unka ashirwad dilata hai.\n\nResult: Career mein rukawatein hatne lagti hain, tensions kam hoti hain. ✅\n\nAur upay jaanne ke liye link in bio! 🔗\n✨ Cosmic Horizons`,
    festival: `🎊 Shubh Kamnayein! 🌸\n\nIs pavitra tyohar pe aap sabhi ko dher saari badhai aur dua! 🙏\n\nAstrologically, yeh din bahut shubh hai — nayi shuruaaton ke liye perfect muhurat hai!\n\n❤️ Like karo aur share karo apne priyanon ke saath!\n✨ Cosmic Horizons`,
    ad: `🔮 Kya aap jaanna chahte hain aapka bhavishya? ✨\n\nIndia ke 500+ expert Vedic astrologers ab online available hain — sirf aapke liye! 📱\n\n✅ 1 Crore+ successful consultations\n✅ 4.8★ rating\n✅ 24/7 available\n\nAbhi pehli consultation pe 50% discount! ⏰\n\nLink in bio se book karein 🔗\n✨ Cosmic Horizons`,
    tip: `💡 Astro Tip of the Day! 🌟\n\nKya aap jaante hain? Budhwar ko hare rang ke kapde pehenkar office jaane se Mercury ki kripa milti hai — career mein success ke chances badhte hain! 💚\n\nTry karein agle Budhwar! ✅\n\nSave karo 🔖 — Ye tip kaam aayegi!\n✨ Cosmic Horizons`,
    quote: `"Taare sirf raat mein nahi, har mushkil mein bhi raah dikhate hain." 🌟\n\n— Vedic Wisdom ✨\n\nCosmic Horizons ke saath apna astrological journey shuru karein! 🔮`,
    product: `💎 Asli Neelam (Blue Sapphire) — Shani ki kripa ke liye! ✨\n\nCertified, energized, aur directly Jaipur se — aapke liye special!\n\n✅ Lab certified genuine gemstone\n✅ Pandit ji dwara energized\n✅ Free consultation included\n\nDM karein ya link in bio pe jaayein 🔗\n✨ Cosmic Horizons`
  }
  return fallbacks[type]
}

function getHashtags(type: PostType, sign?: string): string[] {
  const base = HASHTAG_SETS[type] || HASHTAG_SETS.rashifal
  if (sign) {
    const signTags: Record<string, string[]> = {
      aries: ['#mesh', '#aries', '#ariesdaily'],
      taurus: ['#vrishabh', '#taurus', '#taurusdaily'],
      gemini: ['#mithun', '#gemini', '#geminidaily'],
      cancer: ['#kark', '#cancer', '#cancerdaily'],
      leo: ['#simha', '#leo', '#leodaily'],
      virgo: ['#kanya', '#virgo', '#virgodaily'],
      libra: ['#tula', '#libra', '#libradaily'],
      scorpio: ['#vrischik', '#scorpio', '#scorpiodaily'],
      sagittarius: ['#dhanu', '#sagittarius', '#sagdaily'],
      capricorn: ['#makar', '#capricorn', '#capridaily'],
      aquarius: ['#kumbh', '#aquarius', '#aquariusdaily'],
      pisces: ['#meen', '#pisces', '#piscesdaily'],
    }
    return [...base.slice(0, 10), ...(signTags[sign] || [])].slice(0, 20)
  }
  return base.slice(0, 20)
}

function getImagePrompt(type: PostType, sign?: string, festival?: string): string {
  const prompts: Record<PostType, string> = {
    rashifal: `Mystical cosmic background with ${sign || 'zodiac'} constellation, golden stars, dark purple/indigo gradient, mandala patterns, elegant Indian astrology aesthetic`,
    upaye: `Spiritual Indian temple background, glowing oil lamp, marigold flowers, soft golden light, mystical sacred atmosphere`,
    festival: `Vibrant colorful festival decorations, diyas, flowers, golden light, joyful celebratory Indian atmosphere`,
    ad: `Professional astrology consultation, cosmic background, mystical but modern, premium Indian brand aesthetic`,
    tip: `Beautiful cosmic illustration with planets, stars, zodiac symbols, educational infographic style, purple and gold`,
    quote: `Elegant dark background with stars, golden calligraphy style text, lotus flower, spiritual Indian aesthetic`,
    product: `Luxury gemstone photography, bokeh background, golden light, premium product showcase aesthetic`,
  }
  return prompts[type]
}

function getMainEmoji(type: PostType): string {
  const emojis: Record<PostType, string> = {
    rashifal: '🌟', upaye: '🙏', festival: '🎊', ad: '🔮', tip: '💡', quote: '✨', product: '💎'
  }
  return emojis[type]
}

// ===== INSTAGRAM API =====
export async function postToInstagram(params: {
  caption: string
  hashtags: string[]
  imageUrl?: string
  accessToken: string
  igUserId: string
}): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const fullCaption = `${params.caption}\n\n.\n.\n.\n${params.hashtags.join(' ')}`
    const imageUrl = params.imageUrl || process.env.DEFAULT_POST_IMAGE_URL || 'https://placehold.co/1080x1080/1a1330/fbbf24?text=Cosmic+Horizons'

    // Step 1: Create media container
    const containerRes = await axios.post(
      `https://graph.facebook.com/v19.0/${params.igUserId}/media`,
      {
        image_url: imageUrl,
        caption: fullCaption,
        access_token: params.accessToken,
      }
    )
    const creationId = containerRes.data.id

    // Step 2: Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${params.igUserId}/media_publish`,
      {
        creation_id: creationId,
        access_token: params.accessToken,
      }
    )

    return { success: true, postId: publishRes.data.id }
  } catch (err: any) {
    console.error('Instagram post failed:', err.response?.data || err.message)
    return { success: false, error: err.response?.data?.error?.message || err.message }
  }
}

// ===== FACEBOOK API =====
export async function postToFacebook(params: {
  caption: string
  hashtags: string[]
  imageUrl?: string
  accessToken: string
  pageId: string
}): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const fullCaption = `${params.caption}\n\n${params.hashtags.slice(0, 10).join(' ')}`
    const imageUrl = params.imageUrl || process.env.DEFAULT_POST_IMAGE_URL || 'https://placehold.co/1080x1080/1a1330/fbbf24?text=Cosmic+Horizons'

    const res = await axios.post(
      `https://graph.facebook.com/v19.0/${params.pageId}/photos`,
      {
        url: imageUrl,
        caption: fullCaption,
        access_token: params.accessToken,
      }
    )

    return { success: true, postId: res.data.id }
  } catch (err: any) {
    console.error('Facebook post failed:', err.response?.data || err.message)
    return { success: false, error: err.response?.data?.error?.message || err.message }
  }
}

// ===== REDIS STORAGE =====
export async function savePost(post: PostContent): Promise<void> {
  try {
    const r = getRedis()
    const posts = await getPosts()
    const updated = [post, ...posts.filter(p => p.id !== post.id)].slice(0, 200)
    await r.set(KEYS.posts, JSON.stringify(updated), 'EX', 60 * 60 * 24 * 30) // 30 days
  } catch {
    // Redis not available — skip
  }
}

export async function getPosts(): Promise<PostContent[]> {
  try {
    const r = getRedis()
    const data = await r.get(KEYS.posts)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export async function getPostStats(): Promise<Record<string, number>> {
  try {
    const r = getRedis()
    const data = await r.get(KEYS.stats)
    return data ? JSON.parse(data) : { total: 0, instagram: 0, facebook: 0, scheduled: 0, failed: 0 }
  } catch {
    return { total: 0, instagram: 0, facebook: 0, scheduled: 0, failed: 0 }
  }
}

export async function updateStats(platform: string, status: 'published' | 'failed'): Promise<void> {
  try {
    const r = getRedis()
    const stats = await getPostStats()
    stats.total = (stats.total || 0) + 1
    stats[platform] = (stats[platform] || 0) + 1
    if (status === 'failed') stats.failed = (stats.failed || 0) + 1
    await r.set(KEYS.stats, JSON.stringify(stats), 'EX', 60 * 60 * 24 * 365)
  } catch {}
}

export async function saveSocialSettings(settings: any): Promise<void> {
  try {
    const r = getRedis()
    await r.set(KEYS.settings, JSON.stringify(settings), 'EX', 60 * 60 * 24 * 365)
  } catch {}
}

export async function getSocialSettings(): Promise<any> {
  try {
    const r = getRedis()
    const data = await r.get(KEYS.settings)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// ===== AUTO SCHEDULER =====
export async function scheduleAutoPost(params: {
  type: PostType
  platform: Platform
  sign?: string
  festival?: string
  topic?: string
  service?: string
  upayType?: string
  target?: string
  scheduledAt: Date
}): Promise<PostContent> {
  const { caption, hashtags, imagePrompt, emoji } = await generatePost(params)

  const post: PostContent = {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: params.type,
    platform: params.platform,
    caption,
    hashtags,
    imagePrompt,
    emoji,
    scheduledAt: params.scheduledAt.toISOString(),
    status: 'scheduled',
    sign: params.sign,
    createdAt: new Date().toISOString(),
  }

  await savePost(post)
  return post
}

// ===== PUBLISH NOW =====
export async function publishPost(postId: string): Promise<PostContent | null> {
  const posts = await getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return null

  const settings = await getSocialSettings()
  const fullCaption = post.caption

  let igResult: { success: boolean; postId?: string; error?: string } = { success: false, error: 'Not configured' }
  let fbResult: { success: boolean; postId?: string; error?: string } = { success: false, error: 'Not configured' }

  if ((post.platform === 'instagram' || post.platform === 'both') && settings.instagramToken && settings.igUserId) {
    igResult = await postToInstagram({
      caption: fullCaption,
      hashtags: post.hashtags,
      accessToken: settings.instagramToken,
      igUserId: settings.igUserId,
    })
    if (igResult.success) {
      post.instagramPostId = igResult.postId
      await updateStats('instagram', 'published')
    } else {
      await updateStats('instagram', 'failed')
    }
  }

  if ((post.platform === 'facebook' || post.platform === 'both') && settings.facebookToken && settings.facebookPageId) {
    fbResult = await postToFacebook({
      caption: fullCaption,
      hashtags: post.hashtags,
      accessToken: settings.facebookToken,
      pageId: settings.facebookPageId,
    })
    if (fbResult.success) {
      post.facebookPostId = fbResult.postId
      await updateStats('facebook', 'published')
    } else {
      await updateStats('facebook', 'failed')
    }
  }

  const anySuccess = igResult.success || fbResult.success
  post.status = anySuccess ? 'published' : 'failed'
  post.publishedAt = new Date().toISOString()

  await savePost(post)
  return post
}