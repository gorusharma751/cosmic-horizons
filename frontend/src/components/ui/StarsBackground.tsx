'use client'
import { useEffect, useRef } from 'react'

export default function StarsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create stars
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 3 + 1
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: white;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.1};
        animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
      `
      container.appendChild(star)
    }

    // Shooting stars
    const createShootingStar = () => {
      const shooting = document.createElement('div')
      shooting.style.cssText = `
        position: absolute;
        width: 80px;
        height: 1px;
        background: linear-gradient(90deg, white, transparent);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 50}%;
        transform: rotate(-45deg);
        opacity: 0;
        animation: shootingStar 1.5s ease-out forwards;
      `
      container.appendChild(shooting)
      setTimeout(() => shooting.remove(), 1500)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.5) createShootingStar()
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @keyframes shootingStar {
          0% { opacity: 0; transform: rotate(-45deg) translateX(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: rotate(-45deg) translateX(200px); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at top, #1a1330 0%, #0a0612 70%)' }}
      />
    </>
  )
}
