import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ShopPage from '@/components/store/ShopPage'

export default function Page() {
  return (
    <div className="relative z-10">
      <Navbar />
      <ShopPage />
      <Footer />
    </div>
  )
}
