'use client';

import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/profile" className="text-purple-400 hover:text-purple-300">
            ← Back to Profile
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">Premium Kundli Report</h3>
                <p className="text-gray-400 mt-1">Order ID: #ORD-001</p>
                <p className="text-gray-400">April 10, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">₹999</p>
                <span className="inline-block mt-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  Delivered
                </span>
              </div>
            </div>
            <button className="mt-4 text-purple-400 hover:text-purple-300 font-semibold">
              Download Report →
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">Gemstone Report</h3>
                <p className="text-gray-400 mt-1">Order ID: #ORD-002</p>
                <p className="text-gray-400">April 8, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-400">₹299</p>
                <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  Processing
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
