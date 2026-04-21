import { Box } from 'spectacle';

export function TwoHorizontalBoxesLayout({ left, right, ratio = '1fr 1fr', gap = '20px' }) {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: ratio,
        gap,
        alignItems: 'stretch',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Box style={{ minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>{left}</Box>
      <Box style={{ minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>{right}</Box>
    </Box>
  );
}
