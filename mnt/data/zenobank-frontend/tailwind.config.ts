import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        panel: '#07111f',
        panelSoft: '#0b1730',
        primary: '#3b82f6',
        accent: '#60a5fa',
        electric: '#38bdf8',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96,165,250,0.12), 0 0 20px rgba(59,130,246,0.20)',
        ambient: '0 30px 80px rgba(2, 8, 23, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        drift: 'drift 22s linear infinite',
        shine: 'shine 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.95' },
        },
        drift: {
          '0%': { transform: 'translate3d(-5%, 0, 0)' },
          '50%': { transform: 'translate3d(5%, -2%, 0)' },
          '100%': { transform: 'translate3d(-5%, 0, 0)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'premium-grid': 'linear-gradient(rgba(96,165,250,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.07) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
