import { Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';

export function PanelBox({ children, style = {} }) {
  const { tokens } = usePresentationTheme();

  return (
    <Box
      style={{
        border: `1px solid ${tokens.colors.border}`,
        backgroundColor: tokens.colors.surface,
        borderRadius: '8px',
        padding: '24px',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflowY: 'auto',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
