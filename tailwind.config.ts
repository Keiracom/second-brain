import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Linear-inspired dark palette
        bg: {
          primary: '#0d0d0d',
          secondary: '#141414',
          tertiary: '#1a1a1a',
          hover: '#222222',
        },
        border: {
          DEFAULT: '#2a2a2a',
          hover: '#3a3a3a',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          tertiary: '#666666',
        },
        accent: {
          DEFAULT: '#5e5ce6',
          hover: '#7472ea',
          muted: 'rgba(94, 92, 230, 0.15)',
        },
        journal: '#22c55e',
        concept: '#3b82f6',
        decision: '#f59e0b',
        learning: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#e0e0e0',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#5e5ce6',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#888888',
            '--tw-prose-bullets': '#888888',
            '--tw-prose-hr': '#2a2a2a',
            '--tw-prose-quotes': '#a0a0a0',
            '--tw-prose-quote-borders': '#5e5ce6',
            '--tw-prose-captions': '#888888',
            '--tw-prose-code': '#e0e0e0',
            '--tw-prose-pre-code': '#e0e0e0',
            '--tw-prose-pre-bg': '#141414',
            '--tw-prose-th-borders': '#2a2a2a',
            '--tw-prose-td-borders': '#1a1a1a',
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
