// ========== USER TYPES ==========
export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'user' | 'pandit' | 'admin'
  walletBalance: number
  dateOfBirth?: string
  timeOfBirth?: string
  placeOfBirth?: string
  zodiacSign?: string
  language: 'hindi' | 'english'
  isVerified: boolean
  createdAt: string
}

// ========== PANDIT TYPES ==========
export interface Pandit {
  id: string
  userId: string
  name: string
  avatar: string
  expertise: string[]
  languages: string[]
  experience: number
  rating: number
  totalConsultations: number
  reviewCount: number
  callRate: number   // per minute in INR
  chatRate: number
  videoRate: number
  isOnline: boolean
  isLive: boolean
  bio: string
  education: string
  certifications: string[]
  about: string
  followersCount: number
  nextAvailable?: string
}

// ========== CONSULTATION TYPES ==========
export type ConsultationType = 'call' | 'chat' | 'video' | 'live'

export interface Consultation {
  id: string
  userId: string
  panditId: string
  pandit?: Pandit
  type: ConsultationType
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  duration?: number  // in seconds
  amount: number
  rating?: number
  review?: string
  startedAt?: string
  endedAt?: string
  createdAt: string
}

// ========== KUNDLI TYPES ==========
export interface KundliRequest {
  name: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  gender: 'male' | 'female' | 'other'
  language: 'hindi' | 'english'
}

export interface KundliReport {
  id: string
  userId?: string
  name: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  gender: string
  sunSign: string
  moonSign: string
  ascendant: string
  nakshatra: string
  planetary: PlanetaryPosition[]
  predictions: {
    general: string
    career: string
    love: string
    health: string
    finance: string
  }
  remedies: string[]
  luckyColor: string
  luckyNumber: number
  luckyDay: string
  gemstone: string
  pdfUrl?: string
  createdAt: string
}

export interface PlanetaryPosition {
  planet: string
  sign: string
  house: number
  degree: string
  isRetrograde: boolean
}

// ========== MATCHMAKING ==========
export interface MatchmakingReport {
  id: string
  person1: KundliRequest
  person2: KundliRequest
  totalScore: number
  maxScore: number
  compatibility: number  // percentage
  kootas: KootaScore[]
  recommendation: string
  pdfUrl?: string
  createdAt: string
}

export interface KootaScore {
  name: string
  score: number
  maxScore: number
  description: string
}

// ========== PRODUCTS ==========
export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  discountPrice?: number
  description: string
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  isFeatured: boolean
  zodiacSuitable?: string[]
  benefits: string[]
  specifications?: Record<string, string>
  weight?: string
  slug: string
}

export type ProductCategory = 
  | 'gemstone' 
  | 'rudraksha' 
  | 'mala' 
  | 'yantra' 
  | 'kavach' 
  | 'pooja-kit' 
  | 'incense'
  | 'idol'

// ========== POOJA SERVICE ==========
export interface PoojaService {
  id: string
  name: string
  type: 'online' | 'home-visit'
  category: 'pooja' | 'anusthan' | 'vastu' | 'business-pooja' | 'havan'
  price: number
  duration: string
  description: string
  benefits: string[]
  includes: string[]
  image: string
  slug: string
}

// ========== HOROSCOPE ==========
export interface Horoscope {
  sign: string
  date: string
  type: 'daily' | 'weekly' | 'monthly'
  prediction: string
  lucky: {
    color: string
    number: number
    day: string
  }
  areas: {
    love: string
    career: string
    health: string
    finance: string
  }
}

// ========== PANCHANG ==========
export interface Panchang {
  date: string
  tithi: string
  nakshatra: string
  yoga: string
  karana: string
  sunRise: string
  sunSet: string
  moonRise: string
  auspicious: string[]
  inauspicious: string[]
  festivals: string[]
  rahukaal: string
  gulika: string
}

// ========== ORDER ==========
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  paymentId?: string
  trackingId?: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  product?: Product
  quantity: number
  price: number
}

export interface Address {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

// ========== PAYMENT ==========
export interface PaymentOrder {
  orderId: string
  amount: number
  currency: string
  key: string
}

// ========== REVIEW ==========
export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  panditId?: string
  productId?: string
  rating: number
  comment: string
  createdAt: string
}

// ========== WALLET ==========
export interface WalletTransaction {
  id: string
  userId: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  consultationId?: string
  orderId?: string
  createdAt: string
}

// ========== LIVE STREAM ==========
export interface LiveStream {
  id: string
  panditId: string
  pandit?: Pandit
  title: string
  topic: string
  viewerCount: number
  isActive: boolean
  startedAt: string
  thumbnail?: string
}

// ========== API RESPONSE ==========
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ========== ZODIAC ==========
export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Mesh', english: 'Aries', symbol: '♈', date: 'Mar 21 - Apr 19' },
  { id: 'taurus', name: 'Vrishabh', english: 'Taurus', symbol: '♉', date: 'Apr 20 - May 20' },
  { id: 'gemini', name: 'Mithun', english: 'Gemini', symbol: '♊', date: 'May 21 - Jun 20' },
  { id: 'cancer', name: 'Kark', english: 'Cancer', symbol: '♋', date: 'Jun 21 - Jul 22' },
  { id: 'leo', name: 'Simha', english: 'Leo', symbol: '♌', date: 'Jul 23 - Aug 22' },
  { id: 'virgo', name: 'Kanya', english: 'Virgo', symbol: '♍', date: 'Aug 23 - Sep 22' },
  { id: 'libra', name: 'Tula', english: 'Libra', symbol: '♎', date: 'Sep 23 - Oct 22' },
  { id: 'scorpio', name: 'Vrischik', english: 'Scorpio', symbol: '♏', date: 'Oct 23 - Nov 21' },
  { id: 'sagittarius', name: 'Dhanu', english: 'Sagittarius', symbol: '♐', date: 'Nov 22 - Dec 21' },
  { id: 'capricorn', name: 'Makar', english: 'Capricorn', symbol: '♑', date: 'Dec 22 - Jan 19' },
  { id: 'aquarius', name: 'Kumbh', english: 'Aquarius', symbol: '♒', date: 'Jan 20 - Feb 18' },
  { id: 'pisces', name: 'Meen', english: 'Pisces', symbol: '♓', date: 'Feb 19 - Mar 20' },
]
