'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ZODIAC_SIGNS } from '@/types'

export default function ZodiacSection() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
            Apni <span className="text-shimmer">Rashi</span> Chuniye
          </h2>
          <p className="text-gray-400">Select your zodiac sign to get your personalized horoscope</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {ZODIAC_SIGNS.map((sign) => (
            <Link
              key={sign.id}
              href={`/horoscope/${sign.id}`}
              className={`zodiac-card transition-all duration-300 ${
                hovered === sign.id ? 'border-gold-400/50 -translate-y-2 shadow-gold' : ''
              }`}
              onMouseEnter={() => setHovered(sign.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`text-2xl mb-1 transition-transform duration-300 ${hovered === sign.id ? 'scale-125' : ''}`}>
                {sign.symbol}
              </div>
              <p className="text-xs font-semibold text-white">{sign.name}</p>
              <p className="text-xs text-gray-500">{sign.english}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/horoscope" className="text-sm text-saffron-400 hover:text-saffron-300 underline underline-offset-4">
            View all horoscopes →
          </Link>
        </div>
      </div>
    </section>
  )
}
