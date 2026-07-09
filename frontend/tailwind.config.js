/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Akole Cafe Brand Palette
        forest: {
          50: '#eef5ef',
          100: '#d7e8d8',
          200: '#b2d1b5',
          300: '#84b389',
          400: '#5c9261',
          500: '#2E7D32', // Primary Forest Green
          600: '#2c6731',
          700: '#255229',
          800: '#204223',
          900: '#1b361e',
          950: '#0e1e11',
        },
        coffee: {
          50:  '#f9f6f5',
          100: '#f0eaea',
          200: '#dfd2cd',
          300: '#c5b0a9',
          400: '#a5867d',
          500: '#88675d',
          600: '#6c4f46',
          700: '#5a413a',
          800: '#4c3833',
          900: '#3E2723', // Deep coffee brown
          950: '#2C2C2C', // Dark charcoal
        },
        cream: {
          50:  '#F5F5DC', // Cream/Beige
          100: '#fcfcf5',
          200: '#f4f3e6',
          300: '#eae7d0',
          400: '#dbd5b2',
          500: '#cac092',
          600: '#b5a770',
          700: '#948554',
          800: '#7a6e48',
          900: '#655a3d',
        },
        espresso: {
          50:  '#FAFAFA', // Warm white
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        gold: {
          400: '#e6b93d',
          500: '#D4A017', // Gold/Amber
          600: '#b0820f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #1a0f0a 0%, #2a1a10 50%, #342218 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(26,15,10,0.95) 0%, rgba(26,15,10,0.6) 60%, transparent 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'coffee': '0 4px 20px rgba(200, 164, 110, 0.2)',
        'coffee-lg': '0 8px 40px rgba(200, 164, 110, 0.3)',
        'card': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
