/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        sber: {
          green: '#21A038',
          'green-light': '#E8F7EB',
          'green-dark': '#1A7F2C',
          blue: '#007AFF',
          'blue-light': '#E5F1FF',
          'blue-dark': '#0056CC',
          black: '#1A1A1A',
          gray: '#8E8E93',
          'gray-light': '#F2F2F7',
          'gray-mid': '#D1D1D6',
        },
        priority: {
          high: '#FF3B30',
          medium: '#FF9500',
          low: '#34C759',
          none: '#C7C7CC',
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'modal': '0 8px 40px rgba(0,0,0,0.18)',
        'bottom-nav': '0 -1px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
