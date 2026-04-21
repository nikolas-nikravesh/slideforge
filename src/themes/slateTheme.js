import { createPresentationTheme } from './createPresentationTheme';

const slateTokens = {
  colors: {
    primary: '#a9c6ff',
    secondary: '#7fa7f7',
    tertiary: '#d3e2ff',
    accent: '#7eb8a7',
    background: '#0b1018',
    surface: '#141c29',
    surfaceAlt: '#1a2535',
    text: '#e8edf6',
    muted: '#8ea1bf',
    code: '#0f1724',
    codeText: '#e8edf6',
    border: 'rgba(169, 198, 255, 0.2)',
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

const accentBar = {
  width: '48px',
  height: '2px',
  background: 'linear-gradient(90deg, #a9c6ff, rgba(169, 198, 255, 0.2))',
  borderRadius: '1px',
  margin: '8px 0 10px 0',
};

const codeTheme = {
  plain: {
    backgroundColor: '#0f1724',
    color: '#e8edf6',
    fontSize: '1.1rem',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    lineHeight: 1.7,
  },
  styles: [
    { types: ['keyword', 'operator'], style: { color: '#a9c6ff' } },
    { types: ['string', 'attr-value'], style: { color: '#9ac6b2' } },
    { types: ['number', 'boolean'], style: { color: '#d3e2ff' } },
    { types: ['comment'], style: { color: '#7588a8', fontStyle: 'italic' } },
  ],
};

export const slatePresentationTheme = createPresentationTheme({
  id: 'slate',
  tokens: slateTokens,
  codeTheme,
  accentBar,
});
