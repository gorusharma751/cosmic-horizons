'use client'
import { useState } from 'react'
import { X, Phone, ArrowRight, Loader2, Star, Check } from 'lucide-react'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'

type Step = 'phone' | 'otp' | 'register'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { setUser, setToken } = useAuthStore()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSendOTP = async () => {
    if (phone.length !== 10) { toast.error('Valid 10-digit number daalo'); return }
    setLoading(true)
    try {
      const res: any = await authAPI.sendOTP(phone)
      setIsNewUser(res.isNewUser)
      setStep('otp')
      toast.success('OTP bheja gaya!')
    } catch (err: any) {
      toast.error(err.message || 'OTP send karne mein error')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpStr = otp.join('')
    if (otpStr.length !== 6) { toast.error('6-digit OTP daalo'); return }
    setLoading(true)
    try {
      const res: any = await authAPI.verifyOTP(phone, otpStr)
      if (res.isNewUser) {
        setStep('register')
      } else {
        setToken(res.token)
        setUser(res.user)
        toast.success(`Welcome back, ${res.user.name}!`)
        onClose()
      }
    } catch (err: any) {
      toast.error(err.message || 'OTP galat hai')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name.trim()) { toast.error('Naam daalo'); return }
    setLoading(true)
    try {
      const res: any = await authAPI.register({ phone, name, email })
      setToken(res.token)
      setUser(res.user)
      toast.success(`Welcome to Cosmic Horizons, ${name}!`)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Registration mein error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 md:p-8 z-10">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <Star className="w-10 h-10 text-gold-400 mx-auto mb-2" strokeWidth={1.5} />
          <h2 className="font-display text-2xl text-white">Cosmic Horizons</h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 'phone' && 'Login ya register karein'}
            {step === 'otp' && 'OTP verify karein'}
            {step === 'register' && 'Profile complete karein'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['phone', 'otp', 'register'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s ? 'bg-saffron-500 text-white' :
                ['phone', 'otp', 'register'].indexOf(step) > i ? 'bg-green-500 text-white' :
                'bg-deep-600 text-gray-500'
              }`}>
                {['phone', 'otp', 'register'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-px ${['phone', 'otp', 'register'].indexOf(step) > i ? 'bg-green-500' : 'bg-deep-600'}`} />}
            </div>
          ))}
        </div>

        {/* Step: Phone */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 glass-card px-3 text-gray-300 text-sm whitespace-nowrap">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="input-cosmic flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>
            </div>
            <button onClick={handleSendOTP} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 text-center">
              OTP bheja gaya +91 {phone} par
            </p>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus()
                    }
                  }}
                  className="w-12 h-12 text-center text-xl font-bold bg-deep-700/50 border border-gold-400/20 rounded-xl text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500"
                />
              ))}
            </div>
            <button onClick={handleVerifyOTP} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']) }} className="w-full text-sm text-gray-500 hover:text-gray-300 text-center">
              ← Change number
            </button>
          </div>
        )}

        {/* Step: Register */}
        {step === 'register' && (
          <div className="space-y-4">
            <p className="text-sm text-green-400 text-center">✓ OTP verified! Profile complete karein</p>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Aapka Naam *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="input-cosmic"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-cosmic"
              />
            </div>
            <button onClick={handleRegister} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
