'use client';

import Link from 'next/link';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function MonthlyHoroscopePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/horoscope" className="text-purple-400 hover:text-purple-300">
            ← Back to Horoscope
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Monthly Horoscope</h1>
        <p className="text-gray-300 mb-12">
          Get your monthly astrological forecast and guidance for all zodiac signs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zodiacSigns.map((sign) => (
            <Link
              key={sign}
              href={`/horoscope/${sign.toLowerCase()}`}
              className="group bg-slate-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition">
                {sign}
              </h3>
              <p className="text-gray-400 mt-2 text-sm">View monthly prediction →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
