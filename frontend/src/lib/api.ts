import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ========== AUTH API ==========
export const authAPI = {
  sendOTP: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
}

// ========== PANDIT API ==========
export const panditAPI = {
  getAll: (params?: any) => api.get('/pandits', { params }),
  getById: (id: string) => api.get(`/pandits/${id}`),
  getOnline: () => api.get('/pandits/online'),
  getFeatured: () => api.get('/pandits/featured'),
  getLiveStreams: () => api.get('/pandits/live-streams'),
  getReviews: (id: string) => api.get(`/pandits/${id}/reviews`),
  search: (query: string) => api.get('/pandits/search', { params: { q: query } }),
}

// ========== CONSULTATION API ==========
export const consultationAPI = {
  initiate: (panditId: string, type: string) => api.post('/consultations/initiate', { panditId, type }),
  getHistory: () => api.get('/consultations/history'),
  getById: (id: string) => api.get(`/consultations/${id}`),
  end: (id: string) => api.put(`/consultations/${id}/end`),
  rate: (id: string, rating: number, review: string) => api.post(`/consultations/${id}/rate`, { rating, review }),
  chat: {
    getMessages: (consultationId: string) => api.get(`/consultations/${consultationId}/messages`),
    send: (consultationId: string, message: string) => api.post(`/consultations/${consultationId}/messages`, { message }),
  }
}

// ========== KUNDLI API ==========
export const kundliAPI = {
  generate: (data: any) => api.post('/kundli/generate', data),
  getById: (id: string) => api.get(`/kundli/${id}`),
  getHistory: () => api.get('/kundli/history'),
  matchmaking: (data: any) => api.post('/kundli/matchmaking', data),
  downloadPDF: (id: string) => api.get(`/kundli/${id}/pdf`, { responseType: 'blob' }),
  getHoroscope: (sign: string, type: string) => api.get(`/horoscope/${sign}`, { params: { type } }),
  getPanchang: (date?: string) => api.get('/panchang', { params: { date } }),
}

// ========== PRODUCT API ==========
export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  getFeatured: () => api.get('/products/featured'),
  search: (query: string) => api.get('/products/search', { params: { q: query } }),
  getReviews: (id: string) => api.get(`/products/${id}/reviews`),
}

// ========== POOJA API ==========
export const poojaAPI = {
  getAll: () => api.get('/pooja'),
  getById: (id: string) => api.get(`/pooja/${id}`),
  book: (data: any) => api.post('/pooja/book', data),
  getBookings: () => api.get('/pooja/bookings'),
}

// ========== ORDER API ==========
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
}

// ========== PAYMENT API ==========
export const paymentAPI = {
  createOrder: (amount: number, type: string) => api.post('/payments/create-order', { amount, type }),
  verify: (data: any) => api.post('/payments/verify', data),
  addWalletMoney: (amount: number) => api.post('/payments/wallet/add', { amount }),
  getTransactions: () => api.get('/payments/transactions'),
}

// ========== ADMIN API ==========
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getPandits: (params?: any) => api.get('/admin/pandits', { params }),
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  getConsultations: (params?: any) => api.get('/admin/consultations', { params }),
  getRevenue: (period: string) => api.get('/admin/revenue', { params: { period } }),
  approvePandit: (id: string) => api.put(`/admin/pandits/${id}/approve`),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  createPooja: (data: any) => api.post('/admin/pooja', data),
  getAnalytics: () => api.get('/admin/analytics'),
  getSocialPosts: (params?: any) => api.get('/admin/social-media/posts', { params }),
  getSocialStats: () => api.get('/admin/social-media/stats'),
  getSocialSettings: () => api.get('/admin/social-media/settings'),
  saveSocialSettings: (data: any) => api.post('/admin/social-media/settings', data),
  generateSocialPost: (data: any) => api.post('/admin/social-media/generate', data),
  generateAllRashifal: (data: any) => api.post('/admin/social-media/generate-all-rashifal', data),
  publishSocialPost: (id: string) => api.post(`/admin/social-media/posts/${id}/publish`),
  deleteSocialPost: (id: string) => api.delete(`/admin/social-media/posts/${id}`),
}

// ========== PANDIT DASHBOARD API ==========
export const panditDashAPI = {
  getProfile: () => api.get('/pandit/profile'),
  updateProfile: (data: any) => api.put('/pandit/profile', data),
  setAvailability: (isOnline: boolean) => api.put('/pandit/availability', { isOnline }),
  getConsultations: () => api.get('/pandit/consultations'),
  getEarnings: () => api.get('/pandit/earnings'),
  requestWithdrawal: (amount: number) => api.post('/pandit/withdrawal', { amount }),
  startLive: (data: any) => api.post('/pandit/live/start', data),
  endLive: () => api.put('/pandit/live/end'),
}

// ========== SOCIAL API ==========
export const socialAPI = {
  getYouTubeVideos: () => api.get('/social/youtube'),
  getInstagramPosts: () => api.get('/social/instagram'),
}

export default api
