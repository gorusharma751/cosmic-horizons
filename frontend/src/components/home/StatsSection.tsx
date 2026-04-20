'use client'
import { useEffect, useState, useRef } from 'react'

const STATS = [
  { value: 500, suffix: '+', label: 'Expert Pandits', icon: '🕉️' },
  { value: 1000000, suffix: '+', label: 'Consultations Done', icon: '📞', format: 'crore' },
  { value: 4.8, suffix: '★', label: 'Average Rating', icon: '⭐' },
  { value: 50000, suffix: '+', label: 'Happy Customers', icon: '😊', format: 'lakh' },
]

function CountUp({ target, suffix, format }: { target: number; suffix: string; format?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(current)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target])

  const display = () => {
    if (format === 'crore') return `${(count / 1000000).toFixed(1)} Cr`
    if (format === 'lakh') return `${(count / 100000).toFixed(1)}L`
    if (target === 4.8) return count.toFixed(1)
    return Math.floor(count).toLocaleString()
  }

  return <span ref={ref}>{display()}{suffix}</span>
}

export default function StatsSection() {
  return (
    <section className="relative z-10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display text-2xl md:text-3xl text-shimmer font-bold mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} format={stat.format} />
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
