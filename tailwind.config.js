/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
      {
        omni: {
          "primary": "oklch(55% 0.3 240)",
          "primary-content": "oklch(98% 0.01 240)",
          "secondary": "oklch(70% 0.25 200)",
          "secondary-content": "oklch(98% 0.01 200)",
          "accent": "oklch(65% 0.25 160)",
          "accent-content": "oklch(98% 0.01 160)",
          "neutral": "oklch(50% 0.05 240)",
          "neutral-content": "oklch(98% 0.01 240)",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#e5e6e6",
          "base-content": "oklch(20% 0.05 240)",
          "info": "oklch(70% 0.2 220)",
          "info-content": "oklch(98% 0.01 220)",
          "success": "oklch(65% 0.25 140)",
          "success-content": "oklch(98% 0.01 140)",
          "warning": "oklch(80% 0.25 80)",
          "warning-content": "oklch(20% 0.05 80)",
          "error": "oklch(65% 0.3 30)",
          "error-content": "oklch(98% 0.01 30)",
          "--radius-selector": "1rem",
          "--radius-field": "0.25rem",
          "--radius-box": "0.5rem",
          "--size-selector": "0.25rem",
          "--size-field": "0.25rem",
          "--border": "1px",
          "--border-color-input": "oklab(0.931 0 0)",
          "--depth": "1",
          "--noise": "0",
        },
      },
    ],
  }
}
