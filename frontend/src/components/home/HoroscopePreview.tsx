'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import { ZODIAC_SIGNS } from '@/types'

const MOCK_HOROSCOPE: Record<string, string> = {
  aries: 'Aaj ka din aapke liye bahut shubh hai. Career mein nayi opportunities milne ki sambhavana hai. Prem sambandh mein mithur...',
  taurus: 'Aarthik stithi majboot hogi. Kisi purane dost se mulakat ho sakti hai. Swasthya ka khayal rakhein...',
  gemini: 'Vyapar mein labh milega. Parivaar mein khushi ka vatavaran rahega. Aaj koi naya kadam uthane se pehle sochein...',
  cancer: 'Aantar maan ki suno. Aaj kuch aise kaam kar sakte ho jo pehle ruk gaye the. Pyaar mein naya rang aayega...',
  leo: 'Aaj aap mein ek naya josh dikh raha hai. Apni shaktiyon par vishwas rakho. Dhan labh ki sambhavana hai...',
  virgo: 'Aaj thoda aram karo aur apni sehat ka dhyaan rakho. Ghar mein koi khushi ki khabar aa sakti hai...',
  libra: 'Rishton mein madhurta aayegi. Karya kshetra mein tarrakki ke sanket hain. Shaam ko kuch creative karo...',
  scorpio: 'Aaj ka din chamatkari hai. Aap jo sochen wo pura ho sakta hai. Apni aadat badalne ka achha samay hai...',
  sagittarius: 'Yatra ya safar ho sakta hai. Naye mitron se mulakat hogi. Paisa lagane ka sahi samay hai...',
  capricorn: 'Mehnat rang laayegi aaj. Senior log aapki tarif karenge. Swasthya mein sudhar aayega...',
  aquarius: 'Aaj kuch alag karne ka mann karega. Naye ideas aayenge. Prem mein kuch special ghata ho sakta hai...',
  pisces: 'Aaj aatmik shanti milegi. Dhyan aur meditation se faayda hoga. Arthik mamlon mein savdhaan rahein...',
}

export default function HoroscopePreview() {
  const [selectedSign, setSelectedSign] = useState('aries')
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const sign = ZODIAC_SIGNS.find(s => s.id === selectedSign)

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              Aaj Ka <span className="text-shimmer">Rashifal</span>
            </h2>
            <p className="text-gray-400">Daily horoscope for all 12 zodiac signs</p>
          </div>
          <Link href="/horoscope" className="hidden md:flex items-center gap-2 text-saffron-400 text-sm">
            All Horoscopes <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sign selector */}
          <div className="glass-card p-4">
            <div className="grid grid-cols-4 gap-2">
              {ZODIAC_SIGNS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSign(s.id)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                    selectedSign === s.id
                      ? 'bg-saffron-500/20 border border-saffron-500/40'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{s.symbol}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horoscope content */}
          <div className="lg:col-span-2 glass-card p-6">
            {/* Type selector */}
            <div className="flex gap-2 mb-6">
              {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-saffron-500 text-white'
                      : 'glass-card text-gray-400 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Sign info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center text-3xl">
                {sign?.symbol}
              </div>
              <div>
                <h3 className="font-display text-2xl text-white">{sign?.name}</h3>
                <p className="text-gray-400 text-sm">{sign?.english} • {sign?.date}</p>
              </div>
            </div>

            {/* Prediction */}
            <p className="text-gray-300 leading-relaxed mb-6 font-devanagari">
              {MOCK_HOROSCOPE[selectedSign]}
            </p>

            {/* Lucky factors */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Lucky Color', value: 'Red', icon: '🔴' },
                { label: 'Lucky Number', value: '7', icon: '7️⃣' },
                { label: 'Lucky Day', value: 'Tuesday', icon: '📅' },
              ].map((item) => (
                <div key={item.label} className="glass-card-light p-3 text-center rounded-xl">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/horoscope/${selectedSign}`}
                className="btn-primary text-sm py-2 px-5 flex-1 text-center"
              >
                Read Full Horoscope
              </Link>
              <Link
                href="/consultation"
                className="btn-outline text-sm py-2 px-5"
              >
                Talk to Pandit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
