/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production'
const defaultBackendUrl = 'https://cosmic-horizons.onrender.com'

const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'cosmic-horizons.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || defaultBackendUrl,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || defaultBackendUrl,
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
  },
}

module.exports = nextConfig
