'use client';

import Link from 'next/link';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/profile" className="text-purple-400 hover:text-purple-300">
            ← Back to Profile
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">My Wallet</h1>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white mb-8">
          <p className="text-sm opacity-90">Current Balance</p>
          <h2 className="text-4xl font-bold mt-2">₹4,500</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
            Add Money
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg border border-purple-500/20 transition">
            Withdraw
          </button>
        </div>

        <h3 className="text-2xl font-semibold text-white mb-4">Transaction History</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">Video Consultation</p>
                <p className="text-gray-400 text-sm">April 15, 2026</p>
              </div>
              <p className="text-red-400 font-semibold">-₹699</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">Add Money</p>
                <p className="text-gray-400 text-sm">April 12, 2026</p>
              </div>
              <p className="text-green-400 font-semibold">+₹5,000</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">Premium Kundli</p>
                <p className="text-gray-400 text-sm">April 10, 2026</p>
              </div>
              <p className="text-red-400 font-semibold">-₹999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
