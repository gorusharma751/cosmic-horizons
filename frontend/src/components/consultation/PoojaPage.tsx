'use client'
import { useState } from 'react'
import { Calendar, CheckCircle, Phone, Star } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore, useUIStore } from '@/store'
import toast from 'react-hot-toast'

const SERVICES = [
  {
    id: '1', name: 'Satyanarayan Katha', category: 'pooja', price: 2100, duration: '3-4 hours',
    image: '🙏', description: 'Ghar mein sukh-shanti aur samridhi ke liye Satyanarayan Bhagwan ki katha. Online live streaming ke saath.',
    benefits: ['Family prosperity', 'Remove obstacles', 'Health & happiness', 'Spiritual blessings'],
    includes: ['Samagri kit delivery', 'Pandit via video call', 'Live pooja streaming', 'Prasad dispatch']
  },
  {
    id: '2', name: 'Rudrabhishek (Shiv Pooja)', category: 'pooja', price: 3100, duration: '2-3 hours',
    image: '🔱', description: 'Lord Shiva ki kripa paane ke liye Rudrabhishek. Bimari, kasht aur greh dosh se mukti.',
    benefits: ['Lord Shiva blessings', 'Health recovery', 'Marital harmony', 'Remove negativity'],
    includes: ['Panchamrit', 'Bilva patra', 'Rudraksha abhishek', 'Mahamrityunjaya jaap']
  },
  {
    id: '3', name: 'Vastu Puja (Home/Office)', category: 'vastu', price: 5100, duration: '4-5 hours',
    image: '🏠', description: 'Naye ghar ya office mein positive energy lane ke liye Vastu Shanti Pooja.',
    benefits: ['Positive energy flow', 'Remove vastu dosh', 'Prosperity & growth', 'Family peace'],
    includes: ['Vastu shastra analysis', 'Griha pravesh muhurat', 'Complete pooja', 'Remedies report']
  },
  {
    id: '4', name: 'Business Mangal Pooja', category: 'business-pooja', price: 7100, duration: '3-4 hours',
    image: '💼', description: 'Naye vyapar ya business expansion ke liye shubh muhurat mein pooja.',
    benefits: ['Business success', 'Partnership harmony', 'Financial growth', 'Market expansion'],
    includes: ['Ganesh pooja', 'Lakshmi pooja', 'Muhurat calculation', 'Prosperity yantra']
  },
  {
    id: '5', name: 'Kaal Sarp Dosh Nivaran', category: 'anusthan', price: 11000, duration: '6-7 hours',
    image: '🐍', description: 'Kaal Sarp Dosh se mukti ke liye Ujjain ya Trimbakeshwar mein pooja.',
    benefits: ['Kaal sarp dosh removal', 'Career progress', 'Marriage obstacles removed', 'Mental peace'],
    includes: ['Pandit at Trimbakeshwar', 'Complete anusthan', 'Video streaming', 'Prasad + report']
  },
  {
    id: '6', name: 'Navgraha Shanti Havan', category: 'havan', price: 8100, duration: '5-6 hours',
    image: '🔥', description: 'Saare nau grahas ko prasann karne ke liye sampoorna Navgraha Shanti Havan.',
    benefits: ['All planet blessings', 'Malefic effects removed', 'Overall prosperity', 'Good health'],
    includes: ['9 kundas havan', 'Complete samagri', 'Pandit team (3)', 'Live streaming']
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'pooja', label: 'Pooja' },
  { id: 'anusthan', label: 'Anusthan' },
  { id: 'vastu', label: 'Vastu' },
  { id: 'havan', label: 'Havan' },
  { id: 'business-pooja', label: 'Business Pooja' },
]

function BookingModal({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) {
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const { isAuthenticated } = useAuthStore()
  const { openLoginModal } = useUIStore()

  const handleBook = () => {
    if (!isAuthenticated) { openLoginModal(); onClose(); return }
    if (!date) { toast.error('Date chuniye'); return }
    toast.success('Booking request bhej di gayi! Hum aapko contact karenge.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h3 className="font-display text-xl text-white mb-1">{service.name}</h3>
        <p className="text-saffron-400 font-bold text-lg mb-4">₹{service.price.toLocaleString()}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Pooja Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-cosmic" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Special Instructions (Optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Koi khaas baat batana ho toh yahan likhein..." className="input-cosmic resize-none" rows={3} />
          </div>

          <div className="glass-card-light p-3 rounded-xl text-xs text-gray-400 space-y-1">
            <p>✅ Booking confirm hone par call aayega</p>
            <p>✅ 24 ghante pehle cancel kar sakte hain</p>
            <p>✅ Live streaming link WhatsApp pe milega</p>
          </div>

          <button onClick={handleBook} className="btn-primary w-full">Book This Pooja</button>
        </div>
      </div>
    </div>
  )
}

export default function PoojaPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [bookingService, setBookingService] = useState<typeof SERVICES[0] | null>(null)

  const filtered = SERVICES.filter(s => selectedCategory === 'all' || s.category === selectedCategory)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
            Online <span className="text-shimmer">Pooja & Services</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Ghar baithe karvaaiye puja — certified pandits ke saath live streaming
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                selectedCategory === cat.id ? 'bg-saffron-gradient text-white' : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div key={service.id} className="glass-card overflow-hidden hover:border-saffron-500/30 hover:shadow-saffron transition-all duration-300 group">
              <div className="p-6 text-center bg-gradient-to-b from-saffron-500/5 to-transparent">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{service.image}</div>
                <span className="text-xs bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 px-2 py-0.5 rounded-full capitalize">{service.category}</span>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white text-lg mb-2">{service.name}</h3>
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{service.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span>⏱️ {service.duration}</span>
                  <span>•</span>
                  <span>📺 Live streaming</span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {service.includes.slice(0, 3).map(inc => (
                    <div key={inc} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {inc}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gold-400/10">
                  <span className="text-xl font-bold text-saffron-400">₹{service.price.toLocaleString()}</span>
                  <button
                    onClick={() => setBookingService(service)}
                    className="flex items-center gap-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:shadow-saffron transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div className="mt-12 glass-card p-6">
          <h3 className="font-display text-2xl text-white text-center mb-6">Kyun Chunein Hamaari Pooja?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🕉️', title: 'Vedic Tradition', desc: 'Ancient rituals followed properly' },
              { icon: '📺', title: 'Live Streaming', desc: 'Watch your pooja live' },
              { icon: '✅', title: 'Certified Pandits', desc: 'Experienced & verified' },
              { icon: '🚚', title: 'Prasad Delivery', desc: 'Prasad your doorstep pe' },
            ].map(item => (
              <div key={item.title}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact for custom */}
        <div className="mt-6 glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Custom Pooja chahiye?</p>
            <p className="text-sm text-gray-400">Havan, Anusthan ya any special pooja ke liye call karein</p>
          </div>
          <a href="tel:+919876543210" className="btn-outline flex items-center gap-2 whitespace-nowrap">
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      </div>

      {bookingService && <BookingModal service={bookingService} onClose={() => setBookingService(null)} />}
    </div>
  )
}
