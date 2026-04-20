import { Facebook, Instagram, Mail, MapPin, Phone, Star, Youtube } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold-400/10 bg-deep-800/60 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Star className="w-8 h-8 text-gold-400" strokeWidth={1.5} />
              <div>
                <span className="font-display text-lg text-shimmer block">Cosmic Horizons</span>
                <span className="text-xs text-gray-500 tracking-widest">JYOTISH KENDRA</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              India's trusted astrology platform. Get expert guidance from certified pandits 
              for kundli, horoscope, vastu, and spiritual services.
            </p>
            <div className="flex gap-3">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-card flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-card flex items-center justify-center text-gray-400 hover:text-pink-400 hover:border-pink-400/30 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-card flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider uppercase">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/consultation/call" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Talk to Pandit</Link></li>
              <li><Link href="/consultation/chat" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Chat with Astrologer</Link></li>
              <li><Link href="/consultation/video" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Video Consultation</Link></li>
              <li><Link href="/live" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Live Sessions</Link></li>
              <li><Link href="/pooja" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Online Pooja</Link></li>
              <li><Link href="/consultation/call" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Vastu Consultation</Link></li>
            </ul>
          </div>

          {/* Reports */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider uppercase">Reports</h4>
            <ul className="space-y-2">
              <li><Link href="/kundli/free" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Free Kundli</Link></li>
              <li><Link href="/kundli/premium" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Premium Kundli</Link></li>
              <li><Link href="/kundli/matching" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Kundli Matching</Link></li>
              <li><Link href="/horoscope/daily" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Daily Horoscope</Link></li>
              <li><Link href="/panchang" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Panchang</Link></li>
              <li><Link href="/shop" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">Gemstone Report</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                support@cosmichorizons.com
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                New Delhi, India
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Download App</p>
              <div className="flex gap-2">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="glass-card px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors">
                  App Store
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="glass-card px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors">
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-cosmic" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 Cosmic Horizons. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
