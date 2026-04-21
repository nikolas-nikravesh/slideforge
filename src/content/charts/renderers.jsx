import { chartFill, chartStroke, clampPositiveNumber, coerceNumber, getChartPalette } from './chartUtils';

const SVG_WIDTH = 520;
const SVG_HEIGHT = 260;

function safeCategories(categories = [], fallbackLength = 0) {
  if (Array.isArray(categories) && categories.length > 0) {
    return categories;
  }
  return Array.from({ length: fallbackLength }, (_, index) => `P${index + 1}`);
}

function seriesValues(series = [], mode = 'all') {
  const values = series.flatMap((entry) =>
    (entry.values ?? []).map((value) => (mode === 'positive' ? clampPositiveNumber(value, 0) : coerceNumber(value, 0)))
  );
  return values.length > 0 ? values : [0];
}

function buildTicks(min, max, tickCount = 5) {
  const safeTickCount = Math.max(2, Number(tickCount) || 5);
  const range = Math.max(0, max - min);
  if (range === 0) {
    return [min];
  }

  const step = range / (safeTickCount - 1);
  return Array.from({ length: safeTickCount }, (_, index) => min + index * step);
}

function defaultTickFormatter(value) {
  if (Math.abs(value) >= 1000) {
    return Math.round(value).toLocaleString();
  }

  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function resolveAxisConfig(axis = {}, fallbackMin, fallbackMax) {
  const min = coerceNumber(axis.min, fallbackMin);
  const max = coerceNumber(axis.max, fallbackMax);

  if (max <= min) {
    return {
      min,
      max: min + 1,
      tickCount: axis.tickCount ?? 5,
      showGrid: axis.showGrid ?? true,
      showTicks: axis.showTicks ?? true,
      formatter: axis.formatter,
    };
  }

  return {
    min,
    max,
    tickCount: axis.tickCount ?? 5,
    showGrid: axis.showGrid ?? true,
    showTicks: axis.showTicks ?? true,
    formatter: axis.formatter,
  };
}

function formatTick(value, formatter) {
  if (typeof formatter === 'function') {
    return formatter(value);
  }
  return defaultTickFormatter(value);
}

function resolveColor({ explicitColor, namedColors, palette, index, name }) {
  if (explicitColor) {
    return explicitColor;
  }

  if (Array.isArray(namedColors) && namedColors[index]) {
    return namedColors[index];
  }

  if (namedColors && typeof namedColors === 'object' && name && namedColors[name]) {
    return namedColors[name];
  }

  return palette[index % palette.length];
}

function linePath(values = [], xScale, yScale) {
  const points = values.map((value, index) => {
    const x = xScale(index);
    const y = yScale(coerceNumber(value, 0));
    return `${x},${y}`;
  });
  return points.join(' ');
}

function renderYAxis({ ticks, yScale, margin, chartWidth, theme, formatter, showGrid }) {
  return (
    <g>
      {ticks.map((tick, index) => {
        const y = yScale(tick);
        return (
          <g key={`y-tick-${index}`}>
            {showGrid ? (
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + chartWidth}
                y2={y}
                stroke={chartFill(theme.colors.border || theme.colors.primary, 0.2)}
                strokeWidth="1"
              />
            ) : null}
            <text
              x={margin.left - 6}
              y={y + 4}
              textAnchor="end"
              fill={theme.colors.muted}
              fontSize="11"
              fontFamily={theme.fonts.text}
            >
              {formatTick(tick, formatter)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function renderLineChart(block, theme) {
  const margin = { top: 14, right: 12, bottom: 38, left: 54 };
  const categories = safeCategories(block.categories, block.series?.[0]?.values?.length ?? 0);
  const series = Array.isArray(block.series) ? block.series : [];
  const palette = getChartPalette(theme, block.palette);
  const chartWidth = SVG_WIDTH - margin.left - margin.right;
  const chartHeight = SVG_HEIGHT - margin.top - margin.bottom;
  const values = seriesValues(series, 'all');
  const inferredMin = Math.min(0, ...values);
  const inferredMax = Math.max(0, ...values);
  const yAxis = resolveAxisConfig(block.yAxis, inferredMin, inferredMax || 1);
  const xAxis = {
    showTicks: block.xAxis?.showTicks ?? true,
    formatter: block.xAxis?.formatter,
  };

  const stepX = categories.length > 1 ? chartWidth / (categories.length - 1) : chartWidth;
  const xScale = (index) => margin.left + index * stepX;
  const yScale = (value) => margin.top + chartHeight - ((value - yAxis.min) / (yAxis.max - yAxis.min)) * chartHeight;
  const yTicks = yAxis.showTicks ? buildTicks(yAxis.min, yAxis.max, yAxis.tickCount) : [];

  return {
    svg: (
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
        role="img"
        aria-label={block.title ?? 'Line chart'}
      >
        {renderYAxis({
          ticks: yTicks,
          yScale,
          margin,
          chartWidth,
          theme,
          formatter: yAxis.formatter,
          showGrid: yAxis.showGrid,
        })}

        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke={chartStroke(theme)} />
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke={chartStroke(theme)}
        />

        {series.map((entry, seriesIndex) => {
          const color = resolveColor({
            explicitColor: entry.color,
            namedColors: block.seriesColors,
            palette,
            index: seriesIndex,
            name: entry.name,
          });
          return (
            <g key={entry.name ?? `series-${seriesIndex}`}>
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                points={linePath(entry.values ?? [], xScale, yScale)}
              />
              {(entry.values ?? []).map((value, pointIndex) => (
                <circle
                  key={`${entry.name ?? seriesIndex}-${pointIndex}`}
                  cx={xScale(pointIndex)}
                  cy={yScale(coerceNumber(value, 0))}
                  r="3.2"
                  fill={color}
                />
              ))}
            </g>
          );
        })}

        {xAxis.showTicks
          ? categories.map((label, index) => (
              <text
                key={`${label}-${index}`}
                x={xScale(index)}
                y={SVG_HEIGHT - 8}
                textAnchor="middle"
                fill={theme.colors.muted}
                fontSize="11"
                fontFamily={theme.fonts.text}
              >
                {typeof xAxis.formatter === 'function' ? xAxis.formatter(label, index) : label}
              </text>
            ))
          : null}
      </svg>
    ),
    legendItems: series.map((entry, index) => ({
      label: entry.name ?? `Series ${index + 1}`,
      color: resolveColor({
        explicitColor: entry.color,
        namedColors: block.seriesColors,
        palette,
        index,
        name: entry.name,
      }),
    })),
  };
}

function renderBarChart(block, theme) {
  const margin = { top: 14, right: 12, bottom: 38, left: 54 };
  const categories = safeCategories(block.categories, block.series?.[0]?.values?.length ?? 0);
  const series = Array.isArray(block.series) ? block.series : [];
  const palette = getChartPalette(theme, block.palette);
  const chartWidth = SVG_WIDTH - margin.left - margin.right;
  const chartHeight = SVG_HEIGHT - margin.top - margin.bottom;
  const step = categories.length > 0 ? chartWidth / categories.length : chartWidth;
  const groupedBarWidth = Math.max(12, step * 0.75);
  const stacksByCategory = categories.map((_, categoryIndex) =>
    series.map((entry) => clampPositiveNumber(entry.values?.[categoryIndex], 0))
  );

  const inferredMax = block.stacked
    ? Math.max(1, ...stacksByCategory.map((values) => values.reduce((total, value) => total + value, 0)))
    : Math.max(1, ...seriesValues(series, 'positive'));

  const yAxis = resolveAxisConfig(block.yAxis, 0, inferredMax);
  const xAxis = {
    showTicks: block.xAxis?.showTicks ?? true,
    formatter: block.xAxis?.formatter,
  };

  const yScale = (value) => margin.top + chartHeight - ((value - yAxis.min) / (yAxis.max - yAxis.min)) * chartHeight;
  const yTicks = yAxis.showTicks ? buildTicks(yAxis.min, yAxis.max, yAxis.tickCount) : [];

  return {
    svg: (
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
        role="img"
        aria-label={block.title ?? 'Bar chart'}
      >
        {renderYAxis({
          ticks: yTicks,
          yScale,
          margin,
          chartWidth,
          theme,
          formatter: yAxis.formatter,
          showGrid: yAxis.showGrid,
        })}

        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + chartHeight} stroke={chartStroke(theme)} />
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke={chartStroke(theme)}
        />

        {categories.map((category, categoryIndex) => {
          const startX = margin.left + categoryIndex * step + (step - groupedBarWidth) / 2;
          if (block.stacked) {
            let offset = 0;
            return (
              <g key={`stack-${category}`}>
                {series.map((entry, seriesIndex) => {
                  const value = clampPositiveNumber(entry.values?.[categoryIndex], 0);
                  const topValue = offset + value;
                  const yTop = yScale(topValue);
                  const yBottom = yScale(offset);
                  const height = Math.max(0, yBottom - yTop);
                  offset = topValue;
                  return (
                    <rect
                      key={`${entry.name ?? seriesIndex}-${category}`}
                      x={startX}
                      y={yTop}
                      width={groupedBarWidth}
                      height={height}
                      fill={resolveColor({
                        explicitColor: entry.color,
                        namedColors: block.seriesColors,
                        palette,
                        index: seriesIndex,
                        name: entry.name,
                      })}
                      rx="2"
                    />
                  );
                })}
              </g>
            );
          }

          const singleWidth = Math.max(8, groupedBarWidth / Math.max(1, series.length));
          return (
            <g key={`group-${category}`}>
              {series.map((entry, seriesIndex) => {
                const value = clampPositiveNumber(entry.values?.[categoryIndex], 0);
                const yTop = yScale(value);
                const yBottom = yScale(0);
                const height = Math.max(0, yBottom - yTop);
                const x = startX + seriesIndex * singleWidth;
                return (
                  <rect
                    key={`${entry.name ?? seriesIndex}-${category}`}
                    x={x}
                    y={yTop}
                    width={singleWidth - 2}
                    height={height}
                    fill={resolveColor({
                      explicitColor: entry.color,
                      namedColors: block.seriesColors,
                      palette,
                      index: seriesIndex,
                      name: entry.name,
                    })}
                    rx="2"
                  />
                );
              })}
            </g>
          );
        })}

        {xAxis.showTicks
          ? categories.map((label, index) => (
              <text
                key={`${label}-${index}`}
                x={margin.left + index * step + step / 2}
                y={SVG_HEIGHT - 8}
                textAnchor="middle"
                fill={theme.colors.muted}
                fontSize="11"
                fontFamily={theme.fonts.text}
              >
                {typeof xAxis.formatter === 'function' ? xAxis.formatter(label, index) : label}
              </text>
            ))
          : null}
      </svg>
    ),
    legendItems: series.map((entry, index) => ({
      label: entry.name ?? `Series ${index + 1}`,
      color: resolveColor({
        explicitColor: entry.color,
        namedColors: block.seriesColors,
        palette,
        index,
        name: entry.name,
      }),
    })),
  };
}

function renderTopNBarChart(block, theme) {
  const items = Array.isArray(block.items) ? [...block.items] : [];
  const sorted = items
    .map((item) => ({ label: item.label, value: clampPositiveNumber(item.value, 0), color: item.color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, block.topN ?? 5);

  const maxValue = Math.max(1, ...sorted.map((item) => item.value));
  const rowHeight = 28;
  const chartHeight = Math.max(120, sorted.length * rowHeight + 24);
  const width = 520;
  const margin = { top: 12, right: 16, bottom: 10, left: 142 };
  const valueLabelSlot = 38;
  const chartWidth = Math.max(1, width - margin.left - margin.right - valueLabelSlot);
  const palette = getChartPalette(theme, block.palette);

  return {
    svg: (
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
        role="img"
        aria-label={block.title ?? 'Top N bar chart'}
      >
        {sorted.map((item, index) => {
          const y = margin.top + index * rowHeight;
          const barWidth = (item.value / maxValue) * chartWidth;
          const color = resolveColor({
            explicitColor: item.color,
            namedColors: block.itemColors,
            palette,
            index,
            name: item.label,
          });

          return (
            <g key={`${item.label}-${index}`}>
              <text
                x={margin.left - 10}
                y={y + 16}
                textAnchor="end"
                fill={theme.colors.text}
                fontSize="12"
                fontFamily={theme.fonts.text}
              >
                {item.label}
              </text>
              <rect x={margin.left} y={y} width={barWidth} height="18" rx="3" fill={color} />
              <text
                x={margin.left + barWidth + 6}
                y={y + 14}
                fill={theme.colors.muted}
                fontSize="11"
                fontFamily={theme.fonts.text}
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    ),
    legendItems: [],
  };
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const startX = cx + radius * Math.cos(startAngle);
  const startY = cy + radius * Math.sin(startAngle);
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
}

function renderPieChart(block, theme) {
  const slices = Array.isArray(block.slices) ? block.slices : [];
  const palette = getChartPalette(theme, block.palette);
  const total = Math.max(1, slices.reduce((sum, slice) => sum + clampPositiveNumber(slice.value, 0), 0));
  const cx = SVG_WIDTH / 2;
  const cy = SVG_HEIGHT / 2;
  const radius = 80;

  let start = -Math.PI / 2;

  return {
    svg: (
      <svg
        viewBox="0 0 520 260"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
        role="img"
        aria-label={block.title ?? 'Pie chart'}
      >
        {slices.map((slice, index) => {
          const value = clampPositiveNumber(slice.value, 0);
          const angle = (value / total) * Math.PI * 2;
          const end = start + angle;
          const path = arcPath(cx, cy, radius, start, end);
          const midAngle = start + angle / 2;
          const labelX = cx + (radius + 20) * Math.cos(midAngle);
          const labelY = cy + (radius + 20) * Math.sin(midAngle);
          const color = resolveColor({
            explicitColor: slice.color,
            namedColors: block.sliceColors,
            palette,
            index,
            name: slice.label,
          });
          start = end;

          return (
            <g key={`${slice.label}-${index}`}>
              <path d={path} fill={color} stroke={chartFill(theme.colors.background, 0.55)} strokeWidth="1" />
              <text
                x={labelX}
                y={labelY}
                fill={theme.colors.text}
                fontSize="11"
                fontFamily={theme.fonts.text}
                textAnchor={Math.cos(midAngle) >= 0 ? 'start' : 'end'}
              >
                {Math.round((value / total) * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    ),
    legendItems: slices.map((slice, index) => ({
      label: slice.label,
      color: resolveColor({
        explicitColor: slice.color,
        namedColors: block.sliceColors,
        palette,
        index,
        name: slice.label,
      }),
    })),
  };
}

export const chartRenderers = {
  line: renderLineChart,
  bar: renderBarChart,
  topNBar: renderTopNBarChart,
  pie: renderPieChart,
};
