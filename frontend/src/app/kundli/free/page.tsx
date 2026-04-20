'use client';

import Link from 'next/link';

export default function FreeKundliPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/kundli" className="text-purple-400 hover:text-purple-300">
            ← Back to Kundli
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Free Kundli Report</h1>
        <p className="text-gray-300 mb-8">
          Get your basic birth chart analysis completely free. No sign-up required.
        </p>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Time of Birth</label>
                <input 
                  type="time" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Place of Birth</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Generate Free Kundli
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-purple-500/10">
            <h3 className="text-lg font-semibold text-white mb-3">What You'll Get:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Basic horoscope predictions</li>
              <li>✓ Planetary positions</li>
              <li>✓ Life span analysis</li>
              <li>✓ Career insights</li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/kundli/premium"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Upgrade to Premium Kundli →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
