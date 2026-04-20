import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'
import Providers from '@/components/layout/Providers'
import StarsBackground from '@/components/ui/StarsBackground'

const metadataBaseUrl = process.env.NEXT_PUBLIC_APP_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: 'Cosmic Horizons | Astrology Consultancy',
  description: 'India\'s premier astrology platform. Talk to expert pandits for kundli, horoscope, vastu, and spiritual guidance.',
  keywords: 'astrology, kundli, horoscope, pandit, vastu, gemstone, rudraksha, jyotish',
  openGraph: {
    title: 'Cosmic Horizons | Astrology Consultancy',
    description: 'Talk to expert pandits for kundli, horoscope & spiritual guidance',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Noto+Serif+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-deep-900 text-white antialiased">
        <StarsBackground />
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26,19,48,0.95)',
                color: '#f3f0ff',
                border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#ff7d0f', secondary: '#0a0612' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0a0612' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
