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

const { Deck, create, slide, blocks: b, effects: fx } = Presentation;
```

Key concepts:
- `Presentation.create()` fluent builder (`.theme()`, `.title()`, `.addSlides()`, `.build()`)
- `Presentation.slide(...)` declarative slide definitions
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
  .addSlides([/* ... */])
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
