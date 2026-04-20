'use client'
import Link from 'next/link'
import { ShoppingCart, Star, ChevronRight } from 'lucide-react'
import { useCartStore, useUIStore } from '@/store'
import { useAuthStore } from '@/store'

const MOCK_PRODUCTS = [
  { id: '1', name: 'Blue Sapphire (Neelam)', category: 'gemstone', price: 4999, discountPrice: 3999, rating: 4.8, reviewCount: 245, image: '💎', zodiacSuitable: ['Capricorn', 'Aquarius'], slug: 'blue-sapphire-neelam' },
  { id: '2', name: '5 Mukhi Rudraksha', category: 'rudraksha', price: 1299, discountPrice: 999, rating: 4.9, reviewCount: 512, image: '📿', zodiacSuitable: ['All Signs'], slug: '5-mukhi-rudraksha' },
  { id: '3', name: 'Shree Yantra (Gold Plated)', category: 'yantra', price: 2499, discountPrice: 1899, rating: 4.7, reviewCount: 189, image: '🔱', zodiacSuitable: ['All Signs'], slug: 'shree-yantra' },
  { id: '4', name: 'Crystal Mala (108 Beads)', category: 'mala', price: 899, discountPrice: 699, rating: 4.6, reviewCount: 378, image: '📿', zodiacSuitable: ['All Signs'], slug: 'crystal-mala' },
]

export default function ProductsPreview() {
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { openLoginModal } = useUIStore()

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) { openLoginModal(); return }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <section className="relative z-10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">
              Spiritual <span className="text-shimmer">Shop</span>
            </h2>
            <p className="text-gray-400">Certified & energized products for your wellbeing</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-saffron-400 text-sm">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="glass-card overflow-hidden group hover:border-saffron-500/30 hover:shadow-saffron transition-all duration-300">
              {/* Product image */}
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="aspect-square bg-deep-700/50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                  <span className="text-xs text-gold-400 font-semibold">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-white mb-2 hover:text-saffron-400 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-saffron-400 font-bold">₹{product.discountPrice?.toLocaleString()}</span>
                  {product.discountPrice && (
                    <span className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                  )}
                  {product.discountPrice && (
                    <span className="text-xs text-green-400 font-medium">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% off
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium hover:bg-saffron-500/20 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop" className="btn-outline inline-flex items-center gap-2">
            Browse Full Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
