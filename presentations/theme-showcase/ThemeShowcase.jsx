import { useMemo, useState } from 'react';
import { Box } from 'spectacle';
import { InlineRichText, Presentation, themes, useDeckTheme, bulletPresets, progressBarPresets } from 'slideforge';
import { useStaggerSlideIn } from './useStaggerSlideIn';

const { Deck, create, slide, blocks: b } = Presentation;

function ThemeLab({ activeThemeId, onThemeChange }) {
  const { tokens } = useDeckTheme();
  const paletteTokens = [
    { label: 'Background', use: 'Slide canvas', value: tokens.colors.background },
    { label: 'Surface', use: 'Base panel color', value: tokens.colors.surface },
    { label: 'Surface Alt', use: 'Secondary panel layer', value: tokens.colors.surfaceAlt },
    { label: 'Headings', use: 'Primary title emphasis', value: tokens.colors.primary },
    { label: 'Accent', use: 'Bullets and progress bar', value: tokens.colors.accent },
    { label: 'Body Text', use: 'Default paragraph color', value: tokens.colors.text },
  ];

  return (
    <Box style={{ display: 'grid', gap: '18px' }}>
      <Box
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {Object.keys(themes).map((themeId) => {
          const isActive = themeId === activeThemeId;
          return (
            <button
              key={themeId}
              type="button"
              onClick={() => onThemeChange(themeId)}
              style={{
                backgroundColor: isActive ? tokens.colors.primary : tokens.colors.surfaceAlt,
                color: isActive ? tokens.colors.background : tokens.colors.text,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: '999px',
                padding: '8px 14px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {themeId}
            </button>
          );
        })}
      </Box>

      <Box
        style={{
          border: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.surface,
          borderRadius: '14px',
          padding: '18px',
          width: '100%',
          maxWidth: '1120px',
          margin: '0 auto',
        }}
      >
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${paletteTokens.length}, minmax(0, 1fr))`,
            gap: '12px',
          }}
        >
          {paletteTokens.map((token) => (
            <Box key={token.label} style={{ display: 'grid', gap: '8px' }}>
              <Box
                style={{
                  height: '130px',
                  backgroundColor: token.value,
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                }}
              />
              <Box style={{ color: tokens.colors.text, fontSize: '1rem', fontWeight: 600 }}>{token.label}</Box>
              <Box style={{ color: tokens.colors.text, fontSize: '0.88rem', opacity: 0.8 }}>{token.use}</Box>
              <Box style={{ color: tokens.colors.muted, fontSize: '0.9rem', letterSpacing: '0.03em' }}>
                {token.value.toUpperCase()}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function MotionDirections() {
  const { tokens } = useDeckTheme();
  const lineStyle = useStaggerSlideIn({ baseDelay: 360, stepDelay: 260, duration: 700, distance: 26 });
  const lines = [
    { text: 'Narrative enters from left', direction: 'left' },
    { text: 'Counterpoint enters from right', direction: 'right' },
    { text: 'Conclusion rises from bottom', direction: 'bottom' },
  ];

  return (
    <Box style={{ display: 'grid', gap: '16px' }}>
      {lines.map((line, index) => (
        <Box
          key={line.text}
          style={{
            ...lineStyle(index, line.direction),
            color: tokens.colors.text,
            textAlign: 'center',
            fontSize: '1.8rem',
            fontFamily: tokens.fonts.header,
            fontWeight: 600,
          }}
        >
          {line.text}
        </Box>
      ))}
    </Box>
  );
}

function AdvancedMotionPanel() {
  const { tokens } = useDeckTheme();
  const rowStyle = useStaggerSlideIn({ baseDelay: 320, stepDelay: 240, duration: 680, distance: 16 });
  const rows = [
    { text: 'Deck config stays declarative and readable', direction: 'left' },
    { text: 'Custom React plugs in only where it adds value', direction: 'right' },
    { text: 'Theme tokens keep visual language coherent', direction: 'bottom' },
  ];

  return (
    <Box style={{ display: 'grid', gap: '14px' }}>
      <Box
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '12px',
          padding: '18px 20px',
          display: 'grid',
          gap: '8px',
        }}
      >
        <Box style={{ color: tokens.colors.muted, fontSize: '1.1rem' }}>Animation Strategy</Box>
        <Box style={{ color: tokens.colors.primary, fontSize: '2rem', fontFamily: tokens.fonts.header, fontWeight: 600 }}>
          Composed and Controlled
        </Box>
      </Box>

      <Box
        style={{
          backgroundColor: tokens.colors.surfaceAlt,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '12px',
          padding: '16px 18px',
          display: 'grid',
          gap: '10px',
        }}
      >
        {rows.map((row, index) => (
          <Box
            key={row.text}
            style={{
              ...rowStyle(index, row.direction),
              color: tokens.colors.text,
              fontSize: '1.1rem',
              borderLeft: `2px solid ${tokens.colors.accent}`,
              paddingLeft: '10px',
            }}
          >
            {row.text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function AdvancedEffectsShowcase() {
  const { tokens } = useDeckTheme();

  const features = [
    { title: 'Particles', desc: 'Floating particle systems', delay: 0 },
    { title: 'Gradients', desc: 'Animated color shifts', delay: 0.1 },
    { title: 'Glass', desc: 'Frosted blur effects', delay: 0.2 },
    { title: 'Glow', desc: 'Neon pulse shadows', delay: 0.3 },
    { title: '3D', desc: 'Perspective transforms', delay: 0.4 },
    { title: 'Physics', desc: 'Elastic animations', delay: 0.5 },
  ];

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* Floating particles layer 1 - constrained to center area */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        pointerEvents: 'none',
        opacity: 0.25,
        filter: 'blur(0.5px)',
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={`p1-${i}`}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: tokens.colors.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle${i % 3} ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 15px ${tokens.colors.primary}`,
            }}
          />
        ))}
      </div>

      {/* Floating particles layer 2 - constrained to center area */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        pointerEvents: 'none',
        opacity: 0.15,
        filter: 'blur(1px)',
      }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={`p2-${i}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: tokens.colors.accent,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle${(i + 1) % 3} ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Feature grid - minimal styling */}
      <Box style={{
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        width: '100%',
        maxWidth: '750px',
      }}>
        {features.map((feature, i) => (
          <Box
            key={i}
            style={{
              padding: '18px',
              animation: `featureReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${feature.delay}s backwards`,
              background: `linear-gradient(135deg, ${tokens.colors.surface}20, ${tokens.colors.surfaceAlt}10)`,
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: `1px solid ${tokens.colors.border}40`,
              boxShadow: `0 4px 16px ${tokens.colors.background}40, inset 0 0 20px ${tokens.colors.primary}05`,
            }}
          >
            <Box style={{
              color: tokens.colors.primary,
              fontFamily: tokens.fonts.header,
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '6px',
              animation: `colorShift 4s ease infinite`,
              animationDelay: `${feature.delay}s`,
            }}>
              {feature.title}
            </Box>
            <Box style={{
              color: tokens.colors.text,
              fontSize: '0.95rem',
              opacity: 0.75,
            }}>
              {feature.desc}
            </Box>
          </Box>
        ))}
      </Box>

      <style>{`
        @keyframes particle0 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          25% { transform: translate(15px, -20px); opacity: 0.9; }
          50% { transform: translate(-10px, -40px); opacity: 0.5; }
          75% { transform: translate(20px, -20px); opacity: 1; }
        }
        @keyframes particle1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33% { transform: translate(-18px, -30px) scale(1.5); opacity: 1; }
          66% { transform: translate(12px, -15px) scale(0.8); opacity: 0.6; }
        }
        @keyframes particle2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          50% { transform: translate(-20px, -35px) rotate(180deg); opacity: 0.9; }
        }
        @keyframes holographicHero {
          0%, 100% { background-position: 0% 50%; }
          33% { background-position: 100% 50%; }
          66% { background-position: 50% 100%; }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes featureReveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes featureFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes colorShift {
          0%, 100% { color: ${tokens.colors.primary}; }
          33% { color: ${tokens.colors.accent}; }
          66% { color: ${tokens.colors.secondary}; }
        }
        @keyframes glowPulseText {
          0%, 100% { text-shadow: 0 0 20px ${tokens.colors.accent}40; }
          50% { text-shadow: 0 0 40px ${tokens.colors.accent}80, 0 0 60px ${tokens.colors.accent}40; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function AdvancedMetricCard() {
  const { tokens } = useDeckTheme();

  return (
    <Box
      style={{
        position: 'relative',
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: '12px',
        padding: '22px',
        display: 'grid',
        gap: '16px',
        alignContent: 'start',
        animation: 'cardEntrance 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: 0.15,
      }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: tokens.colors.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle${i % 3} ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Holographic shimmer overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `linear-gradient(45deg, transparent 30%, ${tokens.colors.primary}15 50%, transparent 70%)`,
        animation: 'shimmer 3s linear infinite',
        pointerEvents: 'none',
      }} />

      <Box style={{ color: tokens.colors.muted, fontSize: '1.2rem', animation: 'fadeInUp 0.8s ease-out 0.2s backwards', position: 'relative', zIndex: 1 }}>
        Builder Value
      </Box>
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.accent}, ${tokens.colors.secondary}, ${tokens.colors.primary})`,
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: tokens.fonts.header,
          fontSize: '3.6rem',
          fontWeight: 600,
          animation: 'holographicText 5s ease infinite, elasticBounce 4s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(201, 168, 76, 0.4))',
        }}
      >
        Fast Authoring
      </Box>
      <Box style={{
        position: 'relative',
        zIndex: 1,
        color: tokens.colors.text,
        fontSize: '1.1rem',
        maxWidth: '92%',
        animation: 'fadeInUp 0.8s ease-out 0.6s backwards'
      }}>
        Teams can create new decks by editing declarative configs while still having escape hatches for bespoke slides.
      </Box>
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          background: `linear-gradient(135deg, ${tokens.colors.surfaceAlt}, ${tokens.colors.surface})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '10px',
          padding: '14px 16px',
          color: tokens.colors.accent,
          fontSize: '1.02rem',
          animation: 'neonPulse 3s ease-in-out infinite, magneticFloat 1s ease-out 0.8s backwards',
          boxShadow: `0 8px 32px ${tokens.colors.accent}20, inset 0 0 20px ${tokens.colors.accent}10`,
        }}
      >
        Infinitely customizable with custom React components and animations.
      </Box>
      <style>{`
        @keyframes holographicText {
          0%, 100% { background-position: 0% 50%; filter: drop-shadow(0 0 30px rgba(201, 168, 76, 0.4)) hue-rotate(0deg); }
          33% { background-position: 100% 50%; filter: drop-shadow(0 0 30px rgba(90, 125, 104, 0.4)) hue-rotate(30deg); }
          66% { background-position: 50% 100%; filter: drop-shadow(0 0 30px rgba(232, 201, 122, 0.4)) hue-rotate(-30deg); }
        }
        @keyframes elasticBounce {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.03) translateY(-3px); }
          50% { transform: scale(0.98) translateY(2px); }
          75% { transform: scale(1.01) translateY(-1px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes neonPulse {
          0%, 100% {
            box-shadow: 0 8px 32px ${tokens.colors.accent}20, inset 0 0 20px ${tokens.colors.accent}10, 0 0 40px ${tokens.colors.accent}30;
            transform: translateY(0) scale(1);
          }
          50% {
            box-shadow: 0 12px 40px ${tokens.colors.accent}40, inset 0 0 30px ${tokens.colors.accent}20, 0 0 60px ${tokens.colors.accent}50;
            transform: translateY(-8px) scale(1.02);
          }
        }
        @keyframes particle0 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(20px, -30px); opacity: 0.8; }
          50% { transform: translate(-15px, -60px); opacity: 0.4; }
          75% { transform: translate(30px, -30px); opacity: 0.9; }
        }
        @keyframes particle1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-25px, -40px) scale(1.5); opacity: 0.9; }
          66% { transform: translate(20px, -20px) scale(0.8); opacity: 0.5; }
        }
        @keyframes particle2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          50% { transform: translate(-30px, -50px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: perspective(1000px) rotateX(-10deg) translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: perspective(1000px) rotateX(0deg) translateY(0) scale(1);
          }
        }
        @keyframes magneticFloat {
          from {
            opacity: 0;
            transform: perspective(800px) rotateY(-20deg) translateX(-30px);
          }
          to {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg) translateX(0);
          }
        }
      `}</style>
    </Box>
  );
}

function FrameworkUsageNote() {
  const { tokens } = useDeckTheme();

  return (
    <Box style={{ color: tokens.colors.muted, textAlign: 'center', fontSize: '1.35rem' }}>
      <InlineRichText
        text="Keep deck code on the public API surface: import from `slideforge` using `Presentation` and `themes`."
        tokens={tokens}
      />
    </Box>
  );
}

function CustomizationPlayground({
  activeBullet,
  onBulletChange,
  activeProgressBar,
  onProgressBarChange,
  showSlideNumbers,
  onSlideNumbersChange,
  showCopyright,
  onCopyrightChange,
}) {
  const { tokens } = useDeckTheme();

  const bulletOptions = [
    { id: 'default', label: 'Default ◆' },
    { id: 'circle', label: 'Circle ●' },
    { id: 'arrow', label: 'Arrow ▸' },
    { id: 'checkmark', label: 'Check ✓' },
    { id: 'star', label: 'Star ★' },
    { id: 'diamond', label: 'Diamond ◆' },
    { id: 'dash', label: 'Dash –' },
  ];

  const progressOptions = [
    { id: 'gradient', label: 'Gradient Bar' },
    { id: 'segments', label: 'Segments' },
    { id: 'none', label: 'None' },
  ];

  const renderButton = (option, isActive, onClick) => (
    <button
      key={option.id}
      type="button"
      onClick={() => onClick(option.id)}
      style={{
        backgroundColor: isActive ? tokens.colors.primary : tokens.colors.surfaceAlt,
        color: isActive ? tokens.colors.background : tokens.colors.text,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {option.label}
    </button>
  );

  const renderToggle = (label, isActive, onClick) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: isActive ? tokens.colors.accent : tokens.colors.surfaceAlt,
        color: isActive ? tokens.colors.background : tokens.colors.text,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontWeight: isActive ? 600 : 400,
      }}
    >
      {isActive ? '✓ ' : ''}{label}
    </button>
  );

  return (
    <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      <Box
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <Box style={{ color: tokens.colors.muted, fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
          Bullet Icon
        </Box>
        <Box style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {bulletOptions.map((option) => renderButton(option, activeBullet === option.id, onBulletChange))}
        </Box>
      </Box>

      <Box
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <Box style={{ color: tokens.colors.muted, fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
          Progress Bar
        </Box>
        <Box style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {progressOptions.map((option) => renderButton(option, activeProgressBar === option.id, onProgressBarChange))}
        </Box>
      </Box>

      <Box
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <Box style={{ color: tokens.colors.muted, fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
          Slide Numbers
        </Box>
        {renderToggle('Show Numbers', showSlideNumbers, onSlideNumbersChange)}
      </Box>

      <Box
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <Box style={{ color: tokens.colors.muted, fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
          Copyright
        </Box>
        {renderToggle('Show Copyright', showCopyright, onCopyrightChange)}
      </Box>
    </Box>
  );
}

function buildShowcaseDefinition(
  activeThemeId,
  onThemeChange,
  activeBullet,
  onBulletChange,
  activeProgressBar,
  onProgressBarChange,
  showSlideNumbers,
  onSlideNumbersChange,
  showCopyright,
  onCopyrightChange
) {
  const builder = create()
    .id('presentation-builder-showcase')
    .theme(themes.money)
    .title('Presentation Builder Showcase', 'Declarative API + live theme switching + extension hooks');

  // Apply bullet icon if not default
  if (activeBullet && activeBullet !== 'default') {
    builder.bulletIcon(bulletPresets[activeBullet]);
  }

  // Apply progress bar style
  if (activeProgressBar) {
    builder.progressBar(progressBarPresets[activeProgressBar]);
  }

  // Apply slide numbers
  if (showSlideNumbers) {
    builder.slideNumbers({ position: 'bottom-right', showTotal: true });
  }

  // Apply copyright
  if (showCopyright) {
    builder.copyright({ text: '© 2026 Slideforge', position: 'bottom-right' });
  }

  return builder
    .addSlides([
      slide({
        title: 'Why This Builder',
        regions: {
          main: [
            b.bullets([
              'Human-readable slide definitions with fluent deck construction',
              'Theme selected per presentation with a simple `.theme(themes.x)` API',
              'Custom React and hooks only where they add real value',
              'Shared layouts/content/effects keep decks consistent and fast to author',
            ]),
          ],
        },
      }),
      slide({
        title: 'Theme Lab (Custom React)',
        regions: {
          main: [b.custom(() => <ThemeLab activeThemeId={activeThemeId} onThemeChange={onThemeChange} />)],
        },
      }),
      slide({
        title: 'Interactive Customization',
        template: 'grid',
        layout: {
          columns: '1fr 1fr',
          rows: '1fr 1fr',
          areas: [
            ['controls', 'code'],
            ['preview', 'code'],
          ],
          gap: '16px',
        },
        regions: {
          controls: [
            b.custom(() => (
              <CustomizationPlayground
                activeBullet={activeBullet}
                onBulletChange={onBulletChange}
                activeProgressBar={activeProgressBar}
                onProgressBarChange={onProgressBarChange}
                showSlideNumbers={showSlideNumbers}
                onSlideNumbersChange={onSlideNumbersChange}
                showCopyright={showCopyright}
                onCopyrightChange={onCopyrightChange}
              />
            )),
          ],
          preview: {
            panel: true,
            blocks: [
              b.heading('Live Preview', { fontSize: '1.6rem', margin: '0 0 2px 0' }),
              b.bullets(
                [
                  'These **bullets** reflect your selected style',
                  'Check the *bottom* for progress bar changes',
                  'Supports **bold**, *italic*, `code`, ~~strikethrough~~',
                ],
                { fontSize: '1.2rem', gap: '2px 0' }
              ),
            ],
          },
          code: {
            panel: true,
            blocks: [
              b.code(
                `import {\n  Presentation,\n  themes,\n  bulletPresets,\n  progressBarPresets\n} from 'slideforge';\n\nconst deck = Presentation.create()\n  .theme(themes.money)\n  // gradient | segments | none\n  .progressBar(progressBarPresets.segments)\n  // arrow | star | circle | dash | diamond\n  .bulletIcon(bulletPresets.checkmark)\n  .slideNumbers({ position: 'bottom-right', showTotal: true })\n  .copyright({ text: '© 2026 My Company' })\n  .addSlides([/* ... */])\n  .build();\n\n// Custom theme with overrides\nconst custom = Presentation.create()\n  .theme({ ...themes.carbonRose, bulletIcon: { symbol: '→' } })\n  .build();\n\n// Markdown: **bold**, *italic*, \`code\`, ~~strike~~, [links](url)`,
                'javascript',
                { fontSize: '0.8rem' }
              ),
            ],
          },
        },
      }),
      slide({
        title: 'Declarative Content Blocks',
        regions: {
          main: [
            b.code(`import { Presentation, themes } from 'slideforge';\n\nconst { create, slide, blocks: b } = Presentation;\n\nconst deck = create()\n  .theme(themes.carbonRose)\n  .title('Launch Review', 'Builder API')\n  .addSlides([\n    slide({\n      title: 'Goals',\n      regions: { main: [b.bullets(['Adoption', 'Reliability'])] }\n    })\n  ])\n  .build();`, 'javascript'),
          ],
        },
      }),
      slide({
        title: 'Chart Blocks Library',
        template: 'grid',
        layout: {
          columns: '1fr 1fr',
          rows: '1fr 1fr',
          areas: [
            ['line', 'bar'],
            ['topN', 'pie'],
          ],
          gap: '14px',
        },
        regions: {
          line: [
            b.lineChart({
              title: 'Revenue Trend (Line)',
              categories: ['Q1', 'Q2', 'Q3', 'Q4'],
              seriesColors: ['#7fb3ff', '#7cc6a8', '#f3c96f'],
              yAxis: {
                min: 20,
                max: 70,
                tickCount: 6,
                formatter: (value) => `$${Math.round(value)}M`,
              },
              series: [
                { name: 'North', values: [42, 49, 57, 63] },
                { name: 'South', values: [34, 40, 47, 55] },
                { name: 'West', values: [29, 33, 38, 46] },
              ],
            }),
          ],
          bar: [
            b.barChart({
              title: 'Channel Mix (Stacked Bar)',
              stacked: true,
              categories: ['Q1', 'Q2', 'Q3', 'Q4'],
              seriesColors: {
                Enterprise: '#6ea7ff',
                'Mid-Market': '#79c2a5',
                SMB: '#e7c66f',
              },
              yAxis: {
                tickCount: 5,
                formatter: (value) => `$${Math.round(value)}M`,
              },
              series: [
                { name: 'Enterprise', values: [18, 21, 24, 27] },
                { name: 'Mid-Market', values: [12, 14, 16, 18] },
                { name: 'SMB', values: [8, 9, 11, 13] },
              ],
            }),
          ],
          topN: [
            b.topNBarChart({
              title: 'Top 5 Accounts',
              topN: 5,
              itemColors: ['#6ea7ff', '#79c2a5', '#e7c66f', '#d69252', '#c8794c'],
              items: [
                { label: 'Argent Holdings', value: 19.4 },
                { label: 'Beacon Capital', value: 16.7 },
                { label: 'Summit Retail', value: 13.9 },
                { label: 'Crestline Foods', value: 11.8 },
                { label: 'Vista Insurance', value: 10.2 },
                { label: 'Northfield Logistics', value: 8.6 },
              ],
            }),
          ],
          pie: [
            b.pieChart({
              title: 'Portfolio Allocation (Pie)',
              sliceColors: {
                Equities: '#6ea7ff',
                Bonds: '#79c2a5',
                Alternatives: '#e7c66f',
                Cash: '#d6a457',
              },
              slices: [
                { label: 'Equities', value: 46 },
                { label: 'Bonds', value: 24 },
                { label: 'Alternatives', value: 18 },
                { label: 'Cash', value: 12 },
              ],
            }),
          ],
        },
      }),
      slide({
        title: 'Progressive Reveal',
        regions: {
          main: [
            b.progressiveBullets([
              'First show the frame',
              'Then reveal details in sequence',
              'Keep audience focus on one point at a time',
              'Works inside shared layout templates',
            ]),
          ],
        },
      }),
      slide({
        title: 'Infinitely Customizable',
        template: 'oneBox',
        regions: {
          main: [
            b.stack([
              b.custom(() => <AdvancedEffectsShowcase />),
              b.text('Built with custom React components & CSS animations', {
                fontSize: '1.15rem',
                color: '#c9a84c',
                style: { textAlign: 'center', opacity: 0.9, animation: 'fadeInUp 1s ease-out 0.8s backwards, glowPulseText 3s ease-in-out 1s infinite' }
              }),
            ], { gap: '20px' }),
          ],
        },
      }),
      slide({
        title: 'Library Boundary',
        template: 'grid',
        layout: {
          columns: '1fr',
          rows: 'minmax(0, 1fr) minmax(0, 1fr)',
          areas: [['top'], ['bottom']],
          gap: '16px',
        },
        regions: {
          top: [
            b.bullets([
              "Decks should import only from `slideforge`'s public API",
              'Theme-aware custom components should use `useDeckTheme()`',
              'Framework internals remain replaceable and loosely coupled',
            ]),
          ],
          bottom: [b.custom(() => <FrameworkUsageNote />)],
        },
      }),
    ])
    .outro('Ready to Build', 'Create new decks quickly with a stable, extensible API')
    .build();
}

export function ThemeShowcase() {
  const [activeThemeId, setActiveThemeId] = useState('money');
  const [activeBullet, setActiveBullet] = useState('default');
  const [activeProgressBar, setActiveProgressBar] = useState('gradient');
  const [showSlideNumbers, setShowSlideNumbers] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);

  const activeTheme = themes[activeThemeId] ?? themes.money;
  const definition = useMemo(
    () =>
      buildShowcaseDefinition(
        activeThemeId,
        setActiveThemeId,
        activeBullet,
        setActiveBullet,
        activeProgressBar,
        setActiveProgressBar,
        showSlideNumbers,
        () => setShowSlideNumbers(!showSlideNumbers),
        showCopyright,
        () => setShowCopyright(!showCopyright)
      ),
    [activeThemeId, activeBullet, activeProgressBar, showSlideNumbers, showCopyright]
  );

  return <Deck definition={definition} theme={activeTheme} />;
}
