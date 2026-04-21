import { Box } from 'spectacle';

export function OneBoxLayout({ children }) {
  return <Box style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}>{children}</Box>;
}
