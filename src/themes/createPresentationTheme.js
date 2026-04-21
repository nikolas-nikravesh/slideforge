export function createSpectacleTheme(tokens) {
  return {
    colors: {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      tertiary: tokens.colors.tertiary,
    },
    backdropStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: tokens.colors.background,
    },
    fonts: {
      header: tokens.fonts.header,
      text: tokens.fonts.text,
      monospace: tokens.fonts.monospace,
    },
    fontSizes: {
      h1: tokens.fontSizes.h1,
      h2: tokens.fontSizes.h2,
      h3: tokens.fontSizes.h3,
      text: tokens.fontSizes.text,
      monospace: tokens.fontSizes.monospace,
    },
    space: tokens.space,
  };
}

export function createPresentationTheme({
  id,
  tokens,
  codeTheme,
  accentBar,
  progressBar,
  bulletIcon,
  slideNumbers,
  copyright,
}) {
  return {
    id,
    tokens,
    spectacleTheme: createSpectacleTheme(tokens),
    codeTheme,
    accentBar,
    progressBar: progressBar ?? { type: 'gradient' },
    bulletIcon: bulletIcon ?? null,
    slideNumbers: slideNumbers ?? false,
    copyright: copyright ?? null,
  };
}
