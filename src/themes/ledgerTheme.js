import { createPresentationTheme } from './createPresentationTheme';

const ledgerTokens = {
  colors: {
    primary: '#b09143',
    secondary: '#8f7430',
    tertiary: '#d2bd83',
    accent: '#3f6b52',
    background: '#0e1010',
    surface: '#181c1a',
    surfaceAlt: '#202622',
    text: '#ece7d8',
    muted: '#9a8a62',
    code: '#111412',
    codeText: '#ece7d8',
    border: 'rgba(176, 145, 67, 0.22)',
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
  background: 'linear-gradient(90deg, #b09143, rgba(176, 145, 67, 0.2))',
  borderRadius: '1px',
  margin: '8px 0 10px 0',
};

const codeTheme = {
  plain: {
    backgroundColor: '#111412',
    color: '#ece7d8',
    fontSize: '1.1rem',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    lineHeight: 1.7,
  },
  styles: [
    { types: ['keyword', 'operator'], style: { color: '#b09143' } },
    { types: ['string', 'attr-value'], style: { color: '#8fbc96' } },
    { types: ['number', 'boolean'], style: { color: '#d2bd83' } },
    { types: ['comment'], style: { color: '#6f746c', fontStyle: 'italic' } },
  ],
};

export const ledgerPresentationTheme = createPresentationTheme({
  id: 'ledger',
  tokens: ledgerTokens,
  codeTheme,
  accentBar,
});
