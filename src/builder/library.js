import { DeclarativePresentation } from './DeclarativePresentation';
import { definePresentation, presentation, slide, titleSlide, section, b, r, fx } from './dsl';

export const Presentation = {
  Deck: DeclarativePresentation,
  create: presentation,
  define: definePresentation,
  slide,
  titleSlide,
  section,
  blocks: b,
  regions: r,
  effects: fx,
};
