import { Deck } from 'spectacle';
import { createPortal } from 'react-dom';
import { useCallback } from 'react';
import { PresentationThemeProvider } from '../themes/PresentationThemeContext';
import { resolvePresentationTheme } from '../themes';

function GradientProgressBar({ progress, colors }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary}, ${colors.accent})`,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

function SegmentedProgressBar({ slideNumber, numberOfSlides, colors }) {
  const segments = Array.from({ length: numberOfSlides }, (_, i) => i);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        display: 'flex',
        gap: '4px',
        padding: '0 4px',
        backgroundColor: 'transparent',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {segments.map((index) => {
        const isActive = index < slideNumber;
        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: isActive ? colors.primary : 'rgba(255, 255, 255, 0.12)',
              borderRadius: '2px',
              transition: 'background-color 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}

function ViewportProgressBar({ slideNumber, numberOfSlides, colors, config }) {
  if (typeof document === 'undefined') {
    return null;
  }

  const progressBarType = config?.type ?? 'gradient';

  if (progressBarType === 'none') {
    return null;
  }

  const progress = numberOfSlides > 1 ? (slideNumber - 1) / (numberOfSlides - 1) : 0;

  let progressBar;
  if (progressBarType === 'segments') {
    progressBar = <SegmentedProgressBar slideNumber={slideNumber} numberOfSlides={numberOfSlides} colors={colors} />;
  } else {
    progressBar = <GradientProgressBar progress={progress} colors={colors} />;
  }

  return createPortal(progressBar, document.body);
}

function SlideFooter({ slideNumber, numberOfSlides, colors, slideNumbersConfig, copyrightConfig }) {
  if (typeof document === 'undefined') {
    return null;
  }

  const hasSlideNumbers = !!slideNumbersConfig;
  const hasCopyright = copyrightConfig && copyrightConfig.text;

  if (!hasSlideNumbers && !hasCopyright) {
    return null;
  }

  const position = slideNumbersConfig?.position ?? copyrightConfig?.position ?? 'bottom-right';
  const positionStyles = {
    'bottom-right': { bottom: '16px', right: '20px' },
    'bottom-left': { bottom: '16px', left: '20px' },
    'bottom-center': { bottom: '16px', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: '16px', right: '20px' },
    'top-left': { top: '16px', left: '20px' },
  };

  const showTotal = slideNumbersConfig?.showTotal ?? true;
  const slideNumberText = showTotal ? `${slideNumber} / ${numberOfSlides}` : `${slideNumber}`;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    >
      {hasSlideNumbers && (
        <div
          style={{
            color: slideNumbersConfig.color ?? colors.muted,
            fontSize: slideNumbersConfig.fontSize ?? '1.15rem',
            fontFamily: slideNumbersConfig.fontFamily ?? 'inherit',
            fontWeight: slideNumbersConfig.fontWeight ?? 600,
            opacity: 0.8,
          }}
        >
          {slideNumberText}
        </div>
      )}
      {hasCopyright && (
        <div
          style={{
            color: copyrightConfig.color ?? colors.muted,
            fontSize: copyrightConfig.fontSize ?? '1.1rem',
            fontFamily: copyrightConfig.fontFamily ?? 'inherit',
            fontWeight: copyrightConfig.fontWeight ?? 600,
            opacity: 0.75,
          }}
        >
          {copyrightConfig.text}
        </div>
      )}
    </div>,
    document.body
  );
}

function createProgressTemplate(colors, progressBarConfig, slideNumbersConfig, copyrightConfig) {
  return function ProgressTemplate({ slideNumber, numberOfSlides }) {
    return (
      <>
        <ViewportProgressBar
          slideNumber={slideNumber}
          numberOfSlides={numberOfSlides}
          colors={colors}
          config={progressBarConfig}
        />
        <SlideFooter
          slideNumber={slideNumber}
          numberOfSlides={numberOfSlides}
          colors={colors}
          slideNumbersConfig={slideNumbersConfig}
          copyrightConfig={copyrightConfig}
        />
      </>
    );
  };
}

function ViewportControls({ colors }) {
  const openPresenterView = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const presenterUrl = new URL(window.location.href);
    presenterUrl.searchParams.set('presenterMode', 'true');
    // Open presenter mode in a compact popup and keep this tab as audience view.
    window.open(presenterUrl.toString(), 'slideforge-presenter', 'popup=yes,width=560,height=900,left=24,top=24');
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') {
      return;
    }
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      return;
    }
    await document.exitFullscreen?.();
  }, []);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 10000,
        display: 'flex',
        gap: '8px',
      }}
    >
      <button
        type="button"
        onClick={toggleFullscreen}
        style={{
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surfaceAlt ?? colors.surface,
          color: colors.text,
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Full Screen
      </button>
      <button
        type="button"
        onClick={openPresenterView}
        style={{
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.accent,
          color: colors.background,
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        Presenter Popup
      </button>
    </div>,
    document.body
  );
}

export function PresentationDeck({ children, theme = 'money', showControls = true, disableInteractivity = false }) {
  const resolvedTheme = resolvePresentationTheme(theme);
  const template = createProgressTemplate(
    resolvedTheme.tokens.colors,
    resolvedTheme.progressBar,
    resolvedTheme.slideNumbers,
    resolvedTheme.copyright
  );

  return (
    <PresentationThemeProvider theme={resolvedTheme}>
      {showControls ? <ViewportControls colors={resolvedTheme.tokens.colors} /> : null}
      <Deck theme={resolvedTheme.spectacleTheme} template={template} disableInteractivity={disableInteractivity}>
        {children}
      </Deck>
    </PresentationThemeProvider>
  );
}
