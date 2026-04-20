/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9a37',
          500: '#ff7d0f',
          600: '#f06205',
          700: '#c74a07',
          800: '#9e3b0e',
          900: '#7f320f',
        },
        deep: {
          900: '#0a0612',
          800: '#110d1f',
          700: '#1a1330',
          600: '#251a42',
          500: '#312355',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        cosmic: {
          purple: '#7c3aed',
          indigo: '#4338ca',
          pink: '#db2777',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #0a0612 0%, #1a1330 50%, #0f0a1e 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #ff7d0f 0%, #f59e0b 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,125,15,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,125,15,0.8)' },
        }
      },
      boxShadow: {
        'saffron': '0 0 30px rgba(255,125,15,0.4)',
        'gold': '0 0 20px rgba(251,191,36,0.3)',
        'cosmic': '0 25px 50px rgba(0,0,0,0.8)',
      }
    },
  },
  plugins: [],
}
