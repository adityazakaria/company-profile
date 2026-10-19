/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' } },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F2295B', // merah marun (aksen)
          dark: '#C8123F', // hover & teks kecil (kontras lebih baik di atas putih)
          light: '#FDE8EE',
        },
        navy: {
          DEFAULT: '#061B3D', // biru dongker
          light: '#0D2B5C',
          muted: '#4A5A78',
        },
        surface: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(6,27,61,.06), 0 8px 24px -8px rgba(6,27,61,.12)',
        lift: '0 2px 4px rgba(6,27,61,.08), 0 20px 40px -12px rgba(6,27,61,.22)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { 'fade-up': 'fade-up .5s ease-out both' },
    },
  },
  plugins: [],
};
