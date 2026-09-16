# Slideforge

React + Spectacle framework for code-first slide decks with a library-style presentation builder API.

## What Slideforge Is

Slideforge is a presentation authoring framework for teams that want repeatable, themeable, code-defined decks.

It is built for:

- Founders, operators, and finance teams producing recurring narrative decks
- Product and engineering teams that want presentation quality to be versioned and reviewable
- Developers who want declarative slide composition instead of hand-tuned one-off JSX per deck

Core idea:

- Treat presentations like software artifacts: structured definitions, reusable components, shared themes, and consistent rendering behavior.

## Why This Is More Than Raw Spectacle

Slideforge uses Spectacle as the rendering/runtime foundation, but adds a higher-level authoring system on top:

- Declarative DSL for decks/slides/regions (`Presentation.create()`, `slide(...)`, `blocks`)
- Structured layout model (one-box, two-box, grid) with consistent region behavior
- Reusable content primitives (bullets, charts, data blocks, code/media blocks) instead of ad hoc JSX per slide
- Theme tokens + presets as first-class API (`themes`, bullet/progress/font presets)
- Extension points (`custom` blocks and typed custom renderers) without losing shared layout/theme conventions

In practice, Spectacle is the engine; Slideforge is the framework layer that standardizes authoring, styling, and composition across presentations.

## What You Get

- A fluent builder API for deck assembly (`Presentation.create()`)
- Declarative slide specs (`slide({...})`) with composable regions
- Structured layouts (`oneBox`, `twoVertical`, `twoHorizontal`, `grid`)
- First-class content blocks (text, bullets, charts, code, data, media)
- Per-slide and title-slide background images
- Theme registry with tokenized styling and reusable presets
- Escape hatches for custom React where needed, without abandoning framework conventions

## Repository Layout

- `src/` framework internals and public surface exports
- `presentations/` presentation implementations that consume the public API
- `presentations/theme-showcase/` interactive showcase of capabilities and customization

## Quick Start

```bash
npm install
npm run dev
# http://localhost:5173/

npm run build
```

## Public API

Import from the package-style API surface:

```jsx
import { Presentation, themes } from 'slideforge';

const { Deck, create, slide, section, blocks: b, effects: fx } = Presentation;
```

Key concepts:

- `Presentation.create()` fluent builder (`.theme()`, `.title()`, `.section()`, `.addSlides()`, `.build()`)
- `Presentation.slide(...)` declarative slide definitions
- `Presentation.section(...)` / `Presentation.titleSlide(...)` mid-deck title slides
- Slide backgrounds via `background: '/image.jpg'` or `background: { image, opacity, size, position, overlay }`
- `Presentation.blocks` (`b`) and `Presentation.effects` (`fx`) helpers
  - Charts: `b.lineChart`, `b.barChart` (`stacked` supported), `b.topNBarChart`, `b.pieChart`
  - Chart config supports `xAxis` / `yAxis` ticks + formatters and explicit data colors (`seriesColors`, `sliceColors`, `itemColors`)
- `themes` registry for per-presentation theme selection (`themes.money`)
- `Deck` (`Presentation.Deck`) renderer for built definitions

## Architecture

- `src/builder/` - public builder DSL and library facade
- `src/presentation/` - deck shell + progress template
- `src/structure/` - structured slide renderer (with custom block renderers)
- `src/themes/` - theme registry + theme resolution + theme context
- `src/theme-api.js` - public theme exports (`themes`, `useDeckTheme`)
- `src/layouts/`, `src/content/`, `src/effects/`, `src/slides/` - shared rendering primitives
- `presentations/` - deck definitions that consume the public API

## Authoring Model

- Prefer declarative slide configs for most content.
- Use `b.custom(() => <... />)` for targeted custom React blocks.
- Use `useDeckTheme()` inside custom blocks/components for theme-safe styling.
- Avoid importing internal framework paths from deck code when a public export exists.

## Navigation

- Arrow keys: next/previous slide
- `F`: full screen
- `Option/Alt + P`: presenter mode

## Export And Previews

The Vite dev server includes Slideforge export endpoints. Both endpoints render through the same slide pipeline:

- hidden slides are included
- progressive slides render at their final step
- images, media, and fonts are awaited before capture

```bash
# Refresh static slide previews used by browser review mode.
curl -X POST http://127.0.0.1:5173/__slideforge/export/previews \
  -H 'content-type: application/json' \
  --data '{"quality":82}'

# Write a PDF export.
curl -X POST http://127.0.0.1:5173/__slideforge/export/pdf \
  -H 'content-type: application/json' \
  --data '{"output":"exports/presentation.pdf"}'
```

Decks can opt into static browser-review previews with:

```jsx
Presentation.create()
  .id('my-deck')
  .previews({ basePath: '/previews/my-deck', extension: 'jpg' });
```

When `outputDir` is omitted, the preview endpoint writes to the deck preview path under `public/`.

## Customization

Slideforge supports presentation-level and theme-level customization.

```jsx
import { Presentation, themes, bulletPresets, fontPresets, progressBarPresets } from 'slideforge';

const deck = Presentation.create()
  .theme(themes.money)
  .title('My Presentation')
  .progressBar(progressBarPresets.segments)
  .bulletIcon(bulletPresets.checkmark)
  .slideNumbers({ position: 'bottom-right', showTotal: true })
  .copyright({ text: '© 2026 My Company' })
  .addSlides([
    /* ... */
  ])
  .build();
```

### Progress Bar Presets

- `progressBarPresets.gradient` (default)
- `progressBarPresets.segments`
- `progressBarPresets.none`

### Bullet Presets

- `bulletPresets.default`
- `bulletPresets.circle`
- `bulletPresets.arrow`
- `bulletPresets.checkmark`
- `bulletPresets.star`
- `bulletPresets.diamond`
- `bulletPresets.dash`
- `bulletPresets.plus`

You can also provide a custom bullet config via `.bulletIcon({ symbol, size, style })` or `.bulletIcon({ render })`.

### Font Presets

- `fontPresets.serif`
- `fontPresets.sansSerif`
- `fontPresets.modern`
- `fontPresets.classic`
- `fontPresets.mono`
- `fontPresets.system`

Apply font presets through theme tokens:

```jsx
.theme({
  ...themes.money,
  tokens: {
    ...themes.money.tokens,
    fonts: fontPresets.modern,
  },
})
```

### Slide Numbers

```jsx
.slideNumbers({
  position: 'bottom-right', // bottom-left | bottom-center | top-right | top-left
  showTotal: true,
  color: '#custom-color',
  fontSize: '1rem',
  fontFamily: 'inherit',
})
```

`.slideNumbers(true)` also works with defaults.

### Copyright Footer

```jsx
.copyright({
  text: '© 2026 My Company',
  position: 'bottom-right', // bottom-left | bottom-center
  color: '#custom-color',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
})
```

`.copyright('© 2026 My Company')` also works with defaults.

### Background Images

Put static images in `public/` and reference them with root-relative paths:

```jsx
slide({
  title: 'Market Overview',
  background: {
    image: '/backgrounds/market-overview.jpg',
    opacity: 0.38,
    size: 'cover',
    position: 'center',
    overlay: 'rgba(0, 0, 0, 0.42)',
  },
  regions: {
    main: [b.heading('Revenue momentum'), b.bullets(['Expansion is accelerating'])],
  },
});
```

For simple cases, pass a string:

```jsx
slide({
  title: 'Product Vision',
  background: '/backgrounds/product-vision.jpg',
  regions: {
    main: [b.text('A visual-first strategy slide')],
  },
});
```

Title and outro slides support backgrounds through the third argument:

```jsx
Presentation.create()
  .title('Annual Plan', 'FY2027', {
    background: {
      image: '/backgrounds/title.jpg',
      opacity: 0.5,
      overlay: 'rgba(0, 0, 0, 0.35)',
    },
  })
  .outro('Thank You', 'Questions', {
    background: '/backgrounds/outro.jpg',
  });
```

### Markdown Support

Inline markdown is supported in text and bullet blocks:

- `**bold**`
- `*italic*` or `_italic_`
- `` `inline code` ``
- `~~strikethrough~~`
- `[link](https://example.com)`

## Presentation Content Workflow

For deck-specific working notes and draft content, keep content files inside each presentation directory under `presentations/` rather than in root-level docs.

## Roadmap

### In Progress

- Theme import from Google Slides and PowerPoint
- GitHub Pages hosting
- npm package hardening for public distribution (library mode outputs, metadata, peer deps, publish file controls, changelog/contributing docs)

### Completed

- Customizable bullet icons (+ presets and interactive showcase controls)
- Custom fonts (+ presets)
- Copyright footer
- Custom progress bar (+ presets)
- Slide numbers
- ESLint + Prettier setup
