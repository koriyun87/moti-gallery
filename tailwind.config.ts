import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        moti: {
          primary: '#FF6B35',
          secondary: '#004E89',
          light: '#F7F7F7',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}
export default config
