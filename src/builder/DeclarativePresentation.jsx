import { Fragment, useEffect } from 'react';
import { PresentationDeck } from '../presentation/PresentationDeck';
import { TitleSlide } from '../slides/TitleSlide';
import { StructuredSlide } from '../structure/StructuredSlide';

function renderSlide(slide, index, inheritedBlockRenderers = {}) {
  if (!slide) {
    return null;
  }

  const key = slide.id ?? slide.key ?? slide.title ?? `slide-${index}`;

  if (slide.kind === 'title') {
    return <TitleSlide key={key} title={slide.title} subtitle={slide.subtitle} />;
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
      blockRenderers={{ ...inheritedBlockRenderers, ...(slide.blockRenderers ?? {}) }}
    />
  );
}

export function DeclarativePresentation({ definition, theme = 'money' }) {
  const deck = definition ?? {};
  const blockRenderers = deck.blockRenderers ?? {};
  const baseTheme = theme ?? deck.theme ?? 'money';
  const resolvedTitle = deck.title ?? deck.browserTitle ?? deck.titleSlide?.title ?? 'Slideforge';

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

  return (
    <PresentationDeck theme={mergedTheme}>
      {deck.titleSlide ? <TitleSlide title={deck.titleSlide.title} subtitle={deck.titleSlide.subtitle} /> : null}
      {(deck.slides ?? []).map((slide, index) => renderSlide(slide, index, blockRenderers))}
      {deck.outroSlide ? <TitleSlide title={deck.outroSlide.title} subtitle={deck.outroSlide.subtitle} /> : null}
    </PresentationDeck>
  );
}
