/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#142B4A',
          hover: '#0E1F35',
          light: '#1E3E6A',
          subtle: '#EBF1F8',
        },
        secondary: {
          DEFAULT: '#2457A7',
          hover: '#1B4484',
          light: '#3C73CA',
          subtle: '#EAF0F9',
        },
        teal: {
          brand: '#0D9488',
          hover: '#0F766E',
          light: '#CCFBF1',
        },
        background: 'var(--page-background)',
        surface: 'var(--surface-background)',
        foreground: 'var(--page-foreground)',
        muted: 'var(--muted-foreground)',
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#DCFCE7',
          dark: '#166534',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.15)',
        'elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
