import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PoojaPage from '@/components/consultation/PoojaPage'
export default function Page() {
  return (
    <div className="relative z-10">
      <Navbar />
      <PoojaPage />
      <Footer />
    </div>
  )
}
