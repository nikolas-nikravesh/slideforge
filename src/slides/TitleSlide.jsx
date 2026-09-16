import { Slide, Heading, Text, Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';
import { getSlideBackgroundColor, SlideBackground } from './SlideBackground';

function normalizeLogo(logo) {
  if (!logo) {
    return null;
  }

  if (typeof logo === 'string') {
    return { src: logo, alt: '' };
  }

  return logo;
}

export function TitleSlide({ title, subtitle, eyebrow, logo, background, variant = 'default', style = {} }) {
  const { tokens, accentBar } = usePresentationTheme();
  const backgroundColor = getSlideBackgroundColor(background, tokens.colors.background);
  const normalizedLogo = normalizeLogo(logo);
  const isHero = variant === 'hero';
  const showAccentBar = style.showAccentBar !== false;

  return (
    <Slide backgroundColor={backgroundColor}>
      <SlideBackground background={background} fallbackColor={tokens.colors.background} />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: tokens.fonts.text,
          fontWeight: 400,
          padding: style.padding ?? '0 48px',
        }}
      >
        {eyebrow && (
          <Box
            color={style.eyebrowColor ?? tokens.colors.accent}
            style={{
              fontFamily: tokens.fonts.text,
              fontSize: style.eyebrowFontSize ?? '0.9rem',
              fontWeight: 900,
              letterSpacing: style.eyebrowLetterSpacing ?? 0,
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            {eyebrow}
          </Box>
        )}
        <Heading
          color={style.titleColor ?? (isHero ? tokens.colors.text : tokens.colors.primary)}
          fontSize="h1"
          margin="0"
          style={{
            fontFamily: tokens.fonts.header,
            fontSize: style.titleFontSize ?? (isHero ? '4.35rem' : undefined),
            fontWeight: style.titleFontWeight ?? (isHero ? 800 : 600),
            letterSpacing: style.titleLetterSpacing ?? 0,
            lineHeight: style.titleLineHeight ?? (isHero ? 1.06 : 1.1),
            maxWidth: style.titleMaxWidth,
            textShadow: isHero ? '0 0 40px rgba(28, 254, 255, 0.18)' : undefined,
          }}
        >
          {title}
        </Heading>
        {showAccentBar && (
          <Box
            style={{
              ...accentBar,
              width: style.accentWidth ?? (isHero ? '154px' : accentBar.width),
              height: style.accentHeight ?? (isHero ? '6px' : accentBar.height),
              margin: '20px auto 0 auto',
            }}
          />
        )}
        {subtitle && (
          <Text
            color={style.subtitleColor ?? (isHero ? tokens.colors.text : tokens.colors.muted)}
            fontSize="h3"
            margin="24px 0 0 0"
            style={{
              fontFamily: tokens.fonts.text,
              fontSize: style.subtitleFontSize,
              fontWeight: style.subtitleFontWeight ?? (isHero ? 600 : 400),
              lineHeight: style.subtitleLineHeight ?? 1.3,
              maxWidth: style.subtitleMaxWidth,
              textAlign: style.subtitleTextAlign ?? 'center',
              opacity: isHero ? 0.88 : undefined,
            }}
          >
            {subtitle}
          </Text>
        )}
        {normalizedLogo && (
          <img
            src={normalizedLogo.src}
            alt={normalizedLogo.alt ?? ''}
            style={{
              width: normalizedLogo.width ?? '360px',
              maxWidth: normalizedLogo.maxWidth ?? '46vw',
              height: 'auto',
              marginTop: normalizedLogo.marginTop ?? '34px',
              filter: normalizedLogo.filter ?? 'drop-shadow(0 0 26px rgba(28, 254, 255, 0.18))',
              ...normalizedLogo.style,
            }}
          />
        )}
      </Box>
    </Slide>
  );
}
