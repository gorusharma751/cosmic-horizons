'use client'
import Link from 'next/link'
import { Radio, Users, ArrowRight } from 'lucide-react'

export default function LiveBanner() {
  return (
    <div className="relative z-10 mx-4 -mt-2 mb-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/live" className="block glass-card border-red-500/20 p-3 hover:border-red-500/40 transition-all group">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-red-400 uppercase tracking-wider">🔴 LIVE NOW</span>
                <p className="text-sm text-white font-medium truncate">Pt. Rajesh Sharma — Daily Rashifal & Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>2,341 watching</span>
              </div>
              <span className="hidden sm:flex items-center gap-1 text-saffron-400 text-sm font-medium group-hover:gap-2 transition-all">
                Join Live <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
