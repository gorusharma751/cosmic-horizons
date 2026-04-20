'use client'
import { useAuthStore, useCartStore, useUIStore } from '@/store'
import {
    Bell,
    BookOpen,
    Calendar,
    ChevronDown,
    Heart,
    LogOut,
    Menu,
    MessageCircle,
    Phone,
    Search,
    Settings,
    Shield,
    ShoppingBag,
    Star,
    Sun,
    User,
    Video,
    Wallet,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  {
    label: 'Consultation',
    href: '/consultation',
    icon: Phone,
    submenu: [
      { label: 'Talk to Pandit', href: '/consultation/call', icon: Phone },
      { label: 'Chat with Pandit', href: '/consultation/chat', icon: MessageCircle },
      { label: 'Video Call', href: '/consultation/video', icon: Video },
      { label: 'Live Sessions', href: '/live', icon: Sun },
    ]
  },
  {
    label: 'Horoscope',
    href: '/horoscope',
    icon: Star,
    submenu: [
      { label: 'Daily Horoscope', href: '/horoscope/daily', icon: Star },
      { label: 'Weekly Horoscope', href: '/horoscope/weekly', icon: Star },
      { label: 'Monthly Horoscope', href: '/horoscope/monthly', icon: Star },
      { label: 'Panchang', href: '/panchang', icon: Calendar },
    ]
  },
  {
    label: 'Kundli',
    href: '/kundli',
    icon: BookOpen,
    submenu: [
      { label: 'Free Kundli', href: '/kundli/free', icon: BookOpen },
      { label: 'Premium Kundli', href: '/kundli/premium', icon: BookOpen },
      { label: 'Kundli Matching', href: '/kundli/matching', icon: Heart },
    ]
  },
  { label: 'Pooja Services', href: '/pooja', icon: Calendar },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { openLoginModal, isMobileMenuOpen, toggleMobileMenu } = useUIStore()
  const { totalItems } = useCartStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const closeDropdown = () => setIsProfileOpen(false)

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-deep-800/95 backdrop-blur-xl shadow-cosmic border-b border-gold-400/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-saffron-gradient rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                <Star className="w-10 h-10 text-gold-400 group-hover:text-saffron-400 transition-colors" strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-display text-lg text-shimmer block leading-tight">
                  Cosmic
                </span>
                <span className="font-display text-xs text-gold-400/70 tracking-widest block">
                  HORIZONS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname?.startsWith(link.href)
                        ? 'text-saffron-400 bg-saffron-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    {link.submenu && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* Dropdown */}
                  {link.submenu && (
                    <div
                      className="absolute top-full left-0 mt-1 w-52 glass-card py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    >
                      {link.submenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-saffron-400" />
                            {item.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="hidden md:flex p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems()}
                  </span>
                )}
              </Link>

              {isAuthenticated && user ? (
                <>
                  {/* Wallet */}
                  <Link href="/wallet" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass-card text-sm text-gold-400 hover:text-gold-300 transition-colors">
                    <Wallet className="w-4 h-4" />
                    <span className="font-semibold">₹{user.walletBalance}</span>
                  </Link>

                  {/* Notifications */}
                  <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-saffron-500 rounded-full" />
                  </button>

                  {/* Profile */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 glass-card hover:border-gold-400/30 transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-saffron-gradient flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-white">{user.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-52 glass-card py-2 z-50 shadow-xl">
                        <div className="px-4 py-2 border-b border-gold-400/10">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        </div>
                        <Link
                          href="/wallet"
                          onClick={closeDropdown}
                          className="block px-4 py-2.5 text-sm text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Wallet: ₹{user.walletBalance}
                          </div>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={closeDropdown}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-saffron-400" /> My Profile
                          </div>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={closeDropdown}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-saffron-400" /> My Orders
                          </div>
                        </Link>
                        <Link
                          href="/consultations"
                          onClick={closeDropdown}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-saffron-400" /> Consultations
                          </div>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={closeDropdown}
                            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gold-400" /> Admin Panel
                            </div>
                          </Link>
                        )}
                        {user.role === 'pandit' && (
                          <Link
                            href="/pandit/dashboard"
                            onClick={closeDropdown}
                            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-gold-400" /> Pandit Dashboard
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={() => { closeDropdown(); logout() }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button onClick={openLoginModal} className="btn-primary text-sm py-2 px-4">
                  Login / Register
                </button>
              )}

              {/* Mobile menu toggle */}
              <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-gray-400 hover:text-white">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-0 left-0 h-full w-80 bg-deep-800 border-r border-gold-400/10 overflow-y-auto pt-20 pb-8 px-4">
            {/* Mobile nav links */}
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5"
                  onClick={toggleMobileMenu}
                >
                  <link.icon className="w-5 h-5 text-saffron-400" />
                  <span className="font-medium">{link.label}</span>
                </Link>
                {link.submenu && (
                  <div className="ml-8 space-y-1 mt-1">
                    {link.submenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-gray-200 rounded-lg hover:bg-white/5"
                        onClick={toggleMobileMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="divider-cosmic mt-4" />

            {isAuthenticated ? (
              <button onClick={logout} className="w-full btn-outline mt-4">
                Logout
              </button>
            ) : (
              <button onClick={() => { openLoginModal(); toggleMobileMenu(); }} className="w-full btn-primary mt-4">
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
