'use client'
import { useAuthStore, useUIStore } from '@/store'
import { Pandit } from '@/types'
import { MessageCircle, Phone, Search, SlidersHorizontal, Star, Video } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const EXPERTISE_FILTERS = ['All', 'Kundli', 'Numerology', 'Tarot', 'Vastu', 'Palmistry', 'Lal Kitab', 'Prashna', 'Nadi']
const LANGUAGE_FILTERS = ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Marathi']
const SORT_OPTIONS = ['Most Popular', 'Highest Rated', 'Lowest Price', 'Most Experienced', 'Online First']

const MOCK_PANDITS: Pandit[] = [
  { id: '1', userId: 'u1', name: 'Pt. Rajesh Sharma', avatar: '', expertise: ['Kundli', 'Numerology', 'Vastu'], languages: ['Hindi', 'English'], experience: 15, rating: 4.9, totalConsultations: 12450, reviewCount: 3200, callRate: 35, chatRate: 20, videoRate: 80, isOnline: true, isLive: false, bio: 'Expert in Vedic Astrology', education: 'M.A. Jyotish', certifications: ['ICAS'], about: 'Career, marriage & business', followersCount: 45000 },
  { id: '2', userId: 'u2', name: 'Acharya Deepak Mishra', avatar: '', expertise: ['Palmistry', 'Tarot', 'Lal Kitab'], languages: ['Hindi', 'Bengali'], experience: 10, rating: 4.8, totalConsultations: 8900, reviewCount: 2100, callRate: 28, chatRate: 18, videoRate: 65, isOnline: true, isLive: true, bio: 'Tarot & palm reader', education: 'B.A. Sanskrit', certifications: [], about: 'Love & marriage expert', followersCount: 28000 },
  { id: '3', userId: 'u3', name: 'Pt. Suresh Trivedi', avatar: '', expertise: ['Vastu Shastra', 'Feng Shui', 'Kundli'], languages: ['Hindi', 'Gujarati'], experience: 20, rating: 4.7, totalConsultations: 18200, reviewCount: 5100, callRate: 45, chatRate: 25, videoRate: 100, isOnline: false, isLive: false, bio: 'Senior Vastu expert', education: 'Ph.D. Vastu', certifications: ['IVSC'], about: 'Business vastu', followersCount: 62000, nextAvailable: '2:00 PM' },
  { id: '4', userId: 'u4', name: 'Jyotishacharya Priya Devi', avatar: '', expertise: ['Love', 'Career', 'Remedies'], languages: ['Hindi', 'English', 'Tamil'], experience: 8, rating: 4.9, totalConsultations: 6700, reviewCount: 1800, callRate: 30, chatRate: 22, videoRate: 70, isOnline: true, isLive: false, bio: 'Relationship specialist', education: 'M.A. Sanskrit', certifications: [], about: 'Love & career guidance', followersCount: 35000 },
  { id: '5', userId: 'u5', name: 'Pandit Vijay Kumar', avatar: '', expertise: ['Nadi Astrology', 'Prashna', 'Kundli'], languages: ['Tamil', 'Telugu', 'English'], experience: 25, rating: 4.8, totalConsultations: 22000, reviewCount: 6500, callRate: 55, chatRate: 30, videoRate: 120, isOnline: true, isLive: false, bio: 'Nadi astrology master', education: 'Jyotish Alankar', certifications: ['BVSS'], about: 'Ancient palm leaf reading', followersCount: 80000 },
  { id: '6', userId: 'u6', name: 'Aacharya Neha Sharma', avatar: '', expertise: ['Tarot', 'Numerology', 'Angel Cards'], languages: ['Hindi', 'English'], experience: 6, rating: 4.7, totalConsultations: 4200, reviewCount: 980, callRate: 25, chatRate: 15, videoRate: 60, isOnline: true, isLive: false, bio: 'Tarot & numerology expert', education: 'Tarot Certified', certifications: [], about: 'Future prediction specialist', followersCount: 18000 },
]

function PanditListCard({ pandit, type }: { pandit: Pandit; type: 'call' | 'chat' | 'video' }) {
  const { isAuthenticated } = useAuthStore()
  const { openLoginModal } = useUIStore()
  const initials = pandit.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const rate = type === 'call' ? pandit.callRate : type === 'chat' ? pandit.chatRate : pandit.videoRate
  const icon = type === 'call' ? Phone : type === 'chat' ? MessageCircle : Video
  const Icon = icon

  const handleConsult = () => {
    if (!isAuthenticated) { openLoginModal(); return }
  }

  return (
    <div className="glass-card p-5 flex flex-col sm:flex-row gap-4 hover:border-saffron-500/30 transition-all duration-300">
      {/* Avatar */}
      <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-1">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-xl">
            {initials}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-deep-800 ${pandit.isOnline ? 'bg-green-400' : 'bg-gray-500'}`} />
          {pandit.isLive && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">LIVE</span>
          )}
        </div>
        <div className="sm:text-center">
          <div className={`text-xs font-medium ${pandit.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
            {pandit.isOnline ? '● Online' : `Next: ${pandit.nextAvailable}`}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-white text-lg">{pandit.name}</h3>
            <p className="text-sm text-gray-400">{pandit.expertise.join(' • ')}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span className="text-gold-400 font-semibold">{pandit.rating}</span>
            <span className="text-gray-500 text-sm">({pandit.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-400">🗣️ {pandit.languages.join(', ')}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">⏳ {pandit.experience} yrs exp</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">📞 {pandit.totalConsultations.toLocaleString()}+ consultations</span>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-1">{pandit.about}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pandit.expertise.map(exp => (
            <span key={exp} className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
              {exp}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs text-gray-500">Rate</p>
          <p className="text-saffron-400 font-bold text-lg">₹{rate}/min</p>
        </div>
        <Link
          href={`/consultation/${type}?pandit=${pandit.id}`}
          onClick={!isAuthenticated ? (e) => { e.preventDefault(); openLoginModal() } : undefined}
          className="flex items-center gap-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-saffron transition-all hover:scale-105 whitespace-nowrap text-sm"
        >
          <Icon className="w-4 h-4" />
          {type === 'call' ? 'Call Now' : type === 'chat' ? 'Chat Now' : 'Video Call'}
        </Link>
        <Link href={`/pandit/${pandit.id}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default function ConsultationPage() {
  const [activeType, setActiveType] = useState<'call' | 'chat' | 'video'>('call')
  const [selectedExpertise, setSelectedExpertise] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [sort, setSort] = useState('Most Popular')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = MOCK_PANDITS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))) return false
    if (selectedExpertise !== 'All' && !p.expertise.includes(selectedExpertise)) return false
    if (selectedLanguage !== 'All' && !p.languages.includes(selectedLanguage)) return false
    return true
  })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
            Talk to an <span className="text-shimmer">Expert Pandit</span>
          </h1>
          <p className="text-gray-400">{filtered.length} pandits available right now</p>
        </div>

        {/* Consultation type tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {([
            { type: 'call', icon: Phone, label: 'Voice Call', count: MOCK_PANDITS.filter(p => p.isOnline).length },
            { type: 'chat', icon: MessageCircle, label: 'Chat', count: MOCK_PANDITS.filter(p => p.isOnline).length },
            { type: 'video', icon: Video, label: 'Video Call', count: Math.floor(MOCK_PANDITS.length / 2) },
          ] as const).map(({ type, icon: Icon, label, count }) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium whitespace-nowrap transition-all ${
                activeType === type
                  ? 'bg-saffron-gradient text-white shadow-saffron'
                  : 'glass-card text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeType === type ? 'bg-white/20' : 'bg-white/10'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or expertise..."
              className="input-cosmic pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 glass-card rounded-xl text-sm font-medium transition-all ${showFilters ? 'border-saffron-500/50 text-saffron-400' : 'text-gray-400 hover:text-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="glass-card p-5 mb-5 space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_FILTERS.map(exp => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExpertise(exp)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedExpertise === exp ? 'bg-saffron-500 text-white' : 'glass-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">Language</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_FILTERS.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedLanguage === lang ? 'bg-saffron-500 text-white' : 'glass-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2 font-medium">Sort by</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      sort === s ? 'bg-saffron-500 text-white' : 'glass-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pandit list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Koi pandit nahi mila. Filters change karein.</p>
            </div>
          ) : (
            filtered.map(pandit => (
              <PanditListCard key={pandit.id} pandit={pandit} type={activeType} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
