import { createPresentationTheme } from './createPresentationTheme';

// Deep navy + warm gold theme for financial presentations
export const moneyTheme = {
  colors: {
    primary: '#c9a84c',
    secondary: '#a07c38',
    tertiary: '#e8c97a',
    accent: '#5a7d68',
    background: '#080c14',
    surface: '#0d1220',
    surfaceAlt: '#11192c',
    text: '#ede8d8',
    muted: '#b5622a',
    code: '#0a0f1c',
    codeText: '#ddd5c0',
    border: 'rgba(201, 168, 76, 0.18)',
  },
  fonts: {
    header: '"Merriweather", "Georgia", serif',
    text: '"Source Serif 4", "Iowan Old Style", "Georgia", serif',
    monospace: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },
  fontSizes: {
    h1: '4rem',
    h2: '3rem',
    h3: '2rem',
    text: '1.5rem',
    monospace: '1.2rem',
  },
  space: [16, 24, 32],
};

export const codeTheme = {
  plain: {
    backgroundColor: '#0a0f1c',
    color: '#ddd5c0',
    fontSize: '1.1rem',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    lineHeight: 1.7,
  },
  styles: [
    { types: ['keyword', 'operator'], style: { color: '#c9a84c' } },
    { types: ['string', 'attr-value'], style: { color: '#9bbb99' } },
    { types: ['number', 'boolean'], style: { color: '#e8c97a' } },
    { types: ['comment'], style: { color: '#4a5870', fontStyle: 'italic' } },
    { types: ['function', 'method', 'class-name'], style: { color: '#8fb8d4' } },
    { types: ['property', 'attr-name'], style: { color: '#d4b567' } },
    { types: ['punctuation', 'delimiter'], style: { color: '#6b7585' } },
    { types: ['variable', 'parameter'], style: { color: '#ddd5c0' } },
    { types: ['tag', 'selector'], style: { color: '#c9a84c' } },
    { types: ['builtin', 'constant'], style: { color: '#e8c97a' } },
  ],
};

export const accentBar = {
  width: '48px',
  height: '2px',
  background: 'linear-gradient(90deg, #c9a84c, rgba(201, 168, 76, 0.2))',
  borderRadius: '1px',
  margin: '8px 0 10px 0',
};

export const moneyPresentationTheme = createPresentationTheme({
  id: 'money',
  tokens: moneyTheme,
  codeTheme,
  accentBar,
});
