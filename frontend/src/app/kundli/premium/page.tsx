'use client';

import Link from 'next/link';

export default function PremiumKundliPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/kundli" className="text-purple-400 hover:text-purple-300">
            ← Back to Kundli
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Premium Kundli Report</h1>
        <p className="text-gray-300 mb-8">
          Get comprehensive astrological analysis with detailed predictions and remedies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">₹499</h3>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-300">✓ Detailed birth chart analysis</li>
              <li className="text-gray-300">✓ 5-year predictions</li>
              <li className="text-gray-300">✓ Planetary transitions</li>
              <li className="text-gray-300">✓ Lucky numbers & colors</li>
              <li className="text-gray-300">✓ Career predictions</li>
              <li className="text-gray-300">✓ Health insights</li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
              Order Now
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500 bg-opacity-10">
            <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              MOST POPULAR
            </span>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">₹999</h3>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-300">✓ Everything in Premium</li>
              <li className="text-gray-300">✓ 10-year predictions</li>
              <li className="text-gray-300">✓ Marriage analysis</li>
              <li className="text-gray-300">✓ Remedies & solutions</li>
              <li className="text-gray-300">✓ Video consultation</li>
              <li className="text-gray-300">✓ Priority support</li>
            </ul>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
              Order Now
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Why Choose Premium?</h3>
          <p className="text-gray-300">
            Our premium kundli reports are prepared by experienced vedic astrologers with decades of expertise. Get detailed insights into your past, present, and future with specific remedies tailored to your birth chart.
          </p>
        </div>
      </div>
    </div>
  );
}
