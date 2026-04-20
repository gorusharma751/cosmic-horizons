'use client';

import Link from 'next/link';

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Live Sessions</h1>
        <p className="text-gray-300 mb-12">
          Join live astrology sessions with expert pandits. Real-time guidance and interactive Q&A.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="mb-4">
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                LIVE NOW
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Vedic Astrology Masterclass</h3>
            <p className="text-gray-300 mb-4">Learn the fundamentals of Vedic astrology with Pandit Sharma</p>
            <p className="text-purple-400 font-semibold mb-4">Viewers: 2,447</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
              Join Now
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="mb-4">
              <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                UPCOMING
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Career & Finance Reading</h3>
            <p className="text-gray-300 mb-4">Get insights about your career path and financial prosperity</p>
            <p className="text-purple-400 font-semibold mb-4">Starts in 1 hour</p>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
              Notify Me
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/consultation/call"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
          >
            Get Personal Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
