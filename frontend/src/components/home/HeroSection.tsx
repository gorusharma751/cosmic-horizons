'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, MessageCircle, Video, Star, ChevronRight, Play, Sparkles } from 'lucide-react'
import { useUIStore } from '@/store'

const CONSULTATION_TYPES = [
  { icon: Phone, label: 'Call Consultation', desc: 'Live voice guidance', href: '/consultation/call', color: 'from-saffron-500 to-gold-500' },
  { icon: MessageCircle, label: 'Chat Consultation', desc: 'Text with experts', href: '/consultation/chat', color: 'from-purple-600 to-cosmic-pink' },
  { icon: Video, label: 'Video Session', desc: 'Face-to-face guidance', href: '/consultation/video', color: 'from-teal-500 to-cyan-500' },
]

const MARQUEE_TEXTS = [
  '✨ 500+ Expert Pandits Online',
  '🔮 1 Crore+ Consultations Done',
  '⭐ 4.8 Star Rating',
  '🕉️ 24/7 Available',
  '💎 Certified Astrologers',
  '🌟 Free Kundli Available',
]

export default function HeroSection() {
  const { openLoginModal } = useUIStore()
  const [currentText, setCurrentText] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % MARQUEE_TEXTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20">
      {/* Cosmic orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-400/3 rounded-full blur-2xl animate-float" />
        {/* Mandala ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold-400/5 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-saffron-500/3 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm text-gold-300">
          <Sparkles className="w-4 h-4 text-saffron-400" />
          <span>India's #1 Astrology Platform</span>
          <Sparkles className="w-4 h-4 text-saffron-400" />
        </div>

        {/* Main heading */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          <span className="block text-white">Apna Bhavishya</span>
          <span className="block text-shimmer">Janiye Abhi</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-3 font-devanagari">
          देश के सर्वश्रेष्ठ ज्योतिषाचार्यों से पाएं सटीक भविष्यवाणी
        </p>
        <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10">
          Get accurate astrology guidance from certified pandits. Kundli, horoscope, vastu & spiritual services — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/consultation" className="btn-primary flex items-center gap-2 text-base py-3 px-8">
            <Phone className="w-5 h-5" />
            Talk to Pandit Now
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/kundli/free" className="btn-outline flex items-center gap-2 text-base py-3 px-8">
            <Star className="w-5 h-5" />
            Free Kundli
          </Link>
        </div>

        {/* Consultation type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {CONSULTATION_TYPES.map((type) => (
            <Link
              key={type.href}
              href={type.href}
              className="consult-card group text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <type.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-white text-sm">{type.label}</p>
              <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
            </Link>
          ))}
        </div>

        {/* Animated marquee text */}
        <div className="overflow-hidden">
          <div className="flex gap-8 text-sm text-gray-500 justify-center">
            {MARQUEE_TEXTS.map((text, i) => (
              <span
                key={text}
                className={`transition-all duration-500 ${i === currentText ? 'text-gold-400 scale-110' : ''}`}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-400/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
