import { Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';
import { InlineRichText } from './InlineRichText';

function DefaultBulletIcon({ tokens }) {
  return (
    <Box
      style={{
        width: '5px',
        height: '5px',
        background: `linear-gradient(90deg, ${tokens.colors.secondary}, ${tokens.colors.accent})`,
        borderRadius: '1px',
        transform: 'rotate(45deg)',
        justifySelf: 'center',
        opacity: 0.85,
      }}
    />
  );
}

function CustomBulletIcon({ config, tokens }) {
  if (config.render) {
    return config.render({ tokens });
  }

  if (config.symbol) {
    return (
      <span
        style={{
          background: `linear-gradient(90deg, ${tokens.colors.secondary}, ${tokens.colors.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: config.size ?? '1rem',
          justifySelf: 'center',
          opacity: 0.85,
          ...config.style,
        }}
      >
        {config.symbol}
      </span>
    );
  }

  return <DefaultBulletIcon tokens={tokens} />;
}

export function BulletList({ items, fontSize, gap }) {
  const theme = usePresentationTheme();
  const { tokens } = theme;
  const bulletIcon = theme.bulletIcon;
  const itemMargin = gap !== undefined ? gap : '14px 0';

  return (
    <Box>
      {items.map((item, idx) => (
        <Box
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '10px 1fr',
            alignItems: 'center',
            columnGap: '8px',
            margin: itemMargin,
          }}
        >
          {bulletIcon ? (
            <CustomBulletIcon config={bulletIcon} tokens={tokens} />
          ) : (
            <DefaultBulletIcon tokens={tokens} />
          )}
          <span
            style={{
              color: tokens.colors.text,
              fontSize: fontSize || '1.5rem',
              fontFamily: tokens.fonts.text,
              fontWeight: 400,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <InlineRichText text={item} tokens={tokens} />
          </span>
        </Box>
      ))}
    </Box>
  );
}
