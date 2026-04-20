import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HoroscopePage from '@/components/kundli/HoroscopePage'

export default function Page() {
  return (
    <div className="relative z-10">
      <Navbar />
      <HoroscopePage />
      <Footer />
    </div>
  )
}
