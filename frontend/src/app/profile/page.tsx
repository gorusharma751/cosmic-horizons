'use client';

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20 col-span-1">
            <div className="w-24 h-24 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="text-white font-semibold text-center">User Name</h3>
            <p className="text-gray-400 text-center text-sm mt-1">user@email.com</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <p className="text-gray-400 text-sm">Total Consultations</p>
            <p className="text-3xl font-bold text-purple-400">12</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <p className="text-gray-400 text-sm">Account Balance</p>
            <p className="text-3xl font-bold text-purple-400">₹4,500</p>
          </div>
        </div>

        <div className="space-y-6">
          <Link 
            href="/consultations"
            className="block bg-slate-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500 hover:bg-slate-700 transition"
          >
            <h3 className="text-xl font-semibold text-white">My Consultations</h3>
            <p className="text-gray-400 text-sm mt-2">View your booking schedule and history</p>
          </Link>

          <Link 
            href="/orders"
            className="block bg-slate-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500 hover:bg-slate-700 transition"
          >
            <h3 className="text-xl font-semibold text-white">My Orders</h3>
            <p className="text-gray-400 text-sm mt-2">View your product purchases and reports</p>
          </Link>

          <Link 
            href="/wallet"
            className="block bg-slate-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500 hover:bg-slate-700 transition"
          >
            <h3 className="text-xl font-semibold text-white">Wallet</h3>
            <p className="text-gray-400 text-sm mt-2">Manage your account balance and payments</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
