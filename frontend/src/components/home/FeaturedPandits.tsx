'use client'
import { panditAPI } from '@/lib/api'
import { Pandit } from '@/types'
import { ChevronRight, MessageCircle, Phone, Star, Video, Wifi } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Mock data for development
const MOCK_PANDITS: Pandit[] = [
  {
    id: '1', userId: 'u1', name: 'Pt. Rajesh Sharma', avatar: '',
    expertise: ['Kundli', 'Numerology', 'Vastu'], languages: ['Hindi', 'English'],
    experience: 15, rating: 4.9, totalConsultations: 12450, reviewCount: 3200,
    callRate: 35, chatRate: 20, videoRate: 80, isOnline: true, isLive: false,
    bio: 'Expert in Vedic Astrology with 15 years experience.',
    education: 'M.A. Jyotish Shastra', certifications: ['ICAS Certified'],
    about: 'Specializes in career, marriage and business consultations.',
    followersCount: 45000
  },
  {
    id: '2', userId: 'u2', name: 'Acharya Deepak Mishra', avatar: '',
    expertise: ['Palmistry', 'Tarot', 'Lal Kitab'], languages: ['Hindi', 'Bengali'],
    experience: 10, rating: 4.8, totalConsultations: 8900, reviewCount: 2100,
    callRate: 28, chatRate: 18, videoRate: 65, isOnline: true, isLive: true,
    bio: 'Tarot expert and palm reader from Varanasi.',
    education: 'B.A. Sanskrit', certifications: [],
    about: 'Known for accurate predictions about love and marriage.',
    followersCount: 28000
  },
  {
    id: '3', userId: 'u3', name: 'Pt. Suresh Trivedi', avatar: '',
    expertise: ['Vastu Shastra', 'Feng Shui', 'Kundli'], languages: ['Hindi', 'Gujarati'],
    experience: 20, rating: 4.7, totalConsultations: 18200, reviewCount: 5100,
    callRate: 45, chatRate: 25, videoRate: 100, isOnline: false, isLive: false,
    bio: 'Senior Vastu expert with corporate clients.',
    education: 'Ph.D. Vastu Shastra', certifications: ['IVSC Certified'],
    about: 'Helped 500+ businesses with vastu remedies.',
    followersCount: 62000, nextAvailable: '2:00 PM'
  },
  {
    id: '4', userId: 'u4', name: 'Jyotishacharya Priya Devi', avatar: '',
    expertise: ['Love & Relationships', 'Career', 'Remedies'], languages: ['Hindi', 'English', 'Tamil'],
    experience: 8, rating: 4.9, totalConsultations: 6700, reviewCount: 1800,
    callRate: 30, chatRate: 22, videoRate: 70, isOnline: true, isLive: false,
    bio: 'Specialist in relationship astrology and remedies.',
    education: 'M.A. Sanskrit', certifications: [],
    about: 'Expert in love, marriage compatibility and career guidance.',
    followersCount: 35000
  },
]

function PanditCard({ pandit }: { pandit: Pandit }) {
  const initials = pandit.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="glass-card p-5 hover:border-saffron-500/30 hover:shadow-saffron transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-lg">
            {initials}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-deep-800 ${pandit.isOnline ? 'bg-green-400' : 'bg-gray-500'}`} />
          {pandit.isLive && (
            <div className="absolute -top-1 -right-1 live-badge text-xs px-1 py-0">
              LIVE
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{pandit.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
            <span className="text-gold-400 text-xs font-semibold">{pandit.rating}</span>
            <span className="text-gray-500 text-xs">({pandit.reviewCount.toLocaleString()})</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{pandit.experience} yrs exp</p>
        </div>
      </div>

      {/* Expertise */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {pandit.expertise.slice(0, 3).map(exp => (
          <span key={exp} className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
            {exp}
          </span>
        ))}
      </div>

      {/* Languages */}
      <p className="text-xs text-gray-500 mb-3">
        🗣️ {pandit.languages.join(', ')}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <span>{pandit.totalConsultations.toLocaleString()}+ consultations</span>
        {pandit.isOnline ? (
          <span className="flex items-center gap-1 text-green-400">
            <Wifi className="w-3 h-3" /> Online
          </span>
        ) : (
          <span className="text-gray-500">Next: {pandit.nextAvailable}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Link
          href={`/consultation/call?pandit=${pandit.id}`}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-saffron-500/10 border border-saffron-500/20 hover:bg-saffron-500/20 transition-colors group"
        >
          <Phone className="w-4 h-4 text-saffron-400" />
          <span className="text-xs text-saffron-400">₹{pandit.callRate}/m</span>
        </Link>
        <Link
          href={`/consultation/chat?pandit=${pandit.id}`}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-400">₹{pandit.chatRate}/m</span>
        </Link>
        <Link
          href={`/consultation/video?pandit=${pandit.id}`}
          className="flex flex-col items-center gap-1 p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors"
        >
          <Video className="w-4 h-4 text-teal-400" />
          <span className="text-xs text-teal-400">₹{pandit.videoRate}/m</span>
        </Link>
      </div>
    </div>
  )
}

export default function FeaturedPandits() {
  const [pandits, setPandits] = useState<Pandit[]>(MOCK_PANDITS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPandits = async () => {
      try {
        setLoading(true)
        const response: any = await panditAPI.getFeatured()
        if (response?.success && response.data) {
          setPandits(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch featured pandits:', error)
        setPandits(MOCK_PANDITS)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPandits()
  }, [])

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              Expert <span className="text-shimmer">Pandits</span>
            </h2>
            <p className="text-gray-400">Certified astrologers available 24/7 for your guidance</p>
          </div>
          <Link href="/pandits" className="hidden md:flex items-center gap-2 text-saffron-400 hover:text-saffron-300 text-sm font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pandit grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pandits.map((pandit: Pandit) => (
            <PanditCard key={pandit.id} pandit={pandit} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/pandits" className="btn-outline inline-flex items-center gap-2">
            View All Pandits <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
