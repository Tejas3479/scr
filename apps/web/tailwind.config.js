/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyber-Agri Gaming Theme
        'cyber-dark': '#0D1117',
        'cyber-darker': '#050810',
        'neon-green': '#00FF41',
        'neon-cyan': '#00F0FF',
        'neon-purple': '#FF00FF',
        'neon-orange': '#FF6B00',
        'neon-pink': '#FF006B',
        'matrix-green': '#00FF41',
        'tech-blue': '#0088FF',
        'glow-violet': '#8B5CF6',
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundColor: {
        'hud-dark': 'rgba(13, 17, 23, 0.8)',
        'hud-glass': 'rgba(13, 17, 23, 0.4)',
        'neon-glow-green': 'rgba(0, 255, 65, 0.05)',
        'neon-glow-cyan': 'rgba(0, 240, 255, 0.05)',
      },
      borderColor: {
        'neon-green': '#00FF41',
        'neon-cyan': '#00F0FF',
        'glow-green': 'rgba(0, 255, 65, 0.3)',
        'glow-cyan': 'rgba(0, 240, 255, 0.3)',
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 65, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 30px rgba(255, 0, 255, 0.4)',
        'glow-sm': '0 0 10px rgba(0, 255, 65, 0.3)',
        'glow-md': '0 0 20px rgba(0, 255, 65, 0.4)',
        'glow-lg': '0 0 40px rgba(0, 240, 255, 0.5)',
        'hud-glow': 'inset 0 0 20px rgba(0, 255, 65, 0.1), 0 0 30px rgba(0, 240, 255, 0.2)',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
        'glass-thick': 'blur(20px)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 255, 65, 0.6), inset 0 0 20px rgba(0, 255, 65, 0.2)',
          },
        },
        'glow-pulse-cyan': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.2)',
          },
        },
        'level-up': {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'badge-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.1)' },
        },
        'data-pulse': {
          '0%, 100%': { opacity: '1', textShadow: '0 0 10px rgba(0, 255, 65, 0.5)' },
          '50%': { opacity: '0.8', textShadow: '0 0 20px rgba(0, 255, 65, 0.8)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0.5' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translateX(0)', opacity: '1' },
          '20%': { transform: 'translateX(-2px)', opacity: '0.8' },
          '40%': { transform: 'translateX(2px)', opacity: '1' },
          '60%': { transform: 'translateX(-2px)', opacity: '0.9' },
          '80%': { transform: 'translateX(2px)', opacity: '0.8' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'glow-pulse-cyan': 'glow-pulse-cyan 3s ease-in-out infinite',
        'level-up': 'level-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'badge-bounce': 'badge-bounce 2s ease-in-out infinite',
        'data-pulse': 'data-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      fontFamily: {
        'tech': ['JetBrains Mono', 'monospace'],
        'display': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


