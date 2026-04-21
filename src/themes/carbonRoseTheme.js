import { createPresentationTheme } from './createPresentationTheme';

const carbonRoseTokens = {
  colors: {
    primary: '#E8A0B0',
    secondary: '#C87888',
    tertiary: '#D994A4',
    accent: '#78A8C8',
    background: '#141414',
    surface: '#1E1E1E',
    surfaceAlt: '#262626',
    text: '#F0EEEE',
    muted: '#A88898',
    code: '#171717',
    codeText: '#F0EEEE',
    border: 'rgba(232, 160, 176, 0.24)',
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
  background: 'linear-gradient(90deg, #E8A0B0, rgba(232, 160, 176, 0.24))',
  borderRadius: '1px',
  margin: '8px 0 10px 0',
};

const codeTheme = {
  plain: {
    backgroundColor: '#171717',
    color: '#F0EEEE',
    fontSize: '1.1rem',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    lineHeight: 1.7,
  },
  styles: [
    { types: ['keyword', 'operator'], style: { color: '#E8A0B0' } },
    { types: ['string', 'attr-value'], style: { color: '#95B8D1' } },
    { types: ['number', 'boolean'], style: { color: '#D994A4' } },
    { types: ['comment'], style: { color: '#8E7E86', fontStyle: 'italic' } },
  ],
};

export const carbonRosePresentationTheme = createPresentationTheme({
  id: 'carbonRose',
  tokens: carbonRoseTokens,
  codeTheme,
  accentBar,
});
