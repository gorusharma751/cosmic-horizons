'use client';

import Link from 'next/link';

export default function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/profile" className="text-purple-400 hover:text-purple-300">
            ← Back to Profile
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">My Consultations</h1>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">Video Consultation with Pandit Sharma</h3>
                <p className="text-gray-400 mt-2">April 15, 2026 - 3:00 PM IST</p>
              </div>
              <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                Completed
              </span>
            </div>
            <button className="mt-4 text-purple-400 hover:text-purple-300 font-semibold">
              View Details →
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">Phone Consultation - Career Guidance</h3>
                <p className="text-gray-400 mt-2">April 18, 2026 - 2:00 PM IST</p>
              </div>
              <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                Upcoming
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="text-purple-400 hover:text-purple-300 font-semibold">
                Reschedule
              </button>
              <button className="text-red-400 hover:text-red-300 font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/consultation/call"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
          >
            Book New Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
