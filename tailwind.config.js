/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Instrument Serif',
          'ui-serif',
          'Georgia',
          'serif',
        ],
      },
      colors: {
        surface: {
          DEFAULT: '#0b0d12',
          muted: '#11141b',
          raised: '#161a23',
          border: '#222734',
        },
        ink: {
          DEFAULT: '#e9edf5',
          muted: '#9aa3b2',
          faint: '#6b7384',
        },
        accent: {
          DEFAULT: '#86b7ff',
          strong: '#5a8fff',
        },
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.6)',
        soft: '0 8px 24px -12px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse at top, rgba(134,183,255,0.10), transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
