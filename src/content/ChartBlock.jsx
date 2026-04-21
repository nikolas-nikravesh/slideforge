import { Box } from 'spectacle';
import { chartRenderers } from './charts/renderers';
import { getChartContainerStyle, getLegendTextStyle } from './charts/chartUtils';

function ChartLegend({ items, theme }) {
  if (!items || items.length === 0) {
    return null;
  }

  const textStyle = getLegendTextStyle(theme);
  return (
    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', alignItems: 'center' }}>
      {items.map((item, index) => (
        <Box key={`${item.label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Box
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              backgroundColor: item.color,
            }}
          />
          <Box style={textStyle}>{item.label}</Box>
        </Box>
      ))}
    </Box>
  );
}

function FallbackChart({ block, theme }) {
  return (
    <Box
      style={{
        ...getChartContainerStyle(theme),
        color: theme.colors.muted,
        fontFamily: theme.fonts.text,
        fontSize: '0.95rem',
      }}
    >
      Unsupported chart type: {block.chartType}
    </Box>
  );
}

export function ChartBlock({ block, theme }) {
  const renderer = chartRenderers[block.chartType];
  if (typeof renderer !== 'function') {
    return <FallbackChart block={block} theme={theme} />;
  }

  const output = renderer(block, theme);
  return (
    <Box style={{ ...getChartContainerStyle(theme), ...block.style }}>
      {block.title ? (
        <Box
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.header,
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {block.title}
        </Box>
      ) : null}
      <Box
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'stretch',
        }}
      >
        {output.svg}
      </Box>
      <ChartLegend items={output.legendItems} theme={theme} />
    </Box>
  );
}
