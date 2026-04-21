import { DeclarativePresentation } from './DeclarativePresentation';
import { definePresentation, presentation, slide, b, r, fx } from './dsl';

export const Presentation = {
  Deck: DeclarativePresentation,
  create: presentation,
  define: definePresentation,
  slide,
  blocks: b,
  regions: r,
  effects: fx,
};
