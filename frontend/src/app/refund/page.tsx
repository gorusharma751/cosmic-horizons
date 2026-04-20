'use client';

import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Refund Eligibility</h2>
            <p>Refunds are available for consultations that are cancelled within 24 hours of booking. Refunds for purchased products are available within 30 days of purchase if the item is in its original condition.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. How to Request a Refund</h2>
            <p>To request a refund, please contact our customer support team at support@cosmichorizons.com with your order number and reason for the refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Refund Processing</h2>
            <p>Once your refund request is approved, the refund will be processed within 5-7 business days. The amount will be credited to your original payment method.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Non-Refundable Items</h2>
            <ul className="space-y-2 ml-4">
              <li>• Digital downloads that have been accessed</li>
              <li>• Consultations that have been completed</li>
              <li>• Custom reports or personalized readings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about our refund policy, please contact us at support@cosmichorizons.com</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
