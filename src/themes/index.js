import { moneyPresentationTheme } from './moneyTheme';
import { slatePresentationTheme } from './slateTheme';
import { ledgerPresentationTheme } from './ledgerTheme';
import { carbonRosePresentationTheme } from './carbonRoseTheme';

export const themes = {
  money: moneyPresentationTheme,
  slate: slatePresentationTheme,
  ledger: ledgerPresentationTheme,
  carbonRose: carbonRosePresentationTheme,
};

export const themeRegistry = themes;

function isValidColorValue(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  // Allow common css functional/color syntaxes and hex values.
  if (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return true;
  }
  if (/^(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\(/.test(trimmed)) {
    return true;
  }
  if (/^var\(/.test(trimmed)) {
    return true;
  }

  // Allow named colors and keywords.
  return /^[a-zA-Z-]+$/.test(trimmed);
}

function sanitizeColors(candidateColors = {}, baseColors = {}) {
  const merged = { ...baseColors, ...candidateColors };
  const sanitized = {};

  for (const [key, value] of Object.entries(merged)) {
    sanitized[key] = isValidColorValue(value) ? value : baseColors[key];
  }

  return sanitized;
}

export function resolvePresentationTheme(theme) {
  if (!theme) {
    return themeRegistry.money;
  }

  if (typeof theme === 'string') {
    return themeRegistry[theme] ?? themeRegistry.money;
  }

  if (theme.id && themeRegistry[theme.id] && !theme.tokens) {
    return themeRegistry[theme.id];
  }

  const base = themeRegistry.money;
  return {
    ...base,
    ...theme,
    tokens: {
      ...base.tokens,
      ...(theme.tokens ?? {}),
      colors: {
        ...sanitizeColors(theme.tokens?.colors ?? {}, base.tokens.colors),
      },
      fonts: {
        ...base.tokens.fonts,
        ...(theme.tokens?.fonts ?? {}),
      },
      fontSizes: {
        ...base.tokens.fontSizes,
        ...(theme.tokens?.fontSizes ?? {}),
      },
    },
    spectacleTheme: theme.spectacleTheme ?? base.spectacleTheme,
    codeTheme: theme.codeTheme ?? base.codeTheme,
    accentBar: theme.accentBar ?? base.accentBar,
    progressBar: theme.progressBar ?? base.progressBar,
    bulletIcon: theme.bulletIcon ?? base.bulletIcon,
    slideNumbers: theme.slideNumbers ?? base.slideNumbers,
    copyright: theme.copyright ?? base.copyright,
  };
}

export { moneyPresentationTheme } from './moneyTheme';
export { slatePresentationTheme } from './slateTheme';
export { ledgerPresentationTheme } from './ledgerTheme';
export { carbonRosePresentationTheme } from './carbonRoseTheme';
export { moneyTheme, codeTheme, accentBar } from './moneyTheme';
export { bulletPresets, fontPresets, progressBarPresets } from './presets';
