'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HoroscopeDetailPage() {
  const params = useParams();
  const sign = params?.sign as string;
  const formattedSign = sign ? sign.charAt(0).toUpperCase() + sign.slice(1) : 'Zodiac';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/horoscope" className="text-purple-400 hover:text-purple-300">
            ← Back to Horoscope
          </Link>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20">
          <h1 className="text-4xl font-bold text-white mb-4">{formattedSign} Horoscope</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-purple-400 mb-3">Today's Forecast</h2>
              <p className="text-gray-300 leading-relaxed">
                Loading your personalized horoscope reading. The celestial alignment brings opportunities and challenges specific to your sign.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple-400 mb-3">Love & Relationships</h2>
              <p className="text-gray-300 leading-relaxed">
                Venus is influencing your romantic sector. This is a favorable time for deepening connections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple-400 mb-3">Career & Finance</h2>
              <p className="text-gray-300 leading-relaxed">
                Jupiter's transit suggests positive developments in your professional sphere. Financial gains are indicated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-purple-400 mb-3">Health & Wellness</h2>
              <p className="text-gray-300 leading-relaxed">
                Focus on self-care and maintaining balance. Energy levels are good for physical activities.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/10">
            <Link
              href="/consultation/call"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
            >
              Consult a Pandit for Detailed Reading
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
