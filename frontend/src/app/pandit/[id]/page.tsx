'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PanditDetailPage() {
  const params = useParams();
  const panditId = params?.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/pandits" className="text-purple-400 hover:text-purple-300">
            ← Back to Pandits
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20 mb-8">
          <div className="flex gap-8 mb-8">
            <div className="w-32 h-32 bg-purple-500 rounded-lg flex items-center justify-center text-6xl flex-shrink-0">
              👨‍🏫
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Pandit Sharma</h1>
              <p className="text-purple-400 text-lg mt-2">Vedic Astrology Expert</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-400">4.9 (234 reviews)</span>
              </div>
              <p className="text-gray-300 mt-4">15+ years of experience</p>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-6">
            <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">
              Experienced Vedic astrologer with specialization in birth chart analysis, career guidance, and marriage compatibility. Certified from Indian Institute of Vedic Astrology.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20 text-center">
            <p className="text-gray-400 text-sm">Video Consultation</p>
            <p className="text-2xl font-bold text-purple-400 mt-2">₹599/30 min</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20 text-center">
            <p className="text-gray-400 text-sm">Phone Consultation</p>
            <p className="text-2xl font-bold text-purple-400 mt-2">₹399/30 min</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20 text-center">
            <p className="text-gray-400 text-sm">Chat Consultation</p>
            <p className="text-2xl font-bold text-purple-400 mt-2">₹179/30 min</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
            Book Consultation
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition border border-purple-500/20">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
