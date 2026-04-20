'use client'
import { useState } from 'react'
import { ShoppingCart, Star, Search, Filter, ChevronRight, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import { useCartStore, useAuthStore, useUIStore } from '@/store'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '🛍️' },
  { id: 'gemstone', label: 'Gemstones', icon: '💎' },
  { id: 'rudraksha', label: 'Rudraksha', icon: '📿' },
  { id: 'yantra', label: 'Yantra', icon: '🔱' },
  { id: 'mala', label: 'Mala', icon: '📿' },
  { id: 'pooja-kit', label: 'Pooja Kits', icon: '🪔' },
  { id: 'kavach', label: 'Kavach', icon: '🧿' },
]

const MOCK_PRODUCTS = [
  { id: '1', name: 'Blue Sapphire (Neelam) - 5 Carat', category: 'gemstone', price: 8999, discountPrice: 6999, rating: 4.9, reviewCount: 312, image: '💎', benefits: ['Saturn ki kripa', 'Career boost', 'Protection'], zodiacSuitable: ['Capricorn', 'Aquarius'], inStock: true, isFeatured: true, slug: 'blue-sapphire' },
  { id: '2', name: 'Panchmukhi Rudraksha Original', category: 'rudraksha', price: 1999, discountPrice: 1499, rating: 4.8, reviewCount: 892, image: '📿', benefits: ['Lord Shiva blessing', 'Mental peace', 'Health'], zodiacSuitable: ['All Signs'], inStock: true, isFeatured: true, slug: 'panchmukhi-rudraksha' },
  { id: '3', name: 'Shree Yantra Gold Plated (8 inch)', category: 'yantra', price: 3499, discountPrice: 2799, rating: 4.7, reviewCount: 234, image: '🔱', benefits: ['Wealth & prosperity', 'Goddess Lakshmi', 'Business growth'], zodiacSuitable: ['All Signs'], inStock: true, isFeatured: false, slug: 'shree-yantra' },
  { id: '4', name: 'Rose Quartz Crystal Mala (108 beads)', category: 'mala', price: 1299, discountPrice: 999, rating: 4.6, reviewCount: 567, image: '📿', benefits: ['Love & relationships', 'Emotional healing', 'Positivity'], zodiacSuitable: ['Taurus', 'Libra'], inStock: true, isFeatured: false, slug: 'rose-quartz-mala' },
  { id: '5', name: 'Navratna Pendant (Silver 92.5)', category: 'kavach', price: 4999, discountPrice: 3999, rating: 4.8, reviewCount: 178, image: '🧿', benefits: ['9 planet blessings', 'All-round protection', 'Good luck'], zodiacSuitable: ['All Signs'], inStock: true, isFeatured: true, slug: 'navratna-pendant' },
  { id: '6', name: 'Satyanarayan Pooja Complete Kit', category: 'pooja-kit', price: 799, discountPrice: 599, rating: 4.9, reviewCount: 1240, image: '🪔', benefits: ['Complete pooja samagri', 'Lord Vishnu blessings', 'Family prosperity'], zodiacSuitable: ['All Signs'], inStock: true, isFeatured: false, slug: 'satyanarayan-kit' },
  { id: '7', name: 'Yellow Sapphire (Pukhraj) - 3 Carat', category: 'gemstone', price: 12999, discountPrice: 9999, rating: 4.9, reviewCount: 189, image: '💛', benefits: ['Jupiter ki kripa', 'Education & wisdom', 'Marriage luck'], zodiacSuitable: ['Sagittarius', 'Pisces'], inStock: true, isFeatured: true, slug: 'yellow-sapphire' },
  { id: '8', name: 'Ganesh Yantra (Copper)', category: 'yantra', price: 1499, discountPrice: 1199, rating: 4.7, reviewCount: 445, image: '🐘', benefits: ['Remove obstacles', 'Success in work', 'New beginnings'], zodiacSuitable: ['All Signs'], inStock: false, isFeatured: false, slug: 'ganesh-yantra' },
]

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { openLoginModal } = useUIStore()
  const [wishlist, setWishlist] = useState(false)

  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0

  const handleAdd = () => {
    if (!isAuthenticated) { openLoginModal(); return }
    addItem({ productId: product.id, name: product.name, price: product.discountPrice || product.price, image: product.image, quantity: 1 })
    toast.success('Cart mein add ho gaya!')
  }

  return (
    <div className={`glass-card overflow-hidden group transition-all duration-300 hover:border-saffron-500/30 hover:shadow-saffron hover:-translate-y-1 ${!product.inStock ? 'opacity-60' : ''}`}>
      {/* Image area */}
      <div className="relative aspect-square bg-deep-700/40 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{product.image}</span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">{discount}% OFF</span>
          )}
          {product.isFeatured && (
            <span className="text-xs font-bold bg-saffron-500 text-white px-2 py-0.5 rounded-full">Featured</span>
          )}
          {!product.inStock && (
            <span className="text-xs font-bold bg-gray-500 text-white px-2 py-0.5 rounded-full">Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWishlist(!wishlist)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full glass-card flex items-center justify-center transition-all"
        >
          <Heart className={`w-4 h-4 ${wishlist ? 'text-red-400 fill-red-400' : 'text-gray-400'}`} />
        </button>

        {/* Quick view */}
        <Link
          href={`/shop/${product.slug}`}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full glass-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Eye className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          <span className="text-xs font-semibold text-gold-400">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Name */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white mb-2 hover:text-saffron-400 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Zodiac suitable */}
        <p className="text-xs text-gray-500 mb-2">
          ♈ Suitable: {product.zodiacSuitable.join(', ')}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.benefits.slice(0, 2).map(b => (
            <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/8 text-saffron-400/80 border border-saffron-500/15">
              {b}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-saffron-400">
            ₹{(product.discountPrice || product.price).toLocaleString()}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            product.inStock
              ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:shadow-saffron hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 20000])

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if ((p.discountPrice || p.price) < priceRange[0] || (p.discountPrice || p.price) > priceRange[1]) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price_low') return (a.discountPrice || a.price) - (b.discountPrice || b.price)
    if (sort === 'price_high') return (b.discountPrice || b.price) - (a.discountPrice || a.price)
    if (sort === 'rating') return b.rating - a.rating
    return b.reviewCount - a.reviewCount
  })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
            Spiritual <span className="text-shimmer">Shop</span>
          </h1>
          <p className="text-gray-400">Certified & energized products — delivered to your door</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-saffron-gradient text-white shadow-saffron'
                  : 'glass-card text-gray-300 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gemstones, rudraksha, yantra..."
              className="input-cosmic pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-cosmic sm:w-48"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-5">
          Showing {filtered.length} products
          {selectedCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
        </p>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-5xl block mb-4">🔍</span>
            <p>No products found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '✅', title: 'Certified Products', desc: 'Lab tested & genuine' },
            { icon: '🕉️', title: 'Energized', desc: 'Pooja performed before shipping' },
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
          ].map(badge => (
            <div key={badge.title} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{badge.icon}</div>
              <p className="text-sm font-semibold text-white">{badge.title}</p>
              <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
