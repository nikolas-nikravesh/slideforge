import { Fragment } from 'react';
import { Box, Heading, Text } from 'spectacle';
import { SlideFrame } from '../slides/SlideFrame';
import {
  OneBoxLayout,
  TwoVerticalBoxesLayout,
  TwoHorizontalBoxesLayout,
  GridLayout,
  PanelBox,
} from '../layouts';
import { BulletList, ChartBlock, CodeBlock, DataBlock, MediaBlock } from '../content';
import { InlineRichText } from '../content/InlineRichText';
import { ProgressiveList, FloatingBox, PulsingText, SlideIn } from '../effects';
import { usePresentationTheme } from '../themes/PresentationThemeContext';
import { RegionViewport } from './RegionViewport';

function applyEffect(effect, child, key, theme) {
  if (!effect) {
    return <Fragment key={key}>{child}</Fragment>;
  }

  if (effect.type === 'floating') {
    return (
      <FloatingBox key={key} delay={effect.delay ?? 0}>
        {child}
      </FloatingBox>
    );
  }

  if (effect.type === 'pulsing') {
    return (
      <PulsingText key={key} color={effect.color ?? theme.colors.primary}>
        {child}
      </PulsingText>
    );
  }

  if (effect.type === 'slideIn') {
    return (
      <SlideIn key={key} direction={effect.direction ?? 'left'} delay={effect.delay ?? 0}>
        {child}
      </SlideIn>
    );
  }

  return <Fragment key={key}>{child}</Fragment>;
}

function renderBlock(block, key, theme, customBlockRenderers = {}) {
  if (!block) {
    return null;
  }

  if (typeof block.render === 'function') {
    return <Fragment key={key}>{block.render()}</Fragment>;
  }

  const customRenderer = block.type ? customBlockRenderers[block.type] : null;
  if (typeof customRenderer === 'function') {
    const customNode = customRenderer({
      block,
      key,
      theme,
      renderBlock: (nextBlock, nextKey) => renderBlock(nextBlock, nextKey, theme, customBlockRenderers),
    });
    return applyEffect(block.effect, customNode, key, theme);
  }

  let rendered;

  switch (block.type) {
    case 'heading':
      rendered = (
        <Heading
          fontSize={block.fontSize ?? 'h3'}
          color={block.color ?? theme.colors.primary}
          margin={block.margin ?? '0'}
          style={{ fontFamily: theme.fonts.header, fontWeight: 600, ...block.style }}
        >
          <InlineRichText text={block.text} tokens={theme} />
        </Heading>
      );
      break;
    case 'text':
      rendered = (
        <Text
          fontSize={block.fontSize ?? 'text'}
          color={block.color ?? theme.colors.text}
          margin={block.margin ?? '0'}
          style={{ fontFamily: theme.fonts.text, fontWeight: 400, ...block.style }}
        >
          <InlineRichText text={block.text} tokens={theme} />
        </Text>
      );
      break;
    case 'bullets':
      rendered = <BulletList items={block.items ?? []} fontSize={block.fontSize} gap={block.gap} />;
      break;
    case 'progressiveBullets':
      rendered = <ProgressiveList items={block.items ?? []} fontSize={block.fontSize} gap={block.gap} />;
      break;
    case 'code':
      rendered = <CodeBlock code={block.code ?? ''} language={block.language ?? 'javascript'} fontSize={block.fontSize} />;
      break;
    case 'data':
      rendered = <DataBlock data={block.data ?? {}} />;
      break;
    case 'media':
      rendered = <MediaBlock type={block.mediaType ?? 'image'} src={block.src} alt={block.alt} style={block.style} />;
      break;
    case 'chart':
      rendered = <ChartBlock block={block} theme={theme} />;
      break;
    case 'panel':
      rendered = (
        <PanelBox style={block.style}>
          <Box style={{ display: 'grid', gap: block.gap ?? '12px' }}>
            {(block.blocks ?? []).map((nested, idx) =>
              renderBlock(nested, `${key}-nested-${idx}`, theme, customBlockRenderers)
            )}
          </Box>
        </PanelBox>
      );
      break;
    case 'stack':
      rendered = (
          <Box style={{ display: 'grid', gap: block.gap ?? '12px' }}>
            {(block.blocks ?? []).map((nested, idx) =>
              renderBlock(nested, `${key}-stack-${idx}`, theme, customBlockRenderers)
            )}
          </Box>
      );
      break;
    default:
      rendered = null;
      break;
  }

  return applyEffect(block.effect, rendered, key, theme);
}

function normalizeRegion(region, defaultOverflow = 'scroll') {
  if (!region) {
    return { blocks: [], panel: false, overflow: defaultOverflow };
  }

  if (Array.isArray(region)) {
    return { blocks: region, panel: false, overflow: defaultOverflow };
  }

  return {
    blocks: region.blocks ?? [],
    panel: region.panel ?? false,
    panelStyle: region.panelStyle,
    style: region.style,
    gap: region.gap,
    overflow: region.overflow ?? defaultOverflow,
    minScale: region.minScale,
  };
}

function renderRegion(regionName, regionConfig, theme, customBlockRenderers = {}, defaultOverflow = 'scroll') {
  const region = normalizeRegion(regionConfig, defaultOverflow);
  const isFitMode = region.overflow === 'fit';
  if (!region.blocks || region.blocks.length === 0) {
    return <Box key={regionName} style={{ minHeight: 0 }} />;
  }

  const content = (
    <Box
      style={{
        display: 'grid',
        gap: region.gap ?? '12px',
        minHeight: 0,
        minWidth: 0,
        height: isFitMode ? '100%' : 'auto',
        width: '100%',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridAutoRows: isFitMode ? 'minmax(0, 1fr)' : 'max-content',
        alignContent: isFitMode ? 'stretch' : 'start',
      }}
    >
      {region.blocks.map((block, idx) =>
        renderBlock(block, `${regionName}-block-${idx}`, theme, customBlockRenderers)
      )}
    </Box>
  );

  const viewport = (
    <RegionViewport mode={region.overflow} minScale={region.minScale}>
      {content}
    </RegionViewport>
  );

  const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    height: '100%',
    width: '100%',
    minWidth: 0,
    overflow: region.overflow === 'fit' ? 'hidden' : 'auto',
    ...region.style,
  };

  if (region.panel) {
    return (
      <Box key={regionName} style={{ minHeight: 0, gridArea: regionName }}>
        <PanelBox style={{ ...baseStyle, ...region.panelStyle }}>{viewport}</PanelBox>
      </Box>
    );
  }

  return (
    <Box key={regionName} style={{ ...baseStyle, gridArea: regionName }}>
      {viewport}
    </Box>
  );
}

export function StructuredSlide({ title, template = 'oneBox', regions = {}, layout = {}, blockRenderers = {} }) {
  const { tokens } = usePresentationTheme();
  const defaultOverflow = layout.overflow ?? (template === 'grid' ? 'fit' : 'scroll');
  const main = renderRegion('main', regions.main, tokens, blockRenderers, defaultOverflow);
  const top = renderRegion('top', regions.top, tokens, blockRenderers, defaultOverflow);
  const bottom = renderRegion('bottom', regions.bottom, tokens, blockRenderers, defaultOverflow);
  const left = renderRegion('left', regions.left, tokens, blockRenderers, defaultOverflow);
  const right = renderRegion('right', regions.right, tokens, blockRenderers, defaultOverflow);
  const gridRegions = Object.entries(regions).map(([regionName, regionConfig]) =>
    renderRegion(regionName, regionConfig, tokens, blockRenderers, defaultOverflow)
  );

  let content = <OneBoxLayout>{main}</OneBoxLayout>;
  if (template === 'twoVertical') {
    content = (
      <TwoVerticalBoxesLayout top={top} bottom={bottom} ratio={layout.ratio ?? '1fr 1fr'} gap={layout.gap} />
    );
  }

  if (template === 'twoHorizontal') {
    content = (
      <TwoHorizontalBoxesLayout left={left} right={right} ratio={layout.ratio ?? '1fr 1fr'} gap={layout.gap} />
    );
  }

  if (template === 'grid') {
    content = (
        <GridLayout
        columns={layout.columns}
        rows={layout.rows}
        areas={layout.areas}
        gap={layout.gap}
      >
        {gridRegions}
      </GridLayout>
    );
  }

  return (
    <SlideFrame title={title} titleAlign={layout.titleAlign ?? 'center'}>
      {content}
    </SlideFrame>
  );
}
