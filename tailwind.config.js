/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}", // 必要なら styles ディレクトリも含める
    "./public/**/*.html", // 必要なら public ディレクトリも含める
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
