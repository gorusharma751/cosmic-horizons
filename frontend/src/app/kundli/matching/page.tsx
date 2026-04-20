'use client';

import Link from 'next/link';

export default function KundliMatchingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/kundli" className="text-purple-400 hover:text-purple-300">
            ← Back to Kundli
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Kundli Matching</h1>
        <p className="text-gray-300 mb-8">
          Check compatibility between two birth charts for marriage and relationships.
        </p>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20">
          <form className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Bride's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                  placeholder="Full name"
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

            <h3 className="text-xl font-semibold text-white mt-8">Groom's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-purple-500/30 rounded px-4 py-2 text-white"
                  placeholder="Full name"
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
              Check Compatibility (₹99)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
