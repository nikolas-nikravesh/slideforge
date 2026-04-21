import { useEffect, useMemo, useRef, useState } from 'react';

function computeFitScale(viewportEl, contentEl) {
  if (!viewportEl || !contentEl) {
    return 1;
  }

  const viewportWidth = viewportEl.clientWidth;
  const viewportHeight = viewportEl.clientHeight;
  const contentWidth = contentEl.scrollWidth;
  const contentHeight = contentEl.scrollHeight;

  if (!viewportWidth || !viewportHeight || !contentWidth || !contentHeight) {
    return 1;
  }

  return Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight);
}

export function RegionViewport({ mode = 'scroll', minScale = 0.1, children }) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (mode !== 'fit') {
      setScale(1);
      return undefined;
    }

    const viewportEl = viewportRef.current;
    const contentEl = contentRef.current;
    if (!viewportEl || !contentEl) {
      return undefined;
    }

    const updateScale = () => {
      const nextScale = computeFitScale(viewportEl, contentEl);
      setScale(Math.max(minScale, nextScale));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(viewportEl);
    observer.observe(contentEl);

    return () => observer.disconnect();
  }, [children, minScale, mode]);

  const contentStyle = useMemo(() => {
    if (mode !== 'fit' || scale >= 1) {
      return { width: '100%', height: '100%', minHeight: 0, minWidth: 0 };
    }

    return {
      width: '100%',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };
  }, [mode, scale]);

  const viewportStyle =
    mode === 'fit'
      ? {
          width: '100%',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          display: 'block',
        }
      : { width: '100%', height: '100%', minHeight: 0, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' };

  return (
    <div ref={viewportRef} style={viewportStyle}>
      <div ref={contentRef} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
