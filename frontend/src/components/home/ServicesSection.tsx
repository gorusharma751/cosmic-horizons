'use client'
import Link from 'next/link'
import { Phone, MessageCircle, Video, BookOpen, Heart, Home, ShoppingBag, Sun, Sparkles, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    icon: Phone,
    title: 'Call Consultation',
    desc: 'Talk directly with expert pandits. Get instant voice guidance on your problems.',
    href: '/consultation/call',
    color: 'from-saffron-500 to-orange-500',
    price: 'From ₹15/min',
    tag: 'Most Popular'
  },
  {
    icon: MessageCircle,
    title: 'Chat Consultation',
    desc: 'Text chat with astrologers anytime. Save & revisit your reading later.',
    href: '/consultation/chat',
    color: 'from-purple-500 to-indigo-500',
    price: 'From ₹10/min',
    tag: null
  },
  {
    icon: Video,
    title: 'Video Session',
    desc: 'Face-to-face consultation with pandit. See charts live on screen.',
    href: '/consultation/video',
    color: 'from-teal-500 to-cyan-500',
    price: 'From ₹50/min',
    tag: 'Premium'
  },
  {
    icon: Sun,
    title: 'Live Sessions',
    desc: 'Watch pandits live. Ask questions, get answers in real time.',
    href: '/live',
    color: 'from-red-500 to-rose-500',
    price: 'Free to Watch',
    tag: 'Live Now'
  },
  {
    icon: BookOpen,
    title: 'Kundli & Reports',
    desc: 'AI-powered detailed birth chart with full predictions & remedies.',
    href: '/kundli',
    color: 'from-amber-500 to-yellow-500',
    price: 'From ₹99',
    tag: null
  },
  {
    icon: Heart,
    title: 'Kundli Matching',
    desc: '36-gun compatibility analysis for perfect marriage matching.',
    href: '/kundli/matching',
    color: 'from-pink-500 to-rose-400',
    price: 'From ₹199',
    tag: null
  },
  {
    icon: Home,
    title: 'Vastu & Pooja',
    desc: 'Online pooja booking, vastu consultation, havan & anusthan services.',
    href: '/pooja',
    color: 'from-green-500 to-emerald-500',
    price: 'From ₹501',
    tag: null
  },
  {
    icon: ShoppingBag,
    title: 'Spiritual Shop',
    desc: 'Certified gemstones, rudraksha, yantra, mala & pooja samagri.',
    href: '/shop',
    color: 'from-blue-500 to-cyan-400',
    price: 'Shop Now',
    tag: null
  },
]

export default function ServicesSection() {
  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 text-sm text-gold-300">
            <Sparkles className="w-4 h-4 text-saffron-400" />
            Our Services
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
            Har Samasya Ka <span className="text-shimmer">Samadhan</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From personal guidance to spiritual healing — everything you need on one platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="glass-card p-5 group hover:border-saffron-500/30 hover:shadow-saffron transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {service.tag && (
                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                  service.tag === 'Live Now' ? 'bg-red-500 text-white animate-pulse' :
                  service.tag === 'Most Popular' ? 'bg-saffron-500 text-white' :
                  'bg-gold-500/20 text-gold-400 border border-gold-400/30'
                }`}>
                  {service.tag}
                </span>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">{service.desc}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-saffron-400">{service.price}</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-saffron-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
