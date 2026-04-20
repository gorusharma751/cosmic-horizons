'use client'
import {
    Calendar,
    LayoutDashboard,
    LogOut, Menu,
    Phone,
    Radio,
    Settings,
    Star,
    TrendingUp,
    Users,
    Wallet,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { label: 'Dashboard', href: '/pandit/dashboard', icon: LayoutDashboard },
  { label: 'Consultations', href: '/pandit/consultations', icon: Phone },
  { label: 'Live Stream', href: '/pandit/live', icon: Radio },
  { label: 'My Clients', href: '/pandit/clients', icon: Users },
  { label: 'Earnings', href: '/pandit/earnings', icon: TrendingUp },
  { label: 'Wallet', href: '/pandit/wallet', icon: Wallet },
  { label: 'Schedule', href: '/pandit/schedule', icon: Calendar },
  { label: 'Reviews', href: '/pandit/reviews', icon: Star },
  { label: 'Settings', href: '/pandit/settings', icon: Settings },
]

export default function PanditSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const Content = () => (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-gold-400/10">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-7 h-7 text-gold-400" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm text-white">Pandit Portal</p>
            <p className="text-xs text-gray-500">Cosmic Horizons</p>
          </div>
        </div>
        {/* Online toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-deep-700/50 border border-green-400/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Online</span>
          </div>
          <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
              pathname === item.href ? 'text-saffron-400 bg-saffron-500/10 border border-saffron-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gold-400/10">
        <div className="glass-card p-3 mb-3">
          <p className="text-xs text-gray-500 mb-1">Today's Earnings</p>
          <p className="text-xl font-bold text-gold-400">₹4,280</p>
          <p className="text-xs text-green-400 mt-0.5">+₹840 from yesterday</p>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-deep-800/95 backdrop-blur-xl border-r border-gold-400/10 z-40">
        <Content />
      </aside>
      <button onClick={() => setIsOpen(true)} className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 glass-card flex items-center justify-center text-gray-400">
        <Menu className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <aside className="relative w-64 h-full bg-deep-800 border-r border-gold-400/10 z-10">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400"><X className="w-5 h-5" /></button>
            <Content />
          </aside>
        </div>
      )}
    </>
  )
}
