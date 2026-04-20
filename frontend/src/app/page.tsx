import HeroSection from '@/components/home/HeroSection'
import ZodiacSection from '@/components/home/ZodiacSection'
import FeaturedPandits from '@/components/home/FeaturedPandits'
import ServicesSection from '@/components/home/ServicesSection'
import HoroscopePreview from '@/components/home/HoroscopePreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ProductsPreview from '@/components/home/ProductsPreview'
import StatsSection from '@/components/home/StatsSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LiveBanner from '@/components/home/LiveBanner'

export default function HomePage() {
  return (
    <div className="relative z-10">
      <Navbar />
      <main>
        <HeroSection />
        <LiveBanner />
        <StatsSection />
        <ServicesSection />
        <FeaturedPandits />
        <ZodiacSection />
        <HoroscopePreview />
        <ProductsPreview />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
