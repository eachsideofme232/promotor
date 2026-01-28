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
        // Bloomberg Terminal-inspired color palette
        terminal: {
          bg: {
            primary: '#0a0a0a',
            secondary: '#1a1a1a',
            tertiary: '#2a2a2a',
            hover: '#333333',
          },
          text: {
            primary: '#ff9500',      // Orange headers
            secondary: '#00d4ff',    // Cyan highlights
            muted: '#888888',
            white: '#ffffff',
          },
          accent: {
            positive: '#00ff88',     // Green (up)
            negative: '#ff4444',     // Red (down)
            warning: '#ffaa00',
            info: '#00aaff',
          },
          border: {
            DEFAULT: '#333333',
            focus: '#ff9500',
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
