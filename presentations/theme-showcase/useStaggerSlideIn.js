import { useContext, useEffect, useState } from 'react';
import { DeckContext, SlideContext } from 'spectacle';

export function useStaggerSlideIn({
  baseDelay = 0,
  stepDelay = 140,
  distance = 20,
  duration = 520,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
} = {}) {
  const deck = useContext(DeckContext);
  const slide = useContext(SlideContext);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const isActive = Boolean(slide?.isSlideActive);
    if (!isActive) {
      setEntered(false);
      return;
    }

    const id = setTimeout(() => setEntered(true), baseDelay);
    return () => clearTimeout(id);
  }, [baseDelay, deck?.navigationDirection, slide?.isSlideActive]);

  return (index = 0, direction = 'bottom') => {
    const hiddenTransform = {
      left: `translate3d(-${distance}px, 0, 0)`,
      right: `translate3d(${distance}px, 0, 0)`,
      bottom: `translate3d(0, ${distance}px, 0)`,
      top: `translate3d(0, -${distance}px, 0)`,
    }[direction] ?? `translate3d(0, ${distance}px, 0)`;

    return {
    opacity: entered ? 1 : 0,
      transform: entered ? 'translate3d(0,0,0)' : hiddenTransform,
    transition: `transform ${duration}ms ${easing} ${index * stepDelay}ms, opacity ${duration}ms ${easing} ${index * stepDelay}ms`,
    willChange: 'transform, opacity',
    };
  };
}
