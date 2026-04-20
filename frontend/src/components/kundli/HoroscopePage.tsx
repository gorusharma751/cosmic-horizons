'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, Calendar, ChevronRight } from 'lucide-react'
import { ZODIAC_SIGNS } from '@/types'

const PREDICTIONS: Record<string, string> = {
  aries: 'Aaj ka din aapke liye naye avsar lekar aaya hai. Career mein kuch nayi zimmedariyan milne ki sambhavana hai. Prem jeevan mein mithas aayegi. Sehat ka khayal rakhein aur rozana vyayam karein. Dhan labh ki sambhavana hai.',
  taurus: 'Aarthik stithi mein sudhar hoga. Kisi purane dost se mulakat ho sakti hai jo bahut khushi laayegi. Gharelu mamlon mein shanti ka vatavaran rahega. Nayi yojnaon par kaam shuru karne ka acha samay hai.',
  gemini: 'Vyapar mein labh milega aur aapke acha kaam ki tarif hogi. Parivaar mein khushi ka mahaul rahega. Aaj kuch creative karo — music, art ya writing. Meditation aapko focus rakhegi.',
  cancer: 'Aaj apni antaatma ki suno. Kuch aise kaam kar sakte ho jo pehle ruk gaye the. Pyaar mein naya rang aayega aur saathi ke saath kuch khaas time bitao. Career mein ek naya mod aa sakta hai.',
  leo: 'Aaj aap mein ek naya josh aur energy dikh rahi hai. Apni shaktiyon par vishwas rakho — aap kuch bhi achieve kar sakte ho. Dhan labh ki sambhavana hai. Seniors ki baat dhyan se suno.',
  virgo: 'Thoda aram karo aur apni sehat ka dhyaan rakho. Ghar mein koi khushi ki khabar aa sakti hai. Professional life mein ek nayi shuruaat hone wali hai. Apni creativity ko kaam mein lagao.',
  libra: 'Rishton mein madhurta aayegi aur koi purana dost vaapas aa sakta hai. Karya kshetra mein tarrakki ke sanket hain. Koi bada nirnay lene se pehle soch-samajh kar faisla karo.',
  scorpio: 'Aaj ka din aapke liye bahut khaas hai. Aap jo bhi sochen wo pura hone ki sambhavana hai. Naye avsar aayenge. Sehat ki taraf dhyan do. Paisa bachane ki koshish karo.',
  sagittarius: 'Kisi nayi jagah jaane ya safar karne ka plan ban sakta hai. Naye mitron se mulakat hogi jo life ko better banayenge. Paisa lagane ka sahi samay hai lekin jaldi mat karo.',
  capricorn: 'Aaj ki mehnat kal rang laayegi. Office mein aapki skills ki tarif hogi. Ghar mein kuch nayi cheez khareedne ka plan ban sakta hai. Swasthya mein thoda dhyan do.',
  aquarius: 'Aaj kuch alag karne ka mann karega. Naye ideas aur creative thoughts aayenge. Prem mein kuch acha ghata ho sakta hai. Dost ke saath waqt bitao, accha lagega.',
  pisces: 'Aaj aatmik shanti aur sukoon milega. Dhyan aur meditation se bahut faayda hoga. Arthik mamlon mein savdhaan rahein. Koi naya skill seekhne ka plan banao.'
}

const LUCKY_DATA: Record<string, { color: string; number: number; day: string; stone: string }> = {
  aries: { color: 'Red', number: 9, day: 'Tuesday', stone: 'Ruby' },
  taurus: { color: 'Green', number: 6, day: 'Friday', stone: 'Emerald' },
  gemini: { color: 'Yellow', number: 5, day: 'Wednesday', stone: 'Citrine' },
  cancer: { color: 'White', number: 2, day: 'Monday', stone: 'Pearl' },
  leo: { color: 'Golden', number: 1, day: 'Sunday', stone: 'Ruby' },
  virgo: { color: 'Brown', number: 5, day: 'Wednesday', stone: 'Peridot' },
  libra: { color: 'Pink', number: 6, day: 'Friday', stone: 'Diamond' },
  scorpio: { color: 'Dark Red', number: 8, day: 'Tuesday', stone: 'Red Coral' },
  sagittarius: { color: 'Purple', number: 3, day: 'Thursday', stone: 'Yellow Sapphire' },
  capricorn: { color: 'Black', number: 8, day: 'Saturday', stone: 'Blue Sapphire' },
  aquarius: { color: 'Blue', number: 4, day: 'Saturday', stone: 'Blue Sapphire' },
  pisces: { color: 'Sea Green', number: 3, day: 'Thursday', stone: 'Yellow Sapphire' },
}

export default function HoroscopePage() {
  const [selected, setSelected] = useState('aries')
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const sign = ZODIAC_SIGNS.find(s => s.id === selected)!
  const lucky = LUCKY_DATA[selected]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
            <span className="text-shimmer">Rashifal</span> — Horoscope
          </h1>
          <p className="text-gray-400">Apni rashi chuniye aur jaaniye aaj ka bhavishya</p>
        </div>

        {/* Type selector */}
        <div className="flex gap-3 justify-center mb-8">
          {(['daily', 'weekly', 'monthly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                type === t ? 'bg-saffron-gradient text-white shadow-saffron' : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Zodiac selector */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-gold-400 mb-3 uppercase tracking-wider">Select Sign</h3>
            <div className="space-y-1">
              {ZODIAC_SIGNS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    selected === s.id ? 'bg-saffron-500/15 border border-saffron-500/30' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl w-6 text-center">{s.symbol}</span>
                  <div>
                    <p className={`text-sm font-medium ${selected === s.id ? 'text-saffron-400' : 'text-white'}`}>{s.name}</p>
                    <p className="text-xs text-gray-500">{s.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Horoscope content */}
          <div className="lg:col-span-3 space-y-5">
            {/* Sign header */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-full bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center text-4xl flex-shrink-0">
                  {sign.symbol}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-3xl text-white">{sign.name}</h2>
                      <p className="text-gray-400">{sign.english} • {sign.date}</p>
                    </div>
                    <div className="flex items-center gap-1 glass-card px-3 py-1.5">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-sm font-semibold text-gold-400">Today: 8.5/10</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    {['Love: 9/10', 'Career: 8/10', 'Health: 7/10', 'Finance: 8/10'].map(s => (
                      <span key={s} className="text-xs px-2 py-1 glass-card-light rounded-lg text-gray-300">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction */}
            <div className="glass-card p-6">
              <h3 className="text-gold-400 font-semibold mb-4 uppercase text-sm tracking-wider">
                {type === 'daily' ? 'Aaj Ka Rashifal' : type === 'weekly' ? 'Is Hafte Ka Rashifal' : 'Is Mahine Ka Rashifal'}
              </h3>
              <p className="text-gray-200 leading-relaxed text-base font-devanagari">
                {PREDICTIONS[selected]}
              </p>
            </div>

            {/* Lucky factors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Lucky Color', value: lucky.color, icon: '🎨' },
                { label: 'Lucky Number', value: lucky.number.toString(), icon: '🔢' },
                { label: 'Lucky Day', value: lucky.day, icon: '📅' },
                { label: 'Lucky Stone', value: lucky.stone, icon: '💎' },
              ].map(item => (
                <div key={item.label} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { area: 'Love & Relationships', prediction: 'Prem jeevan mein khushi aur mithas aayegi. Partner ke saath ek khaas din manao.', icon: '❤️', score: 90 },
                { area: 'Career & Business', prediction: 'Office mein aapka kaam sar aankh pe liya jaayega. Nayi opportunities aa sakti hain.', icon: '💼', score: 80 },
                { area: 'Health & Wellness', prediction: 'Swasthya theek rahega lekin vyayam zaruri hai. Paani zyada piyo.', icon: '🏥', score: 70 },
                { area: 'Finance & Money', prediction: 'Arthik stithi stable rahegi. Niveish ke liye sahi samay hai.', icon: '💰', score: 85 },
              ].map(area => (
                <div key={area.area} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{area.icon}</span>
                      <h4 className="text-sm font-semibold text-white">{area.area}</h4>
                    </div>
                    <span className="text-xs text-saffron-400 font-bold">{area.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-deep-700 rounded-full mb-2">
                    <div className="h-full bg-saffron-gradient rounded-full transition-all duration-1000" style={{ width: `${area.score}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{area.prediction}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">Detailed Reading chahiye?</p>
                <p className="text-sm text-gray-400">Expert pandit se 1-on-1 consultation lo</p>
              </div>
              <Link href="/consultation" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                Talk to Pandit <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
