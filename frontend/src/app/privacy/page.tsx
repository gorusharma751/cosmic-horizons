'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you register, make a purchase, or communicate with us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process payments, and communicate with you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Security</h2>
            <p>We implement security measures to protect your information. However, no security system is impenetrable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@cosmichorizons.com</p>
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
