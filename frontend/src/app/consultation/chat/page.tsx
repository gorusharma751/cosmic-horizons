'use client';

import Link from 'next/link';

export default function ChatConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/consultation" className="text-purple-400 hover:text-purple-300">
            ← Back to Consultations
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Chat Consultation</h1>
        <p className="text-gray-300 mb-8">
          Get instant answers through text-based chat with our expert pandits anytime, anywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">Benefits</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>24/7 availability - chat anytime</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Text your questions at your own pace</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Keep chat history for future reference</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">✓</span>
                <span>Connect with multiple pandits</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">5 messages</span>
                <span className="text-purple-400 font-semibold">₹99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Unlimited (24 hours)</span>
                <span className="text-purple-400 font-semibold">₹199</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly plan</span>
                <span className="text-purple-400 font-semibold">₹999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
