'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="bg-slate-800 rounded-lg p-8 border border-purple-500/20 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) from Cosmic Horizons for personal, non-commercial transitory viewing only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Disclaimer</h2>
            <p>The materials on Cosmic Horizons are provided on an 'as is' basis. Cosmic Horizons makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Limitations</h2>
            <p>In no event shall Cosmic Horizons or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption).</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Accuracy of Materials</h2>
            <p>The materials appearing on Cosmic Horizons could include technical, typographical, or photographic errors. Cosmic Horizons does not warrant that any of the materials on the website are accurate, complete, or current.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Modifications</h2>
            <p>Cosmic Horizons may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
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
