import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // System Group brand palette
        'sg-black':   '#0A0A0A',  // near-black background
        'sg-deep':    '#111111',  // cards, panels
        'sg-surface': '#1A1A1A',  // elevated surfaces
        'sg-border':  '#2A2A2A',  // subtle borders
        'sg-muted':   '#6B6B6B',  // muted text
        'sg-light':   '#E8E4DC',  // warm off-white text
        'sg-white':   '#F5F2EC',  // near-white
        'sg-gold':    '#C9A84C',  // accent gold — premium
        'sg-gold-light': '#E2C97A', // lighter gold for hover
        'sg-rust':    '#8B4513',  // deep earth tone (secondary)
      },
      fontFamily: {
        // Display: architectural, confident
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        // Body: modern, clean, legible
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Mono: labels, data
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-xl':  ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg':  ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.0', letterSpacing: '-0.015em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'line-grow': 'lineGrow 1s ease forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        lineGrow: {
          from: { scaleX: '0' },
          to:   { scaleX: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
