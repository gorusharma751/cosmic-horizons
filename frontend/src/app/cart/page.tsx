'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore, useAuthStore, useUIStore } from '@/store'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { openLoginModal } = useUIStore()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) { openLoginModal(); return }
    setLoading(true)
    try {
      // Razorpay checkout logic here
      toast.success('Redirecting to payment...')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-20 h-20 text-gray-600 mb-4" />
          <h2 className="font-display text-2xl text-white mb-2">Cart Khali Hai</h2>
          <p className="text-gray-400 mb-6">Koi product add nahi hua abhi tak</p>
          <Link href="/shop" className="btn-primary">Browse Products</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative z-10">
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl text-white mb-8">
            Shopping <span className="text-shimmer">Cart</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.productId} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-deep-700/50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">{item.name}</h3>
                    <p className="text-saffron-400 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-300 mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-5 h-fit">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white">₹{totalAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">{totalAmount() >= 999 ? 'FREE' : '₹99'}</span>
                </div>
                <div className="divider-cosmic" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-saffron-400 text-lg">
                    ₹{(totalAmount() + (totalAmount() >= 999 ? 0 : 99)).toLocaleString()}
                  </span>
                </div>
              </div>
              {totalAmount() < 999 && (
                <p className="text-xs text-gray-400 mb-4 p-2 bg-saffron-500/5 border border-saffron-500/20 rounded-lg">
                  ₹{999 - totalAmount()} aur add karo free delivery ke liye! 🎁
                </p>
              )}
              <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Proceed to Pay <ArrowRight className="w-4 h-4" /></>}
              </button>
              <Link href="/shop" className="block text-center text-sm text-gray-400 hover:text-white mt-3">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
