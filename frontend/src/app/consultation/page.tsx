import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ConsultationPage from '@/components/consultation/ConsultationPage'

export default function Page() {
  return (
    <div className="relative z-10">
      <Navbar />
      <ConsultationPage />
      <Footer />
    </div>
  )
}
