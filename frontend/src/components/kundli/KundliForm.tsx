'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Download, Star, BookOpen, Heart } from 'lucide-react'
import { kundliAPI } from '@/lib/api'
import { KundliRequest } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

const PLANETS = ['Sun ☀️', 'Moon 🌙', 'Mars ♂', 'Mercury ☿', 'Jupiter ♃', 'Venus ♀', 'Saturn ♄', 'Rahu ☊', 'Ketu ☋']
const HOUSES = Array.from({ length: 12 }, (_, i) => `House ${i + 1}`)

function KundliChart({ report }: { report: any }) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl text-white mb-4 text-center">Janma Kundli</h3>

      {/* Basic info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sun Sign', value: report.sunSign, icon: '☀️' },
          { label: 'Moon Sign', value: report.moonSign, icon: '🌙' },
          { label: 'Ascendant', value: report.ascendant, icon: '⬆️' },
          { label: 'Nakshatra', value: report.nakshatra, icon: '⭐' },
        ].map(item => (
          <div key={item.label} className="glass-card-light p-3 text-center rounded-xl">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Planetary positions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gold-400 mb-3 uppercase tracking-wider">Planetary Positions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-400/10">
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Planet</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Sign</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">House</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Degree</th>
              </tr>
            </thead>
            <tbody>
              {(report.planetary || []).map((p: any, i: number) => (
                <tr key={i} className="border-b border-gold-400/5 hover:bg-white/3">
                  <td className="py-2 px-3 text-white">{p.planet}</td>
                  <td className="py-2 px-3 text-saffron-400">{p.sign}</td>
                  <td className="py-2 px-3 text-gray-300">{p.house}</td>
                  <td className="py-2 px-3 text-gray-400">{p.degree} {p.isRetrograde ? '(R)' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Predictions</h4>
        {Object.entries(report.predictions || {}).map(([key, value]) => (
          <div key={key} className="glass-card-light p-4 rounded-xl">
            <p className="text-xs text-saffron-400 uppercase font-semibold mb-1">{key}</p>
            <p className="text-sm text-gray-300 leading-relaxed font-devanagari">{value as string}</p>
          </div>
        ))}
      </div>

      {/* Lucky factors */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card-light p-3 text-center rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Lucky Color</p>
          <p className="text-sm font-semibold text-white">{report.luckyColor}</p>
        </div>
        <div className="glass-card-light p-3 text-center rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Lucky Number</p>
          <p className="text-sm font-semibold text-white">{report.luckyNumber}</p>
        </div>
        <div className="glass-card-light p-3 text-center rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Gemstone</p>
          <p className="text-sm font-semibold text-white">{report.gemstone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <Link href="/consultation" className="btn-outline flex-1 text-center">
          Talk to Pandit
        </Link>
      </div>
    </div>
  )
}

export default function KundliForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<KundliRequest>()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free')

  const onSubmit = async (data: KundliRequest) => {
    setLoading(true)
    try {
      const res: any = await kundliAPI.generate(data)
      setReport(res.data)
      toast.success('Kundli generate ho gayi!')
    } catch (err) {
      // Use mock data for demo
      setReport({
        sunSign: 'Taurus', moonSign: 'Cancer', ascendant: 'Leo', nakshatra: 'Pushya',
        planetary: [
          { planet: 'Sun ☀️', sign: 'Taurus', house: 10, degree: '15°23\'', isRetrograde: false },
          { planet: 'Moon 🌙', sign: 'Cancer', house: 12, degree: '8°45\'', isRetrograde: false },
          { planet: 'Mars ♂', sign: 'Aries', house: 9, degree: '22°11\'', isRetrograde: false },
          { planet: 'Mercury ☿', sign: 'Gemini', house: 11, degree: '3°55\'', isRetrograde: true },
          { planet: 'Jupiter ♃', sign: 'Sagittarius', house: 5, degree: '19°30\'', isRetrograde: false },
          { planet: 'Venus ♀', sign: 'Pisces', house: 8, degree: '27°14\'', isRetrograde: false },
          { planet: 'Saturn ♄', sign: 'Capricorn', house: 6, degree: '11°02\'', isRetrograde: false },
          { planet: 'Rahu ☊', sign: 'Virgo', house: 2, degree: '6°30\'', isRetrograde: true },
          { planet: 'Ketu ☋', sign: 'Pisces', house: 8, degree: '6°30\'', isRetrograde: true },
        ],
        predictions: {
          general: 'Aapka bhavishya bahut ujjwal hai. Agle 6 mahino mein career mein nayi unchaiyon ko chhuenge.',
          career: 'Vyavsay mein acha samay aa raha hai. Job change ya promotion ki sambhavana hai.',
          love: 'Prem jeevan mein madhurta aayegi. Vivah ke yog bhi ban rahe hain.',
          health: 'Swasthya ka khayal rakhein. Regular vyayam aur sahi khana zaruri hai.',
          finance: 'Arthik stithi mein sudhar aayega. Nivesh ke liye yeh samay achha hai.',
        },
        luckyColor: 'Golden Yellow', luckyNumber: 7, luckyDay: 'Thursday', gemstone: 'Yellow Sapphire',
        remedies: ['Surya namaskar do', 'Guruwar ko peele kapde pehne', 'Pushya nakshatra mein manthan karein']
      })
      toast.success('Sample kundli generate ki gayi (demo mode)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4 text-sm text-gold-300">
            <Star className="w-4 h-4 text-saffron-400" />
            Vedic Astrology
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
            Free <span className="text-shimmer">Kundli</span> Generator
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            AI-powered detailed birth chart with predictions and remedies in Hindi & English
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 justify-center mb-8">
          {[
            { key: 'free', icon: BookOpen, label: 'Free Kundli' },
            { key: 'premium', icon: Star, label: 'Premium Kundli' },
            { key: 'matching', icon: Heart, label: 'Kundli Matching', href: '/kundli/matching' },
          ].map(tab => (
            'href' in tab ? (
              <Link key={tab.key} href={tab.href!} className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-2xl text-sm font-medium text-gray-400 hover:text-white transition-all">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            ) : (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  activeTab === tab.key ? 'bg-saffron-gradient text-white shadow-saffron' : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          ))}
        </div>

        {!report ? (
          <div className="glass-card p-6 md:p-8">
            <h2 className="font-semibold text-white text-lg mb-6 text-center">
              Apni Janm Jaankari Bharein
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Naam (Name) *</label>
                  <input {...register('name', { required: 'Naam zaruri hai' })} placeholder="Aapka poora naam" className="input-cosmic" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Janam Tithi (Date of Birth) *</label>
                  <input {...register('dateOfBirth', { required: 'Date of birth zaruri hai' })} type="date" className="input-cosmic" />
                  {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Janam Samay (Time of Birth) *</label>
                  <input {...register('timeOfBirth', { required: 'Samay zaruri hai' })} type="time" className="input-cosmic" />
                  {errors.timeOfBirth && <p className="text-red-400 text-xs mt-1">{errors.timeOfBirth.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Janam Sthan (Place of Birth) *</label>
                  <input {...register('placeOfBirth', { required: 'Sthan zaruri hai' })} placeholder="City, State, Country" className="input-cosmic" />
                  {errors.placeOfBirth && <p className="text-red-400 text-xs mt-1">{errors.placeOfBirth.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Ling (Gender) *</label>
                  <select {...register('gender')} className="input-cosmic">
                    <option value="male">Purush (Male)</option>
                    <option value="female">Stree (Female)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bhasha (Language)</label>
                  <select {...register('language')} className="input-cosmic">
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                  </select>
                </div>
              </div>

              <div className="glass-card-light p-4 rounded-xl text-sm text-gray-400">
                <p>✅ Exact birth time dene se kundli accurate hoti hai</p>
                <p>✅ Aapka data safe & encrypted rahega</p>
                <p>✅ PDF download free hai</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Kundli Ban Rahi Hai...</>
                ) : (
                  <><Star className="w-5 h-5" /> Generate Free Kundli</>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Kundli Ready! 🎉</h2>
              <button onClick={() => setReport(null)} className="text-sm text-gray-400 hover:text-white">
                ← New Kundli
              </button>
            </div>
            <KundliChart report={report} />
          </div>
        )}
      </div>
    </div>
  )
}
