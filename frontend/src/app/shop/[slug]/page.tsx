'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-purple-400 hover:text-purple-300">
            ← Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20 flex items-center justify-center min-h-96">
            <div className="text-6xl">💎</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20">
            <h1 className="text-3xl font-bold text-white mb-2">Premium Gemstone</h1>
            <p className="text-purple-400 text-lg font-semibold mb-4">₹2,999</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-400">(45 reviews)</span>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                Authentic, lab-certified gemstone with astrological significance. Believed to enhance prosperity, clarity, and spiritual growth. Comes with authenticity certificate.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ 100% authentic and certified</li>
                <li>✓ Lab tested quality</li>
                <li>✓ Free astrological consultation</li>
                <li>✓ 30-day money-back guarantee</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
                Add to Cart
              </button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition border border-purple-500/20">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            <div className="border-b border-purple-500/10 pb-4">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-semibold">John Doe</h4>
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">Excellent quality! Highly recommended.</p>
            </div>
            <div>
              <div className="flex justify-between items-start">
                <h4 className="text-white font-semibold">Jane Smith</h4>
                <span className="text-yellow-400">★★★★☆</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">Good product, fast delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
