import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PresentationThemeProvider } from '../themes/PresentationThemeContext';
import { resolvePresentationTheme } from '../themes';

function getBrowserUrlForSlide(index) {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('presentationMode', 'true');
  url.searchParams.set('includeHidden', 'true');
  url.searchParams.set('slideforgeEmbed', 'true');
  url.searchParams.set('slideIndex', String(index));
  url.searchParams.set('stepIndex', '999');
  return url.toString();
}

function getPresentationUrl() {
  if (typeof window === 'undefined') {
    return '';
  }

  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('presentationMode', 'true');
  url.searchParams.set('slideIndex', '0');
  url.searchParams.set('stepIndex', '0');
  return url.toString();
}

function getInitialSlideIndex() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const params = new URLSearchParams(window.location.search);
  const slideIndex = Number(params.get('slideIndex') ?? 0);
  return Number.isFinite(slideIndex) ? Math.max(0, slideIndex) : 0;
}

function getSlideLabel(slide, index) {
  return slide.title || slide.id || (slide.kind === 'title' ? 'Title' : `Slide ${index + 1}`);
}

function appendUrlVersion(src, version) {
  if (!src || !version) {
    return src;
  }

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}v=${encodeURIComponent(String(version))}`;
}

function getPreviewManifestUrl(definition) {
  const previews = definition.previews;
  if (!previews || typeof previews !== 'object' || Array.isArray(previews)) {
    return null;
  }

  const basePath = previews.basePath ?? `/previews/${definition.id}`;
  return `${basePath.replace(/\/$/, '')}/manifest.json`;
}

function getConfiguredPreviewVersion(definition) {
  const previews = definition.previews;
  if (!previews || typeof previews !== 'object' || Array.isArray(previews)) {
    return null;
  }

  return previews.version ?? null;
}

function getPreviewSrc(definition, index, version) {
  const previews = definition.previews;
  if (!previews) {
    return null;
  }

  if (typeof previews === 'function') {
    return appendUrlVersion(previews(index), version);
  }

  if (Array.isArray(previews)) {
    return appendUrlVersion(previews[index] ?? null, version);
  }

  const basePath = previews.basePath ?? `/previews/${definition.id}`;
  const extension = previews.extension ?? 'jpg';
  const startIndex = previews.startIndex ?? 1;
  const pad = previews.pad ?? 2;
  const prefix = previews.prefix ?? 'slide-';
  const slideNumber = String(index + startIndex).padStart(pad, '0');
  const previewUrl = `${basePath.replace(/\/$/, '')}/${prefix}${slideNumber}.${extension}`;
  return appendUrlVersion(previewUrl, version ?? previews.version);
}

function HiddenBadge({ compact = false, colors }) {
  return (
    <div
      className={compact ? 'slideforge-hidden-badge slideforge-hidden-badge--compact' : 'slideforge-hidden-badge'}
      style={{
        backgroundColor: colors.danger ?? '#ff5c7a',
        color: colors.background,
      }}
    >
      HIDDEN
    </div>
  );
}

function SlidePreview({ slide, index, colors, title, isLoaded }) {
  return (
    <div className="slideforge-browser-slide-frame">
      {isLoaded ? (
        <iframe
          title={title}
          src={getBrowserUrlForSlide(index)}
          className="slideforge-browser-slide-iframe"
          loading="lazy"
          tabIndex={-1}
        />
      ) : (
        <div className="slideforge-browser-slide-placeholder">Slide {index + 1}</div>
      )}
      {slide.hide ? <HiddenBadge colors={colors} /> : null}
    </div>
  );
}

export function BrowserPresentation({ definition, slides, theme = 'money' }) {
  const resolvedTheme = resolvePresentationTheme(theme);
  const colors = resolvedTheme.tokens.colors;
  const mainRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const programmaticScrollTargetRef = useRef(null);
  const programmaticScrollTimerRef = useRef(null);
  const initialSlideIndex = useMemo(() => getInitialSlideIndex(), []);
  const [activeIndex, setActiveIndex] = useState(initialSlideIndex);
  const [loadedIndexes, setLoadedIndexes] = useState(
    () => new Set([Math.max(0, initialSlideIndex - 1), initialSlideIndex, initialSlideIndex + 1])
  );
  const [loadedThumbnailIndexes, setLoadedThumbnailIndexes] = useState(
    () => new Set(Array.from({ length: 8 }, (_, index) => index))
  );
  const [previewVersion, setPreviewVersion] = useState(() => getConfiguredPreviewVersion(definition));

  useEffect(() => {
    const manifestUrl = getPreviewManifestUrl(definition);
    const configuredVersion = getConfiguredPreviewVersion(definition);
    setPreviewVersion(configuredVersion);

    if (!manifestUrl) {
      return undefined;
    }

    let isMounted = true;
    const versionedManifestUrl = appendUrlVersion(manifestUrl, Date.now());

    fetch(versionedManifestUrl, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest) => {
        if (isMounted && manifest?.version) {
          setPreviewVersion(manifest.version);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [definition]);

  const slideItems = useMemo(
    () =>
      slides.map((slide, index) => ({
        slide,
        index,
        label: getSlideLabel(slide, index),
        previewSrc: getPreviewSrc(definition, index, previewVersion),
      })),
    [definition, previewVersion, slides]
  );

  useEffect(() => {
    const root = mainRef.current;
    if (!root) {
      return undefined;
    }

    let animationFrame = null;

    const updateActiveSlide = () => {
      if (programmaticScrollTargetRef.current !== null) {
        setActiveIndex((current) =>
          current === programmaticScrollTargetRef.current ? current : programmaticScrollTargetRef.current
        );
        return;
      }

      const sections = Array.from(root.querySelectorAll('[data-slide-index]'));
      const rootRect = root.getBoundingClientRect();
      const anchor = rootRect.top + root.clientHeight * 0.34;
      let nextActiveIndex = 0;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchor) {
          nextActiveIndex = Number(section.dataset.slideIndex);
        } else {
          break;
        }
      }

      setActiveIndex((current) => (current === nextActiveIndex ? current : nextActiveIndex));
    };

    const handleScroll = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(updateActiveSlide);
    };

    updateActiveSlide();
    root.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      root.removeEventListener('scroll', handleScroll);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [slideItems.length]);

  useEffect(() => {
    thumbnailsRef.current?.querySelector(`[data-thumbnail-index="${activeIndex}"]`)?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });
  }, [activeIndex]);

  useEffect(() => {
    setLoadedThumbnailIndexes((current) => {
      const next = new Set(current);
      next.add(activeIndex);
      if (activeIndex > 0) {
        next.add(activeIndex - 1);
      }
      if (activeIndex < slideItems.length - 1) {
        next.add(activeIndex + 1);
      }
      return next;
    });
  }, [activeIndex, slideItems.length]);

  useEffect(
    () => () => {
      if (programmaticScrollTimerRef.current !== null) {
        clearTimeout(programmaticScrollTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const boundedIndex = Math.max(0, Math.min(initialSlideIndex, slideItems.length - 1));
    mainRef.current?.querySelector(`[data-slide-index="${boundedIndex}"]`)?.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  }, [initialSlideIndex, slideItems.length]);

  useEffect(() => {
    const root = thumbnailsRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nextIndexes = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number(entry.target.dataset.thumbnailIndex))
          .filter((index) => Number.isFinite(index));

        if (nextIndexes.length === 0) {
          return;
        }

        setLoadedThumbnailIndexes((current) => {
          const next = new Set(current);
          nextIndexes.forEach((index) => {
            next.add(index);
            if (index < slideItems.length - 1) {
              next.add(index + 1);
            }
          });
          return next;
        });
      },
      { root, rootMargin: '600px 0px', threshold: 0.01 }
    );

    root.querySelectorAll('[data-thumbnail-index]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [slideItems.length]);

  useEffect(() => {
    const root = mainRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nextIndexes = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number(entry.target.dataset.slideIndex))
          .filter((index) => Number.isFinite(index));

        if (nextIndexes.length === 0) {
          return;
        }

        setLoadedIndexes((current) => {
          const next = new Set(current);
          nextIndexes.forEach((index) => {
            next.add(index);
            if (index > 0) {
              next.add(index - 1);
            }
            if (index < slideItems.length - 1) {
              next.add(index + 1);
            }
          });
          return next;
        });
      },
      { root, rootMargin: '900px 0px', threshold: 0.01 }
    );

    root.querySelectorAll('[data-slide-index]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [slideItems.length]);

  const openPresentation = () => {
    if (typeof window !== 'undefined') {
      window.location.href = getPresentationUrl();
    }
  };

  const jumpToSlide = useCallback(
    (index) => {
      const nextIndex = Math.max(0, Math.min(index, slideItems.length - 1));
      setLoadedIndexes((current) => {
        const next = new Set(current);
        next.add(nextIndex);
        if (nextIndex > 0) {
          next.add(nextIndex - 1);
        }
        if (nextIndex < slideItems.length - 1) {
          next.add(nextIndex + 1);
        }
        return next;
      });
      setLoadedThumbnailIndexes((current) => {
        const next = new Set(current);
        next.add(nextIndex);
        return next;
      });
      if (programmaticScrollTimerRef.current !== null) {
        clearTimeout(programmaticScrollTimerRef.current);
      }
      programmaticScrollTargetRef.current = nextIndex;
      programmaticScrollTimerRef.current = setTimeout(() => {
        programmaticScrollTargetRef.current = null;
        programmaticScrollTimerRef.current = null;
      }, 250);
      setActiveIndex(nextIndex);
      mainRef.current?.querySelector(`[data-slide-index="${nextIndex}"]`)?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      });
    },
    [slideItems.length]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const forwardKeys = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ']);
      const backKeys = new Set(['ArrowLeft', 'ArrowUp', 'PageUp']);

      if (forwardKeys.has(event.key)) {
        event.preventDefault();
        jumpToSlide(activeIndex + 1);
      } else if (backKeys.has(event.key)) {
        event.preventDefault();
        jumpToSlide(activeIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [activeIndex, jumpToSlide]);

  const handleThumbnailClick = (index) => {
    jumpToSlide(index);
  };

  return (
    <PresentationThemeProvider theme={resolvedTheme}>
      <div
        className="slideforge-browser"
        style={{
          background: colors.background,
          color: colors.text,
          fontFamily: resolvedTheme.tokens.fonts.text,
        }}
      >
        <aside
          className="slideforge-browser-sidebar"
          style={{
            background: colors.surface ?? '#111827',
            borderColor: colors.border ?? 'rgba(255,255,255,0.16)',
          }}
        >
          <div className="slideforge-browser-sidebar-header">
            <div className="slideforge-browser-deck-title">{definition.title ?? definition.browserTitle ?? 'Slides'}</div>
            <button
              type="button"
              className="slideforge-browser-present-button"
              onClick={openPresentation}
              style={{
                background: colors.accent,
                color: colors.background,
              }}
            >
              Present
            </button>
          </div>
          <div ref={thumbnailsRef} className="slideforge-browser-thumbnails">
            {slideItems.map(({ slide, index, label, previewSrc }) => (
              <button
                type="button"
                key={slide.id ?? `${label}-${index}`}
                data-thumbnail-index={index}
                className={
                  activeIndex === index
                    ? 'slideforge-browser-thumbnail slideforge-browser-thumbnail--active'
                    : 'slideforge-browser-thumbnail'
                }
                onClick={() => handleThumbnailClick(index)}
                style={{
                  borderColor:
                    activeIndex === index ? colors.accent : colors.border ?? 'rgba(255,255,255,0.14)',
                  backgroundColor: colors.surfaceAlt ?? 'rgba(255,255,255,0.05)',
                }}
              >
                <div className="slideforge-browser-thumbnail-number">{index + 1}</div>
                <div className="slideforge-browser-thumbnail-preview">
                  {previewSrc && loadedThumbnailIndexes.has(index) ? (
                    <img
                      className="slideforge-browser-thumbnail-image"
                      src={previewSrc}
                      alt={`${label} thumbnail`}
                      loading={index < 8 ? 'eager' : 'lazy'}
                    />
                  ) : loadedThumbnailIndexes.has(index) ? (
                    <iframe
                      title={`${label} thumbnail`}
                      src={getBrowserUrlForSlide(index)}
                      className="slideforge-browser-thumbnail-iframe"
                      loading="lazy"
                      tabIndex={-1}
                    />
                  ) : (
                    <div className="slideforge-browser-thumbnail-card">
                      <span>{index + 1}</span>
                    </div>
                  )}
                  {slide.hide ? <HiddenBadge compact colors={colors} /> : null}
                </div>
                <div className="slideforge-browser-thumbnail-label">{label}</div>
              </button>
            ))}
          </div>
        </aside>
        <main ref={mainRef} className="slideforge-browser-main">
          {slideItems.map(({ slide, index, label }) => (
            <section
              key={slide.id ?? `${label}-${index}`}
              id={`slide-${index + 1}`}
              className="slideforge-browser-slide"
              data-slide-index={index}
            >
              <div className="slideforge-browser-slide-number">{index + 1}</div>
              <SlidePreview
                slide={slide}
                index={index}
                colors={colors}
                title={label}
                isLoaded={loadedIndexes.has(index)}
              />
            </section>
          ))}
        </main>
      </div>
    </PresentationThemeProvider>
  );
}
