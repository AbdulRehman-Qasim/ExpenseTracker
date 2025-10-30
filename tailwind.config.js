/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#6366F1", // indigo-500
          600: "#4F46E5", // indigo-600
          700: "#4338CA", // indigo-700
        },
        accent: {
          500: "#06B6D4", // cyan-500
          600: "#0891B2", // cyan-600
        },
        surface: {
          50: "#F9FBFF",
          100: "#F3F6FF",
          200: "#EAF0FF",
          300: "#FFFFFF",
        }
      },
      boxShadow: {
        glow: "0 12px 40px rgba(99, 102, 241, 0.25)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
