import { Box } from 'spectacle';

function toAreaString(areas) {
  if (!areas || areas.length === 0) {
    return undefined;
  }

  return areas.map((row) => `"${row.join(' ')}"`).join(' ');
}

function inferColumnCount(areas) {
  if (!Array.isArray(areas) || areas.length === 0) {
    return 1;
  }
  return Math.max(...areas.map((row) => row.length), 1);
}

function inferRowCount(areas) {
  if (!Array.isArray(areas) || areas.length === 0) {
    return 1;
  }
  return Math.max(areas.length, 1);
}

function defaultTrackTemplate(count) {
  return `repeat(${count}, minmax(0, 1fr))`;
}

function normalizeTrackTemplate(template) {
  if (typeof template !== 'string') {
    return template;
  }

  return template
    .trim()
    .split(/\s+/)
    .map((part) => {
      if (/^\d*\.?\d+fr$/i.test(part)) {
        return `minmax(0, ${part})`;
      }
      return part;
    })
    .join(' ');
}

export function GridLayout({ columns, rows, areas, gap = '16px', children }) {
  const resolvedColumns = normalizeTrackTemplate(columns ?? defaultTrackTemplate(inferColumnCount(areas)));
  const resolvedRows = normalizeTrackTemplate(rows ?? defaultTrackTemplate(inferRowCount(areas)));

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: resolvedColumns,
        gridTemplateRows: resolvedRows,
        gridTemplateAreas: toAreaString(areas),
        gridAutoRows: 'minmax(0, 1fr)',
        gridAutoColumns: 'minmax(0, 1fr)',
        alignItems: 'stretch',
        alignContent: 'stretch',
        justifyItems: 'stretch',
        gap,
        height: '100%',
        width: '100%',
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
}
