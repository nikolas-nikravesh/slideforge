import { Slide, Heading, Text, Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';

export function TitleSlide({ title, subtitle }) {
  const { tokens, accentBar } = usePresentationTheme();

  return (
    <Slide backgroundColor={tokens.colors.background}>
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: tokens.fonts.text,
          fontWeight: 400,
          padding: '0 48px',
        }}
      >
        <Heading
          color={tokens.colors.primary}
          fontSize="h1"
          margin="0"
          style={{
            fontFamily: tokens.fonts.header,
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          {title}
        </Heading>
        <Box style={{ ...accentBar, margin: '20px auto 0 auto' }} />
        {subtitle && (
          <Text
            color={tokens.colors.muted}
            fontSize="h3"
            margin="24px 0 0 0"
            style={{ fontFamily: tokens.fonts.text, fontWeight: 400 }}
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </Slide>
  );
}
