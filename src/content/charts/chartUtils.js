function hexToRgba(hex, alpha = 1) {
  const value = hex.replace('#', '');
  if (![3, 6].includes(value.length)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const normalized = value.length === 3 ? value.split('').map((char) => `${char}${char}`).join('') : value;
  const int = Number.parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getChartPalette(theme, customPalette = []) {
  const themePalette = [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.tertiary,
    theme.colors.secondary,
    theme.colors.muted,
  ].filter(Boolean);

  const palette = [...customPalette, ...themePalette];
  return palette.length > 0 ? palette : ['#4f81bd', '#c0504d', '#9bbb59', '#8064a2'];
}

export function getChartContainerStyle(theme) {
  return {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: '10px 12px',
    width: '100%',
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gap: '8px',
    overflow: 'hidden',
  };
}

export function getLegendTextStyle(theme) {
  return {
    color: theme.colors.muted,
    fontSize: '0.75rem',
    fontFamily: theme.fonts.text,
  };
}

export function chartStroke(theme, alpha = 0.3) {
  return hexToRgba(theme.colors.border || theme.colors.primary || '#ffffff', alpha);
}

export function chartFill(hex, alpha = 0.2) {
  return hexToRgba(hex, alpha);
}

export function clampPositiveNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
}

export function coerceNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}
