/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#212121',
        card: '#ffffff',
        'card-foreground': '#212121',
        popover: '#ffffff',
        'popover-foreground': '#212121',
        primary: '#212121',
        'primary-foreground': '#ffffff',
        secondary: '#f5f5f5',
        'secondary-foreground': '#212121',
        muted: '#f5f5f5',
        'muted-foreground': '#727272',
        accent: '#f5f5f5',
        'accent-foreground': '#212121',
        destructive: '#ee5350',
        border: '#e3e3e3',
        input: '#e3e3e3',
        ring: '#212121',
        sidebar: '#fafafa',
        'sidebar-foreground': '#212121',
        'sidebar-primary': '#212121',
        'sidebar-primary-foreground': '#ffffff',
        'sidebar-accent': '#f5f5f5',
        'sidebar-accent-foreground': '#212121',
        'sidebar-border': '#e3e3e3',
      },
      borderRadius: {
        lg: '0.625rem',
        md: 'calc(0.625rem - 2px)',
        sm: 'calc(0.625rem - 4px)',
      },
    },
  },
  plugins: [],
}
