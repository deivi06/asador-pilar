/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Yeseva One"', 'Georgia', 'serif'],
        sans: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // pimentón — aliased to the exact brand red sampled from the real logo
        pimenton: {
          50: '#FDECE7',
          100: '#FBD2C4',
          200: '#F5A588',
          300: '#EC7854',
          400: '#E14E28',
          500: '#D42B00',
          600: '#B32400',
          700: '#8C1C00',
          800: '#6E1600',
          900: '#4A0F00',
        },
        // brasa — near-black roasted-crust brown, replaces pure black/grey
        brasa: {
          50: '#F4EFE8',
          100: '#E4D9C9',
          200: '#C3B29A',
          300: '#9E8768',
          400: '#6E5642',
          500: '#4A3B2C',
          600: '#3A2E22',
          700: '#2A1E16',
          800: '#1D140D',
          900: '#120C07',
        },
        // oro — roasted-skin gold, used sparingly for prices/highlights
        oro: {
          100: '#F6E4BC',
          200: '#EAC57C',
          300: '#DDA84C',
          400: '#C98A2E',
          500: '#A96C1E',
        },
        // oliva — fresh-herb green for "available"/success
        oliva: {
          100: '#E4E8D6',
          400: '#7C8E56',
          500: '#5C6B3F',
          600: '#495530',
        },
        papel: '#F3ECDD',
        'papel-oscuro': '#E9DFC9',
        // --- Admin dashboard tokens (sampled from the real Asadero Pilar logo) ---
        ink: {
          50: '#F4F5F7',
          100: '#E7E8EC',
          200: '#C7C9D1',
          400: '#6B6E7A',
          600: '#33353E',
          700: '#24252C',
          800: '#1B1C22',
          900: '#131318',
        },
        rojo: {
          50: '#FDECE7',
          100: '#FBD2C4',
          200: '#F5A588',
          300: '#EC7854',
          400: '#E14E28',
          500: '#D42B00',
          600: '#B32400',
          700: '#8C1C00',
        },
      },
      boxShadow: {
        ticket: '0 1px 0 rgba(42, 30, 22, 0.06)',
        stamp: '0 2px 8px rgba(42, 30, 22, 0.18)',
      },
      borderRadius: {
        ticket: '0.375rem',
      },
    },
  },
  plugins: [],
};
