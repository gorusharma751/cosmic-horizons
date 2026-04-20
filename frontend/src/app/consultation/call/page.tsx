'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CallConsultationPage() {
  const [selectedPandit, setSelectedPandit] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/consultation" className="text-purple-400 hover:text-purple-300">
            ← Back to Consultations
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Phone Call Consultation</h1>
        <p className="text-gray-300 mb-8">
          Connect with experienced pandits via phone for personalized guidance and insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">How It Works</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Browse and select from verified pandits</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Choose your preferred time slot</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Receive a call from your selected pandit</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Get personalized astrological guidance</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">15 minutes</span>
                <span className="text-purple-400 font-semibold">₹300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">30 minutes</span>
                <span className="text-purple-400 font-semibold">₹500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">60 minutes</span>
                <span className="text-purple-400 font-semibold">₹900</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
