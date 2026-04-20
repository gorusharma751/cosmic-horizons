'use client';

import Link from 'next/link';

export default function PanchangPage() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">Panchang</h1>
        <p className="text-gray-400 mb-8">{today}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Tithi</h3>
            <p className="text-2xl font-bold text-white">Shukla Ashtami</p>
            <p className="text-gray-400 text-sm mt-2">Lunar day</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Nakshatra</h3>
            <p className="text-2xl font-bold text-white">Rohini</p>
            <p className="text-gray-400 text-sm mt-2">Star constellation</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Yoga</h3>
            <p className="text-2xl font-bold text-white">Auspicious</p>
            <p className="text-gray-400 text-sm mt-2">Auspiciousness level</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Sunrise</h3>
            <p className="text-2xl font-bold text-white">06:15 AM</p>
            <p className="text-gray-400 text-sm mt-2">Local time</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Sunset</h3>
            <p className="text-2xl font-bold text-white">06:45 PM</p>
            <p className="text-gray-400 text-sm mt-2">Local time</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Moonrise</h3>
            <p className="text-2xl font-bold text-white">03:30 PM</p>
            <p className="text-gray-400 text-sm mt-2">Local time</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Auspicious Timings (Muhurat)</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Brahma Muhurat</span>
              <span>04:45 - 05:30 AM</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Abhijit Muhurat</span>
              <span>11:50 AM - 12:35 PM</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Sayahna Sandhya</span>
              <span>06:15 - 07:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
