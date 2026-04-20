import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import KundliForm from '@/components/kundli/KundliForm'

export default function KundliPage() {
  return (
    <div className="relative z-10">
      <Navbar />
      <KundliForm />
      <Footer />
    </div>
  )
}
