/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#497CBF',  // 메인 파란색 — bg-primary
          dark:    '#3A5A8C',  // 진한 파란색 — bg-primary-dark
          light:   '#8FAFD9',  // 연한 파란색 — bg-primary-light
        },
        surface: {
          bg:    '#CEDEF2',  // 페이지 배경 — bg-surface-bg
          card:  '#FFFFFF',  // 카드/입력창 배경 — bg-surface-card
          border:'#8FAFD9',  // 기본 테두리 — border-surface-border
        },
        text: {
          heading: '#1D2F40',  // 제목 색상 — text-text-heading
        },
      },
    },
  },
  plugins: [],
}