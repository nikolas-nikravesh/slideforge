# Presentations

Each presentation lives in its own directory under `presentations/` and should consume the framework through the public API.

## Creating a New Presentation

1. Create `presentations/your-deck/YourDeck.jsx`
2. Import `Presentation` and `themes` from `slideforge`
3. Build your definition with `Presentation.create()`
4. Use declarative blocks first; add custom React only where needed
5. Point `src/App.jsx` at your deck

## Example

```jsx
import { Presentation, themes } from 'slideforge';

const { Deck, create, slide, blocks: b, effects: fx } = Presentation;

const myDeck = create()
  .id('my-deck')
  .theme(themes.money)
  .title('My Title', 'My Subtitle')
  .useBlockRenderers({
    metric: ({ block, theme }) => (
      <div style={{ color: theme.colors.primary, fontSize: '3rem' }}>{block.value}</div>
    ),
  })
  .addSlides([
    slide({
      title: 'Key Points',
      regions: {
        main: [
          b.bullets(['Point 1', 'Point 2']),
          b.text('Custom emphasis', { effect: fx.slideIn('left', { delay: 0.2 }) }),
        ],
      },
    }),
    slide({
      title: 'Custom Block Type',
      regions: {
        main: [b.customType('metric', { value: '$12.4M' })],
      },
    }),
    slide({
      title: 'Escape Hatch',
      regions: {
        main: [b.custom(() => <div>Any custom React render block</div>)],
      },
    }),
  ])
  .outro('Thanks', 'Questions')
  .build();

export function MyPresentation() {
  return <Deck definition={myDeck} />;
}
```

## API Notes

- Theme selection is per presentation: `.theme(themes.money)`
- Prefer `useDeckTheme()` for theme-aware custom components
- Avoid deep imports from framework internals in presentation code
- Grid regions default to equal tracks; per-region overflow can be `scroll` (default) or `fit` via `regions.<name>.overflow`
