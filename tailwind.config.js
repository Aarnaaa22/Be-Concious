/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berry: {
          DEFAULT: '#92003A',
          dark: '#6F002C',
          light: '#AB0F49',
          50: '#FDF2F6',
          100: '#FBE6EE',
          200: '#F5C1D5',
        },
        vibrant: {
          DEFAULT: '#F62477',
          hover: '#E01768',
          50: '#FFF1F6',
          100: '#FFE2EE',
        },
        soft: {
          DEFAULT: '#FFADEE',
          light: '#FFF0FA',
          border: '#F6B7E7',
          deep: '#E680D1',
        },
        warm: {
          DEFAULT: '#FFE185',
          light: '#FFF8E1',
          dark: '#B8860B',
          accent: '#FFD34D',
        },
        brand: {
          bg: '#FFFAFC',
          card: '#FFFFFF',
          text: '#30232A',
          muted: '#6B5863',
          subtle: '#8C7783',
          border: '#F0E2EB',
          borderLight: '#F7EEF3',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(146, 0, 58, 0.05), 0 2px 6px -1px rgba(48, 35, 42, 0.03)',
        'soft-md': '0 8px 30px -4px rgba(146, 0, 58, 0.08), 0 4px 10px -2px rgba(48, 35, 42, 0.04)',
        'soft-lg': '0 16px 40px -6px rgba(146, 0, 58, 0.12), 0 6px 14px -3px rgba(48, 35, 42, 0.06)',
        'vibrant-glow': '0 8px 25px -4px rgba(246, 36, 119, 0.35)',
        'warm-glow': '0 8px 25px -4px rgba(255, 225, 133, 0.5)',
      }
    },
  },
  plugins: [],
}

