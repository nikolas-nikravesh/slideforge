import { Box } from 'spectacle';

export function TwoVerticalBoxesLayout({ top, bottom, ratio = '1fr 1fr', gap = '18px' }) {
  return (
    <Box style={{ display: 'grid', gridTemplateRows: ratio, gap, height: '100%', minHeight: 0 }}>
      <Box style={{ minHeight: 0, overflow: 'hidden' }}>{top}</Box>
      <Box style={{ minHeight: 0, overflow: 'hidden' }}>{bottom}</Box>
    </Box>
  );
}
