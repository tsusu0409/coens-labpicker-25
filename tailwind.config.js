/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/proxy.ts", // リネームした場合はここも修正
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};