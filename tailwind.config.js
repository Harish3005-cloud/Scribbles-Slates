/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:       '#264653',   // Primary — Ink Blue (headers, buttons)
        inkLight:  '#2E6B80',   // Lighter ink for hover
        inkDark:   '#1A3540',   // Darker ink for pressed
        cream:     '#FDFCF0',   // Background — Cream Paper
        parchment: '#F5F0DC',   // Secondary bg / card bg
        slate:     '#6B7280',   // Muted text
        gold:      '#D4A853',   // Accent — Ink Gold
        goldLight: '#F0C97A',   // Gold hover
        success:   '#2D6A4F',   // Stock in-stock green
        danger:    '#9B2226',   // Error / low-stock red
        warning:   '#CA6702',   // Discount / warning amber
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:   '0 2px 12px rgba(38,70,83,0.08)',
        cardHover: '0 6px 24px rgba(38,70,83,0.14)',
        drawer: '-4px 0 32px rgba(38,70,83,0.18)',
        header: '0 2px 16px rgba(38,70,83,0.12)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up':   'slideUp 0.3s ease-out',
        'badge-pop':  'badgePop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:  { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        badgePop: { '0%': { transform: 'scale(0)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
