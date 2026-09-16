import { Slide, Heading, Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';
import { getSlideBackgroundColor, SlideBackground } from './SlideBackground';

export function SlideFrame({ title, titleAlign = 'left', showAccentBar = true, background, children }) {
  const { tokens, accentBar } = usePresentationTheme();
  const backgroundColor = getSlideBackgroundColor(background, tokens.colors.background);

  return (
    <Slide backgroundColor={backgroundColor}>
      <SlideBackground background={background} fallbackColor={tokens.colors.background} />
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '16px 28px 8px 28px',
          textAlign: 'left',
          fontFamily: tokens.fonts.text,
          fontWeight: 400,
          height: '100%',
          width: '100%',
          maxWidth: '1320px',
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {title && (
          <>
            <Heading
              color={tokens.colors.primary}
              fontSize="h2"
              margin="0"
              style={{
                fontFamily: tokens.fonts.header,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                textAlign: titleAlign,
              }}
            >
              {title}
            </Heading>
            {showAccentBar ? (
              <Box
                style={{
                  ...accentBar,
                  margin: titleAlign === 'center' ? '8px auto 10px auto' : accentBar.margin,
                }}
              />
            ) : null}
          </>
        )}
        <Box color={tokens.colors.text} fontSize="text" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Slide>
  );
}
