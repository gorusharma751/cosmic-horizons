'use client'
import { adminAPI } from '@/lib/api'
import {
    AlertCircle,
    BarChart3, CheckCircle,
    Copy,
    Facebook,
    Globe,
    Image,
    Instagram,
    Loader2,
    RefreshCw,
    Send,
    Settings,
    Sparkles,
    Star,
    ToggleLeft, ToggleRight,
    Trash2,
    XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Types
type PostType = 'rashifal' | 'upaye' | 'festival' | 'ad' | 'tip' | 'quote' | 'product'
type Platform = 'instagram' | 'facebook' | 'both'
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

interface SocialPost {
  id: string; type: PostType; platform: Platform; status: PostStatus
  caption: string; hashtags: string[]; imagePrompt: string; emoji: string
  sign?: string; scheduledAt?: string; publishedAt?: string
  instagramPostId?: string; facebookPostId?: string; createdAt: string
}

interface SocialSettings {
  autoPost: boolean; defaultPlatform: Platform
  instagramToken: string; igUserId: string
  facebookToken: string; facebookPageId: string
  postRashifal: boolean; postTips: boolean; postAds: boolean
  postFestivals: boolean; postUpaye: boolean; postQuotes: boolean
}

const ZODIAC_SIGNS = [
  { id:'aries',name:'Mesh ♈' },{ id:'taurus',name:'Vrishabh ♉' },
  { id:'gemini',name:'Mithun ♊' },{ id:'cancer',name:'Kark ♋' },
  { id:'leo',name:'Simha ♌' },{ id:'virgo',name:'Kanya ♍' },
  { id:'libra',name:'Tula ♎' },{ id:'scorpio',name:'Vrischik ♏' },
  { id:'sagittarius',name:'Dhanu ♐' },{ id:'capricorn',name:'Makar ♑' },
  { id:'aquarius',name:'Kumbh ♒' },{ id:'pisces',name:'Meen ♓' },
]

const POST_TYPES: { value: PostType; label: string; emoji: string; desc: string }[] = [
  { value:'rashifal', label:'Rashifal', emoji:'🌟', desc:'Daily zodiac prediction' },
  { value:'upaye', label:'Upay/Remedy', emoji:'🙏', desc:'Astrological remedies' },
  { value:'festival', label:'Festival/Tyohar', emoji:'🎊', desc:'Festival greetings + significance' },
  { value:'ad', label:'Promotional Ad', emoji:'📢', desc:'Service promotion post' },
  { value:'tip', label:'Astro Tip', emoji:'💡', desc:'Daily useful tip' },
  { value:'quote', label:'Spiritual Quote', emoji:'✨', desc:'Motivational astro quote' },
  { value:'product', label:'Product Post', emoji:'💎', desc:'Shop product promotion' },
]

const UPAY_TYPES = ['Mangal dosh nivaran','Shani sade sati','Rahu ketu dosh','Kaal sarp dosh','Guru dosh','Budh dosh']
const FESTIVALS = ['Makar Sankranti','Basant Panchami','Holi','Ram Navami','Hanuman Jayanti','Janmashtami','Navratri','Diwali','Dussehra','Raksha Bandhan','Eid ul Fitr','Christmas','New Year']
const SERVICES = ['Online Kundli Reading','Talk to Expert Astrologer','Kundli Milan - Marriage Compatibility','Vastu Consultation','Online Pooja Booking','Gemstone Consultation','Business Astrology']

export default function SocialMediaPage() {
  const [tab, setTab] = useState<'generate'|'posts'|'settings'|'stats'>('generate')
  const [postType, setPostType] = useState<PostType>('rashifal')
  const [platform, setPlatform] = useState<Platform>('both')
  const [sign, setSign] = useState('aries')
  const [festival, setFestival] = useState('Diwali')
  const [upayType, setUpayType] = useState('Shani sade sati')
  const [service, setService] = useState('Online Kundli Reading')
  const [customTopic, setCustomTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [stats, setStats] = useState<any>({})
  const [settings, setSettings] = useState<Partial<SocialSettings>>({
    autoPost: false, defaultPlatform: 'both',
    postRashifal: true, postTips: true, postAds: true,
    postFestivals: true, postUpaye: true, postQuotes: true,
  })
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    loadPosts()
    loadStats()
    loadSettings()
  }, [])

  const loadPosts = async () => {
    setLoadingPosts(true)
    try {
      const res: any = await adminAPI.getSocialPosts()
      setPosts(res.data || [])
    } catch { setPosts([]) }
    finally { setLoadingPosts(false) }
  }

  const loadStats = async () => {
    try {
      const res: any = await adminAPI.getSocialStats()
      setStats(res.data || {})
    } catch {}
  }

  const loadSettings = async () => {
    try {
      const res: any = await adminAPI.getSocialSettings()
      setSettings(prev => ({ ...prev, ...res.data }))
    } catch {}
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setGeneratedPost(null)
    try {
      const payload: any = { type: postType, platform }
      if (postType === 'rashifal') payload.sign = sign
      if (postType === 'festival') payload.festival = festival
      if (postType === 'upaye') { payload.upayType = upayType; payload.target = upayType.split(' ')[0] }
      if (postType === 'ad') payload.service = service
      if (postType === 'tip') payload.topic = customTopic || 'Aaj ke lucky upay'
      if (postType === 'product') payload.service = service

      const res: any = await adminAPI.generateSocialPost(payload)
      setGeneratedPost(res.data)
      toast.success('Post generate ho gaya! 🎉')
    } catch (err: any) {
      toast.error(err?.error || 'Generation failed')
    } finally { setGenerating(false) }
  }

  const handlePublish = async () => {
    if (!generatedPost) return
    setPublishing(true)
    try {
      const res: any = await adminAPI.publishSocialPost(generatedPost.id)
      toast.success(res.message || 'Published!')
      setGeneratedPost(res.data)
      loadPosts(); loadStats()
    } catch (err: any) {
      toast.error(err?.error || 'Publish failed — token check karo')
    } finally { setPublishing(false) }
  }

  const handleGenerateAllRashifal = async () => {
    setGeneratingAll(true)
    try {
      const res: any = await adminAPI.generateAllRashifal({ platform })
      toast.success(`${res.data?.length || 12} rashifal posts ready!`)
      loadPosts()
    } catch (err: any) {
      toast.error(err?.error || 'Failed')
    } finally { setGeneratingAll(false) }
  }

  const saveSettings = async () => {
    try {
      await adminAPI.saveSocialSettings(settings)
      toast.success('Settings saved! ✅')
    } catch { toast.error('Save failed') }
  }

  const deletePost = async (id: string) => {
    try {
      await adminAPI.deleteSocialPost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Delete failed') }
  }

  const filteredPosts = posts.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (filterType !== 'all' && p.type !== filterType) return false
    return true
  })

  const statusColor: Record<PostStatus, string> = {
    draft: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    published: 'bg-green-500/15 text-green-400 border-green-500/30',
    failed: 'bg-red-500/15 text-red-400 border-red-500/30',
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1 flex items-center gap-3">
            <div className="flex gap-1.5">
              <Instagram className="w-6 h-6 text-pink-400" />
              <Facebook className="w-6 h-6 text-blue-400" />
            </div>
            Social Media <span className="text-shimmer">Automation</span>
          </h1>
          <p className="text-gray-400 text-sm">Gemini AI se posts generate karo — auto Instagram & Facebook pe post</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${settings.autoPost ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
            <div className={`w-2 h-2 rounded-full ${settings.autoPost ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            Auto-post: {settings.autoPost ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id:'generate', icon: Sparkles, label: 'Generate Post' },
          { id:'posts', icon: Globe, label: `All Posts (${posts.length})` },
          { id:'stats', icon: BarChart3, label: 'Stats' },
          { id:'settings', icon: Settings, label: 'Settings' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${tab === t.id ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-saffron' : 'glass text-gray-300 hover:text-white'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ===== GENERATE TAB ===== */}
      {tab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Config */}
          <div className="space-y-5">
            {/* Post type grid */}
            <div className="glass p-5">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Post Type Chuniye</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {POST_TYPES.map(pt => (
                  <button key={pt.value} onClick={() => setPostType(pt.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${postType === pt.value ? 'bg-saffron-500/15 border-saffron-500/40 text-white' : 'border-gold-400/15 text-gray-400 hover:text-white hover:border-gold-400/30 hover:bg-white/5'}`}>
                    <span className="text-xl">{pt.emoji}</span>
                    <div><p className="text-xs font-semibold">{pt.label}</p><p className="text-xs text-gray-500 mt-0.5">{pt.desc}</p></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="glass p-5">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Platform</h3>
              <div className="flex gap-2">
                {([
                  { v:'instagram', icon: Instagram, label:'Instagram', color:'text-pink-400' },
                  { v:'facebook', icon: Facebook, label:'Facebook', color:'text-blue-400' },
                  { v:'both', icon: Globe, label:'Both', color:'text-saffron-400' },
                ] as const).map(p => (
                  <button key={p.v} onClick={() => setPlatform(p.v as Platform)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${platform === p.v ? 'bg-saffron-500/15 border-saffron-500/40 text-white' : 'border-gold-400/15 text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <p.icon className={`w-4 h-4 ${p.color}`} />{p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic options */}
            {postType === 'rashifal' && (
              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Rashi Chuniye</h3>
                <div className="grid grid-cols-4 gap-2">
                  {ZODIAC_SIGNS.map(s => (
                    <button key={s.id} onClick={() => setSign(s.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all ${sign === s.id ? 'bg-saffron-500/20 border-saffron-500/50 text-saffron-400' : 'border-gold-400/15 text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {postType === 'festival' && (
              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Festival</h3>
                <select value={festival} onChange={e => setFestival(e.target.value)} className="input-cosmic">
                  {FESTIVALS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            )}

            {postType === 'upaye' && (
              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Upay Type</h3>
                <select value={upayType} onChange={e => setUpayType(e.target.value)} className="input-cosmic">
                  {UPAY_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            )}

            {(postType === 'ad' || postType === 'product') && (
              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Service / Product</h3>
                <select value={service} onChange={e => setService(e.target.value)} className="input-cosmic">
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {postType === 'tip' && (
              <div className="glass p-5">
                <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-3">Tip Topic (Optional)</h3>
                <input value={customTopic} onChange={e => setCustomTopic(e.target.value)}
                  placeholder="e.g. Monday ke lucky colors, Shani ke upay..." className="input-cosmic" />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button onClick={handleGenerate} disabled={generating}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                {generating ? <><Loader2 className="w-5 h-5 animate-spin" />Generating with Gemini AI...</> : <><Sparkles className="w-5 h-5" />Generate Post</>}
              </button>

              {postType === 'rashifal' && (
                <button onClick={handleGenerateAllRashifal} disabled={generatingAll}
                  className="btn-outline w-full py-2.5 flex items-center justify-center gap-2">
                  {generatingAll ? <><Loader2 className="w-4 h-4 animate-spin" />Generating all 12...</> : <><Star className="w-4 h-4" />Generate All 12 Rashifal</>}
                </button>
              )}
            </div>
          </div>

          {/* Right — Preview */}
          <div>
            {generatedPost ? (
              <div className="glass p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {generatedPost.emoji} Post Preview
                  </h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[generatedPost.status]}`}>
                      {generatedPost.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
                      {generatedPost.type}
                    </span>
                  </div>
                </div>

                {/* Platform badges */}
                <div className="flex gap-2">
                  {(generatedPost.platform === 'instagram' || generatedPost.platform === 'both') && (
                    <span className="flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-1 rounded-full">
                      <Instagram className="w-3 h-3" /> Instagram
                    </span>
                  )}
                  {(generatedPost.platform === 'facebook' || generatedPost.platform === 'both') && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                      <Facebook className="w-3 h-3" /> Facebook
                    </span>
                  )}
                </div>

                {/* Caption */}
                <div className="bg-deep-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Caption</p>
                    <button onClick={() => { navigator.clipboard.writeText(generatedPost.caption); toast.success('Copied!') }}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {generatedPost.caption}
                  </p>
                </div>

                {/* Hashtags */}
                <div>
                  <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">Hashtags ({generatedPost.hashtags.length})</p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {generatedPost.hashtags.map(h => (
                      <span key={h} className="text-xs px-2 py-0.5 bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image prompt */}
                <div className="bg-deep-700/30 rounded-xl p-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Image className="w-3 h-3" /> Image Prompt (Canva/DALL-E ke liye)</p>
                  <p className="text-xs text-gray-300 italic">{generatedPost.imagePrompt}</p>
                </div>

                {/* Result status */}
                {generatedPost.status === 'published' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-1">
                    <p className="text-xs font-semibold text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Published Successfully!</p>
                    {generatedPost.instagramPostId && <p className="text-xs text-gray-400">Instagram ID: {generatedPost.instagramPostId}</p>}
                    {generatedPost.facebookPostId && <p className="text-xs text-gray-400">Facebook ID: {generatedPost.facebookPostId}</p>}
                  </div>
                )}

                {generatedPost.status === 'failed' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Settings mein social media tokens add karo</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button onClick={handlePublish} disabled={publishing || generatedPost.status === 'published'}
                    className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm">
                    {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {generatedPost.status === 'published' ? 'Published ✓' : 'Publish Now'}
                  </button>
                  <button onClick={handleGenerate} disabled={generating} className="btn-outline py-2.5 px-4 flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  💡 Post settings mein Instagram/Facebook tokens add karke auto-publish karein
                </p>
              </div>
            ) : (
              <div className="glass p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="flex gap-3 mb-4">
                  <Instagram className="w-10 h-10 text-pink-400/50" />
                  <Facebook className="w-10 h-10 text-blue-400/50" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Post Generate Karein</h3>
                <p className="text-gray-400 text-sm max-w-xs">Post type chuniye, Gemini AI se caption generate karein, aur seedha Instagram/Facebook pe post karein</p>
                <div className="mt-6 space-y-2 text-left">
                  {['🌟 Rashifal — Daily horoscope post', '🙏 Upay — Remedies & tips', '🎊 Festival — Tyohar greetings', '📢 Ads — Service promotion'].map(item => (
                    <p key={item} className="text-xs text-gray-500">{item}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== POSTS TAB ===== */}
      {tab === 'posts' && (
        <div>
          {/* Filters */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-cosmic w-36 text-sm">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-cosmic w-36 text-sm">
              <option value="all">All Types</option>
              {POST_TYPES.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
            </select>
            <button onClick={loadPosts} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <p className="text-sm text-gray-400 self-center ml-auto">{filteredPosts.length} posts</p>
          </div>

          {loadingPosts ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-saffron-400 mx-auto" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass p-12 text-center">
              <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Koi post nahi mili. Generate karein!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map(post => (
                <div key={post.id} className="glass p-4 hover:border-saffron-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0 mt-0.5">{post.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[post.status]}`}>
                          {post.status === 'published' ? '✓' : post.status === 'failed' ? '✗' : '○'} {post.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">{post.type}</span>
                        {(post.platform === 'instagram' || post.platform === 'both') && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                        {(post.platform === 'facebook' || post.platform === 'both') && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                        {post.sign && <span className="text-xs text-gray-400">{post.sign}</span>}
                        <span className="text-xs text-gray-500 ml-auto">{new Date(post.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">{post.caption}</p>
                      <p className="text-xs text-gray-500 mt-1">{post.hashtags.slice(0,5).join(' ')}...</p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {post.status === 'draft' && (
                        <button onClick={async () => {
                          try {
                            await adminAPI.publishSocialPost(post.id)
                            toast.success('Published!'); loadPosts(); loadStats()
                          } catch { toast.error('Failed') }
                        }} className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors" title="Publish">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => { navigator.clipboard.writeText(post.caption + '\n\n' + post.hashtags.join(' ')); toast.success('Copied!') }}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors" title="Copy">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deletePost(post.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== STATS TAB ===== */}
      {tab === 'stats' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:'Total Posts', value: stats.total || 0, icon: Globe, color:'text-saffron-400', bg:'bg-saffron-500/10' },
              { label:'Instagram', value: stats.instagram || 0, icon: Instagram, color:'text-pink-400', bg:'bg-pink-500/10' },
              { label:'Facebook', value: stats.facebook || 0, icon: Facebook, color:'text-blue-400', bg:'bg-blue-500/10' },
              { label:'Failed', value: stats.failed || 0, icon: XCircle, color:'text-red-400', bg:'bg-red-500/10' },
            ].map(s => (
              <div key={s.label} className="glass p-4">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* By type */}
          {stats.byType && Object.keys(stats.byType).length > 0 && (
            <div className="glass p-5">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Posts by Type</h3>
              <div className="space-y-3">
                {Object.entries(stats.byType).map(([type, count]: any) => {
                  const pt = POST_TYPES.find(p => p.value === type)
                  const pct = stats.total ? Math.round((count/stats.total)*100) : 0
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{pt?.emoji} {pt?.label || type}</span>
                        <span className="text-gray-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-deep-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-saffron-500 to-gold-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Auto schedule info */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">Auto Post Schedule (IST)</h3>
            <div className="space-y-3">
              {[
                { time:'6:00 AM', type:'Festival/Tyohar', icon:'🎊', color:'text-yellow-400', days:'Daily check' },
                { time:'7:00 AM', type:'Daily Rashifal', icon:'🌟', color:'text-saffron-400', days:'Har roz' },
                { time:'8:00 AM', type:'Upay Post', icon:'🙏', color:'text-purple-400', days:'Mangal & Shani' },
                { time:'8:00 AM', type:'Weekly Quote', icon:'✨', color:'text-cyan-400', days:'Sunday only' },
                { time:'12:00 PM', type:'Daily Astro Tip', icon:'💡', color:'text-green-400', days:'Har roz' },
                { time:'7:00 PM', type:'Promotional Ad', icon:'📢', color:'text-pink-400', days:'Har roz' },
              ].map(item => (
                <div key={item.time} className="flex items-center justify-between p-3 bg-deep-700/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${item.color}`}>{item.time}</p>
                      <p className="text-xs text-gray-400">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{item.days}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== SETTINGS TAB ===== */}
      {tab === 'settings' && (
        <div className="max-w-2xl space-y-5">
          {/* Auto post toggle */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">Auto Posting</h3>
                <p className="text-sm text-gray-400 mt-0.5">Automatically post at scheduled times</p>
              </div>
              <button onClick={() => setSettings(prev => ({ ...prev, autoPost: !prev.autoPost }))}
                className={`p-1 rounded-full transition-all ${settings.autoPost ? 'text-green-400' : 'text-gray-500'}`}>
                {settings.autoPost ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>

            {settings.autoPost && (
              <div className="space-y-3 pt-3 border-t border-gold-400/10">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Kaunse posts auto-publish hon:</p>
                {[
                  { key:'postRashifal', label:'Daily Rashifal', emoji:'🌟' },
                  { key:'postTips', label:'Daily Tips', emoji:'💡' },
                  { key:'postAds', label:'Promotional Ads', emoji:'📢' },
                  { key:'postFestivals', label:'Festival Posts', emoji:'🎊' },
                  { key:'postUpaye', label:'Upay Posts', emoji:'🙏' },
                  { key:'postQuotes', label:'Weekly Quotes', emoji:'✨' },
                ].map(opt => (
                  <div key={opt.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{opt.emoji} {opt.label}</span>
                    <button onClick={() => setSettings(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof SocialSettings] }))}
                      className={`text-sm transition-colors ${settings[opt.key as keyof SocialSettings] ? 'text-green-400' : 'text-gray-600'}`}>
                      {settings[opt.key as keyof SocialSettings] ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </button>
                  </div>
                ))}

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Default Platform</label>
                  <select value={settings.defaultPlatform || 'both'} onChange={e => setSettings(prev => ({ ...prev, defaultPlatform: e.target.value as Platform }))} className="input-cosmic">
                    <option value="both">Both (Instagram + Facebook)</option>
                    <option value="instagram">Instagram Only</option>
                    <option value="facebook">Facebook Only</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Instagram settings */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-400" /> Instagram API</h3>
            <p className="text-xs text-gray-400 mb-4">Facebook Developer Console se lo: Graph API Access Token</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Instagram Access Token</label>
                <input type="password" value={settings.instagramToken || ''} onChange={e => setSettings(p => ({ ...p, instagramToken: e.target.value }))}
                  placeholder="EAAxxxxxxxxxxxxxx..." className="input-cosmic" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Instagram User ID (Business Account)</label>
                <input value={settings.igUserId || ''} onChange={e => setSettings(p => ({ ...p, igUserId: e.target.value }))}
                  placeholder="17841400000000000" className="input-cosmic" />
              </div>
            </div>
          </div>

          {/* Facebook settings */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-400" /> Facebook Page API</h3>
            <p className="text-xs text-gray-400 mb-4">Facebook Page Access Token aur Page ID</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Page Access Token</label>
                <input type="password" value={settings.facebookToken || ''} onChange={e => setSettings(p => ({ ...p, facebookToken: e.target.value }))}
                  placeholder="EAAxxxxxxxxxxxxxx..." className="input-cosmic" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Facebook Page ID</label>
                <input value={settings.facebookPageId || ''} onChange={e => setSettings(p => ({ ...p, facebookPageId: e.target.value }))}
                  placeholder="123456789012345" className="input-cosmic" />
              </div>
            </div>
          </div>

          {/* How to get tokens */}
          <div className="glass p-5 border-gold-400/20">
            <h3 className="text-sm font-semibold text-gold-400 mb-3">📋 Token Kaise Milega?</h3>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Facebook Developer Console kholo: <span className="text-saffron-400">developers.facebook.com</span></li>
              <li>New App banao — Business type select karo</li>
              <li>Instagram Basic Display ya Graph API add karo</li>
              <li>Page Access Token generate karo</li>
              <li>Instagram Business Account ko Facebook Page se connect karo</li>
              <li>Instagram User ID: <span className="text-saffron-400">graph.facebook.com/me/accounts</span> se milega</li>
            </ol>
            <div className="mt-3 p-3 bg-saffron-500/5 border border-saffron-500/20 rounded-xl">
              <p className="text-xs text-saffron-400">⚠️ Note: Pehle demo mein bina token ke bhi generate karo aur manually copy-paste karo Instagram pe. Real posting ke liye Business Account chahiye.</p>
            </div>
          </div>

          <button onClick={saveSettings} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> Save All Settings
          </button>
        </div>
      )}
    </div>
  )
}