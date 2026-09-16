import { Fragment, useEffect, useMemo } from 'react';
import { BrowserPresentation } from '../presentation/BrowserPresentation';
import { PresentationDeck } from '../presentation/PresentationDeck';
import { TitleSlide } from '../slides/TitleSlide';
import { StructuredSlide } from '../structure/StructuredSlide';

function renderSlide(slide, index, inheritedBlockRenderers = {}) {
  if (!slide) {
    return null;
  }

  const key = slide.id ?? slide.key ?? slide.title ?? `slide-${index}`;

  if (slide.kind === 'title') {
    return (
      <TitleSlide
        key={key}
        title={slide.title}
        subtitle={slide.subtitle}
        eyebrow={slide.eyebrow}
        logo={slide.logo}
        background={slide.background}
        variant={slide.variant}
        style={slide.style}
      />
    );
  }

  if (typeof slide.render === 'function') {
    return <Fragment key={key}>{slide.render()}</Fragment>;
  }

  return (
    <StructuredSlide
      key={key}
      title={slide.title}
      template={slide.template}
      regions={slide.regions}
      layout={slide.layout}
      background={slide.background}
      blockRenderers={{ ...inheritedBlockRenderers, ...(slide.blockRenderers ?? {}) }}
    />
  );
}

function readRuntimeMode() {
  if (typeof window === 'undefined') {
    return {
      isBrowserMode: false,
      isEmbedded: false,
      includeHidden: false,
      isExporting: false,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const isSpectacleMode =
    params.has('presentationMode') ||
    params.has('presenterMode') ||
    params.has('overviewMode') ||
    params.has('printMode') ||
    params.has('exportMode');
  const isExporting = params.has('exportMode') || params.has('slideforgeExport') || params.get('export') === 'pdf';
  const includeHiddenParam = params.get('includeHidden');

  return {
    isBrowserMode: !isSpectacleMode,
    isEmbedded: params.has('slideforgeEmbed'),
    includeHidden: includeHiddenParam === null ? isExporting : includeHiddenParam === 'true',
    isExporting,
  };
}

function normalizeSlide(slide, index, role = 'slide') {
  const normalized = {
    ...slide,
    id: slide.id ?? `${role}-${index + 1}`,
  };

  if (slide.hide === true) {
    normalized.hide = true;
  }

  return normalized;
}

function getDeckSlides(deck) {
  const slides = [];

  if (deck.titleSlide) {
    slides.push(
      normalizeSlide(
        {
          ...deck.titleSlide,
          kind: 'title',
          id: deck.titleSlide.id ?? 'title-slide',
        },
        slides.length,
        'title'
      )
    );
  }

  (deck.slides ?? []).forEach((slide, index) => {
    slides.push(normalizeSlide(slide, index));
  });

  if (deck.outroSlide) {
    slides.push(
      normalizeSlide(
        {
          ...deck.outroSlide,
          kind: 'title',
          id: deck.outroSlide.id ?? 'outro-slide',
        },
        slides.length,
        'outro'
      )
    );
  }

  return slides;
}

export function DeclarativePresentation({ definition, theme }) {
  const deck = useMemo(() => definition ?? {}, [definition]);
  const blockRenderers = deck.blockRenderers ?? {};
  const baseTheme = theme ?? deck.theme ?? 'money';
  const resolvedTitle = deck.title ?? deck.browserTitle ?? deck.titleSlide?.title ?? 'Slideforge';
  const runtimeMode = readRuntimeMode();
  const allSlides = useMemo(() => getDeckSlides(deck), [deck]);
  const slidesForDeck = runtimeMode.includeHidden ? allSlides : allSlides.filter((slide) => slide.hide !== true);

  // Merge presentation-level customizations with theme
  const mergedTheme = typeof baseTheme === 'string' ? baseTheme : { ...baseTheme };
  if (typeof mergedTheme === 'object') {
    if (deck.progressBar !== undefined) {
      mergedTheme.progressBar = deck.progressBar;
    }
    if (deck.bulletIcon !== undefined) {
      mergedTheme.bulletIcon = deck.bulletIcon;
    }
    if (deck.slideNumbers !== undefined) {
      mergedTheme.slideNumbers = deck.slideNumbers;
    }
    if (deck.copyright !== undefined) {
      mergedTheme.copyright = deck.copyright;
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = resolvedTitle;
    }
  }, [resolvedTitle]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__SLIDEFORGE_DECK__ = {
        id: deck.id,
        title: deck.title,
        browserTitle: deck.browserTitle,
        slideCount: allSlides.length,
        visibleSlideCount: allSlides.filter((slide) => slide.hide !== true).length,
        previews: deck.previews,
        slides: allSlides.map((slide, index) => ({
          id: slide.id,
          title: slide.title,
          kind: slide.kind,
          hide: slide.hide === true,
          index,
        })),
      };
    }
  }, [allSlides, deck.browserTitle, deck.id, deck.previews, deck.title]);

  if (runtimeMode.isBrowserMode) {
    return <BrowserPresentation definition={deck} slides={allSlides} theme={mergedTheme} />;
  }

  return (
    <PresentationDeck
      theme={mergedTheme}
      showControls={!runtimeMode.isEmbedded && !runtimeMode.isExporting}
    >
      {slidesForDeck.map((slide, index) => renderSlide(slide, index, blockRenderers))}
    </PresentationDeck>
  );
}
