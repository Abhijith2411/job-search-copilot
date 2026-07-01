import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Linear Design System - Brand & Accent
        'linear-canvas': '#010102',
        'linear-surface-1': '#0f1011',
        'linear-surface-2': '#141516',
        'linear-surface-3': '#18191a',
        'linear-surface-4': '#191a1b',
        'linear-primary': '#5e6ad2',
        'linear-primary-hover': '#828fff',
        'linear-primary-focus': '#5e69d1',

        // Text Colors
        'linear-ink': '#f7f8f8',
        'linear-ink-muted': '#d0d6e0',
        'linear-ink-subtle': '#8a8f98',
        'linear-ink-tertiary': '#62666d',

        // Borders
        'linear-hairline': '#23252a',
        'linear-hairline-strong': '#34343a',
        'linear-hairline-tertiary': '#3e3e44',

        // Semantic
        'linear-success': '#27a644',
        'linear-brand-secure': '#7a7fad',
      },
      backgroundColor: {
        'linear-canvas': '#010102',
        'linear-surface-1': '#0f1011',
        'linear-surface-2': '#141516',
        'linear-surface-3': '#18191a',
      },
      borderColor: {
        'linear-hairline': '#23252a',
        'linear-hairline-strong': '#34343a',
      },
      textColor: {
        'linear-ink': '#f7f8f8',
        'linear-ink-muted': '#d0d6e0',
        'linear-ink-subtle': '#8a8f98',
      },
      fontFamily: {
        // Fallback to system fonts since Linear's custom fonts aren't public
        'display': ['system-ui', '-apple-system', 'SF Pro Display', 'sans-serif'],
        'text': ['system-ui', '-apple-system', 'sans-serif'],
        'mono': ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-3.0px', fontWeight: '600' }],
        'display-lg': ['56px', { lineHeight: '1.10', letterSpacing: '-1.8px', fontWeight: '600' }],
        'display-md': ['40px', { lineHeight: '1.15', letterSpacing: '-1.0px', fontWeight: '600' }],
        'headline': ['28px', { lineHeight: '1.20', letterSpacing: '-0.6px', fontWeight: '600' }],
        'card-title': ['22px', { lineHeight: '1.25', letterSpacing: '-0.4px', fontWeight: '500' }],
        'subhead': ['20px', { lineHeight: '1.40', letterSpacing: '-0.2px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.50', letterSpacing: '-0.1px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.50', letterSpacing: '-0.05px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.50', letterSpacing: '0px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.40', letterSpacing: '0px', fontWeight: '400' }],
        'button': ['14px', { lineHeight: '1.20', letterSpacing: '0px', fontWeight: '500' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
        '3xl': '48px',
        'section': '96px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'xxl': '24px',
      },
      boxShadow: {
        'linear-focus': '0 0 0 2px rgba(94, 106, 210, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
