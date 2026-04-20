import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { User } from '@/types'

// ========== AUTH STORE ==========
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
  updateWallet: (balance: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => {
        Cookies.set('token', token, { expires: 7 })
        set({ token, isAuthenticated: true })
      },
      logout: () => {
        Cookies.remove('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateWallet: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, walletBalance: balance } : null,
        })),
    }),
    { name: 'cosmic-auth' }
  )
)

// ========== CART STORE ==========
interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalAmount: () => number
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity === 0
            ? state.items.filter((i) => i.productId !== productId)
            : state.items.map((i) => i.productId === productId ? { ...i, quantity } : i),
        })),
      clearCart: () => set({ items: [] }),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cosmic-cart' }
  )
)

// ========== UI STORE ==========
interface UIState {
  isMobileMenuOpen: boolean
  isLoginModalOpen: boolean
  isSearchOpen: boolean
  selectedLanguage: 'hindi' | 'english'
  notification: { message: string; type: 'success' | 'error' | 'info' } | null
  toggleMobileMenu: () => void
  openLoginModal: () => void
  closeLoginModal: () => void
  toggleSearch: () => void
  setLanguage: (lang: 'hindi' | 'english') => void
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  clearNotification: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isLoginModalOpen: false,
  isSearchOpen: false,
  selectedLanguage: 'hindi',
  notification: null,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}))

// ========== CONSULTATION STORE ==========
interface ConsultationState {
  activeConsultationId: string | null
  consultationType: 'call' | 'chat' | 'video' | null
  panditId: string | null
  startTime: number | null
  messages: Array<{ id: string; senderId: string; message: string; createdAt: string }>
  startConsultation: (id: string, type: any, panditId: string) => void
  endConsultation: () => void
  addMessage: (msg: any) => void
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  activeConsultationId: null,
  consultationType: null,
  panditId: null,
  startTime: null,
  messages: [],
  startConsultation: (id, type, panditId) =>
    set({ activeConsultationId: id, consultationType: type, panditId, startTime: Date.now() }),
  endConsultation: () =>
    set({ activeConsultationId: null, consultationType: null, panditId: null, startTime: null, messages: [] }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
}))
