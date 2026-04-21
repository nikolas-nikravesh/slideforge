import { useState, useEffect, useContext } from 'react';
import { Box, DeckContext, SlideContext } from 'spectacle';

export function FloatingBox({ children, delay = 0 }) {
  return (
    <Box style={{ animation: `float 4s ease-in-out ${delay}s infinite` }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      {children}
    </Box>
  );
}

export function PulsingText({ children, color = '#c9a84c' }) {
  return (
    <Box style={{ color, animation: 'pulse 2.5s ease-in-out infinite' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.03); }
        }
      `}</style>
      {children}
    </Box>
  );
}

export function SlideIn({ children, direction = 'left', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const deck = useContext(DeckContext);
  const slide = useContext(SlideContext);

  useEffect(() => {
    const isSlideActive = Boolean(slide?.isSlideActive);
    const movingForward = (deck?.navigationDirection ?? 1) >= 0;

    if (!isSlideActive) {
      setIsVisible(false);
      return undefined;
    }

    if (!movingForward) {
      setIsVisible(true);
      return undefined;
    }

    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, deck?.navigationDirection, slide?.isSlideActive]);

  const transforms = {
    left: isVisible ? 'translateX(0)' : 'translateX(-60px)',
    right: isVisible ? 'translateX(0)' : 'translateX(60px)',
    top: isVisible ? 'translateY(0)' : 'translateY(-60px)',
    bottom: isVisible ? 'translateY(0)' : 'translateY(60px)',
  };

  return (
    <Box
      style={{
        transform: transforms[direction],
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
      }}
    >
      {children}
    </Box>
  );
}
