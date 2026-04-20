'use client';

import Link from 'next/link';

const pandits = [
  { id: 1, name: 'Pandit Sharma', expertise: 'Vedic Astrology', rating: 4.9 },
  { id: 2, name: 'Pandit Patel', expertise: 'Numerology', rating: 4.8 },
  { id: 3, name: 'Pandit Kumar', expertise: 'Vastu Shastra', rating: 4.7 },
  { id: 4, name: 'Pandit Singh', expertise: 'Horoscope', rating: 4.9 },
  { id: 5, name: 'Pandit Verma', expertise: 'Kundli Matching', rating: 4.8 },
  { id: 6, name: 'Pandit Nair', expertise: 'Palmistry', rating: 4.6 },
];

export default function PanditsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Our Expert Pandits</h1>
        <p className="text-gray-300 mb-12">
          Connect with our certified and experienced pandits for authentic guidance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((pandit) => (
            <Link
              key={pandit.id}
              href={`/pandit/${pandit.id}`}
              className="bg-slate-800 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500 hover:bg-slate-700 transition group"
            >
              <div className="w-20 h-20 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition">
                👨‍🏫
              </div>
              <h3 className="text-xl font-semibold text-white text-center">{pandit.name}</h3>
              <p className="text-purple-400 text-center text-sm mt-2">{pandit.expertise}</p>
              <div className="flex justify-center items-center mt-4">
                <span className="text-yellow-400">★</span>
                <span className="text-white ml-2 font-semibold">{pandit.rating}</span>
              </div>
              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
                View Profile
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
