'use client'
import LoginModal from '@/components/auth/LoginModal'
import { useUIStore } from '@/store'

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isLoginModalOpen, closeLoginModal } = useUIStore()

  return (
    <>
      {children}
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  )
}
