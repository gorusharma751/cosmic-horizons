import express from 'express'
import { authenticate, requireAdmin } from '../middleware/auth'
import {
    generatePost,
    getPosts,
    getPostStats,
    getSocialSettings,
    PostContent,
    publishPost, savePost,
    saveSocialSettings
} from '../services/socialMedia'

const router = express.Router()

// All routes require admin
router.use(authenticate, requireAdmin)

// ===== GET ALL POSTS =====
router.get('/posts', async (req, res) => {
  try {
    const posts = await getPosts()
    const { status, type, platform } = req.query
    let filtered = posts
    if (status) filtered = filtered.filter(p => p.status === status)
    if (type) filtered = filtered.filter(p => p.type === type)
    if (platform) filtered = filtered.filter(p => p.platform === platform || p.platform === 'both')
    res.json({ success: true, data: filtered, total: filtered.length })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== GET STATS =====
router.get('/stats', async (req, res) => {
  try {
    const [stats, posts] = await Promise.all([getPostStats(), getPosts()])
    const byType: Record<string, number> = {}
    posts.forEach(p => { byType[p.type] = (byType[p.type] || 0) + 1 })
    res.json({ success: true, data: { ...stats, byType, recentPosts: posts.slice(0, 5) } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== GENERATE POST (AI) =====
router.post('/generate', async (req, res) => {
  try {
    const { type, platform, sign, festival, topic, service, upayType, target } = req.body
    if (!type || !platform) {
      return res.status(400).json({ success: false, error: 'type aur platform required hai' })
    }
    const result = await generatePost({ type, platform, sign, festival, topic, service, upayType, target })
    const post: PostContent = {
      id: `post_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      type, platform, status: 'draft',
      caption: result.caption,
      hashtags: result.hashtags,
      imagePrompt: result.imagePrompt,
      emoji: result.emoji,
      sign, createdAt: new Date().toISOString(),
    }
    await savePost(post)
    res.json({ success: true, data: post })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== GENERATE ALL 12 RASHIFAL =====
router.post('/generate-all-rashifal', async (req, res) => {
  try {
    const { platform = 'both' } = req.body
    const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']
    const results = []
    for (const sign of signs) {
      const result = await generatePost({ type: 'rashifal', platform, sign })
      const post: PostContent = {
        id: `post_${Date.now()}_${sign}`,
        type: 'rashifal', platform, status: 'draft',
        caption: result.caption, hashtags: result.hashtags,
        imagePrompt: result.imagePrompt, emoji: result.emoji,
        sign, createdAt: new Date().toISOString(),
      }
      await savePost(post)
      results.push(post)
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500))
    }
    res.json({ success: true, data: results, message: `${results.length} rashifal posts generated!` })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== UPDATE POST CAPTION =====
router.put('/posts/:id', async (req, res) => {
  try {
    const posts = await getPosts()
    const idx = posts.findIndex(p => p.id === req.params.id)
    if (idx < 0) return res.status(404).json({ success: false, error: 'Post not found' })
    posts[idx] = { ...posts[idx], ...req.body }
    // Save updated list
    const { getRedis } = await import('../services/socialMedia')
    await savePost(posts[idx])
    res.json({ success: true, data: posts[idx] })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== PUBLISH POST NOW =====
router.post('/posts/:id/publish', async (req, res) => {
  try {
    const result = await publishPost(req.params.id)
    if (!result) return res.status(404).json({ success: false, error: 'Post not found' })
    res.json({
      success: result.status === 'published',
      data: result,
      message: result.status === 'published'
        ? `Post published successfully! Instagram: ${result.instagramPostId || 'N/A'}, Facebook: ${result.facebookPostId || 'N/A'}`
        : 'Post publish nahi hua — social media tokens check karein'
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== SCHEDULE POST =====
router.post('/posts/:id/schedule', async (req, res) => {
  try {
    const { scheduledAt } = req.body
    if (!scheduledAt) return res.status(400).json({ success: false, error: 'scheduledAt required' })
    const posts = await getPosts()
    const post = posts.find(p => p.id === req.params.id)
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' })
    post.scheduledAt = scheduledAt
    post.status = 'scheduled'
    await savePost(post)
    res.json({ success: true, data: post, message: 'Post scheduled!' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== DELETE POST =====
router.delete('/posts/:id', async (req, res) => {
  try {
    const posts = await getPosts()
    const filtered = posts.filter(p => p.id !== req.params.id)
    // We need direct redis here — using savePost won't filter
    // Store all minus deleted
    const { getRedis } = require('../services/socialMedia')
    try {
      const r = getRedis()
      await r.set('cosmic:posts', JSON.stringify(filtered), 'EX', 60*60*24*30)
    } catch {}
    res.json({ success: true, message: 'Post deleted' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== GET/SAVE SETTINGS =====
router.get('/settings', async (req, res) => {
  try {
    const settings = await getSocialSettings()
    // Mask tokens
    const masked = { ...settings }
    if (masked.instagramToken) masked.instagramToken = masked.instagramToken.slice(0, 12) + '...'
    if (masked.facebookToken) masked.facebookToken = masked.facebookToken.slice(0, 12) + '...'
    res.json({ success: true, data: masked })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/settings', async (req, res) => {
  try {
    const current = await getSocialSettings()
    // Don't overwrite tokens with masked values
    const updated = { ...current, ...req.body }
    if (req.body.instagramToken?.includes('...')) delete updated.instagramToken
    if (req.body.facebookToken?.includes('...')) delete updated.facebookToken
    await saveSocialSettings(updated)
    res.json({ success: true, message: 'Settings saved!', data: updated })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===== QUICK GENERATE & PUBLISH =====
router.post('/quick-publish', async (req, res) => {
  try {
    const { type, platform, sign, festival, topic, service, upayType, target } = req.body
    const result = await generatePost({ type, platform, sign, festival, topic, service, upayType, target })
    const post: PostContent = {
      id: `post_${Date.now()}`,
      type, platform, status: 'draft',
      caption: result.caption, hashtags: result.hashtags,
      imagePrompt: result.imagePrompt, emoji: result.emoji,
      sign, createdAt: new Date().toISOString(),
    }
    await savePost(post)
    const published = await publishPost(post.id)
    res.json({
      success: published?.status === 'published',
      data: published,
      message: published?.status === 'published' ? 'Post generated aur publish ho gaya!' : 'Generated but publish failed — tokens check karo'
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router