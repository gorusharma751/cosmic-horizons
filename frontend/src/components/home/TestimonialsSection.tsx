'use client'
import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', location: 'Delhi', rating: 5, text: 'Pt. Rajesh ne meri kundli dekh ke jo bataya, wo sab sach nikla. Career mein jo problem tha, uska perfect solution mila. Bahut grateful hoon!', service: 'Kundli Reading', avatar: 'PS' },
  { id: 2, name: 'Rahul Gupta', location: 'Mumbai', rating: 5, text: 'Maine yahan se gemstone liya aur 3 mahine mein business mein itna faayda hua jo pehle kabhi nahi hua. Amazing experience!', service: 'Gemstone Consultation', avatar: 'RG' },
  { id: 3, name: 'Sunita Devi', location: 'Varanasi', rating: 5, text: 'Online pooja booking ne meri zindagi badal di. Mere ghar mein sukh-shanti aai hai. Pandits bahut knowledgeable hain.', service: 'Online Pooja', avatar: 'SD' },
  { id: 4, name: 'Amit Verma', location: 'Jaipur', rating: 4, text: 'Kundli Milan se hamari shaadi ki date fix hui. Ab 5 saal ho gaye, bahut khush hain. Thank you Cosmic Horizons!', service: 'Kundli Matching', avatar: 'AV' },
  { id: 5, name: 'Meena Joshi', location: 'Pune', rating: 5, text: 'Vastu consultation se mere office ki energy completely badal gayi. Business 40% grow kiya ek saal mein. Incredible!', service: 'Vastu Consultation', avatar: 'MJ' },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length)

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
            Hamare <span className="text-shimmer">Khush Grahak</span>
          </h2>
          <p className="text-gray-400">Real experiences from real people</p>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="glass-card p-8 text-center relative">
            <Quote className="w-10 h-10 text-saffron-500/30 absolute top-6 left-6" />
            <div className="flex justify-center mb-1">
              {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
              ))}
            </div>
            <p className="text-gray-200 text-lg leading-relaxed italic mb-6 font-devanagari">
              "{TESTIMONIALS[current].text}"
            </p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-saffron-gradient flex items-center justify-center text-white font-bold">
                {TESTIMONIALS[current].avatar}
              </div>
              <p className="font-semibold text-white">{TESTIMONIALS[current].name}</p>
              <p className="text-sm text-gray-400">{TESTIMONIALS[current].location}</p>
              <span className="text-xs bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 px-3 py-0.5 rounded-full">
                {TESTIMONIALS[current].service}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 glass-card flex items-center justify-center hover:border-saffron-500/30 transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-8 h-2 bg-saffron-500' : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 glass-card flex items-center justify-center hover:border-saffron-500/30 transition-all">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.filter((_, i) => i !== current).slice(0, 3).map((t) => (
            <div key={t.id} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-saffron-gradient flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <div className="flex">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
