'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, ShoppingBag, Phone, Star,
  TrendingUp, Settings, Package, Calendar, LogOut, Menu, X,
  Wallet, Bell, BarChart3, Radio, Globe
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  {
    label: 'Users',
    icon: Users,
    children: [
      { label: 'All Users', href: '/admin/users', icon: Users },
      { label: 'Pandits', href: '/admin/pandits', icon: UserCheck },
    ]
  },
  {
    label: 'Consultations',
    icon: Phone,
    children: [
      { label: 'All Consultations', href: '/admin/consultations', icon: Phone },
      { label: 'Live Streams', href: '/admin/live', icon: Radio },
    ]
  },
  {
    label: 'Products',
    icon: ShoppingBag,
    children: [
      { label: 'All Products', href: '/admin/products', icon: Package },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    ]
  },
  {
    label: 'Services',
    icon: Calendar,
    children: [
      { label: 'Pooja Bookings', href: '/admin/pooja', icon: Calendar },
      { label: 'Kundli Reports', href: '/admin/kundli', icon: Star },
    ]
  },
  { label: 'Revenue', href: '/admin/revenue', icon: TrendingUp },
  { label: 'Payments', href: '/admin/payments', icon: Wallet },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'White-label', href: '/admin/whitelabel', icon: Globe },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>(['Users', 'Products'])

  const toggleExpand = (label: string) => {
    setExpanded(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label])
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gold-400/10">
        <div className="flex items-center gap-2">
          <Star className="w-7 h-7 text-gold-400" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm text-white">Cosmic Horizons</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const isExpanded = expanded.includes(item.label)
            const isActive = item.children.some(c => pathname === c.href)
            return (
              <div key={item.label} className="mb-1">
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-saffron-400 bg-saffron-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                </button>
                {isExpanded && (
                  <div className="ml-7 mt-1 space-y-0.5">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          pathname === child.href ? 'text-saffron-400 bg-saffron-500/10' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                        }`}
                      >
                        <child.icon className="w-3.5 h-3.5" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                pathname === item.href ? 'text-saffron-400 bg-saffron-500/10 border border-saffron-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gold-400/10">
        <div className="flex items-center gap-3 p-3 rounded-xl glass-card mb-3">
          <div className="w-8 h-8 rounded-full bg-saffron-gradient flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">Super Admin</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-deep-800/95 backdrop-blur-xl border-r border-gold-400/10 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 glass-card flex items-center justify-center text-gray-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <aside className="relative w-64 h-full bg-deep-800 border-r border-gold-400/10 z-10">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
