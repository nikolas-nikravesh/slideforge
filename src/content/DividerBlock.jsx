import { Box } from 'spectacle';
import { usePresentationTheme } from '../themes/PresentationThemeContext';

export function DividerBlock({
  orientation = 'vertical',
  length = '100%',
  thickness = '2px',
  color,
  gradient,
  glow = true,
  style = {},
}) {
  const { tokens } = usePresentationTheme();
  const isVertical = orientation === 'vertical';
  const resolvedGradient =
    gradient ??
    (isVertical
      ? `linear-gradient(180deg, ${tokens.colors.accent}, #F77AF8, ${tokens.colors.secondary})`
      : `linear-gradient(90deg, ${tokens.colors.accent}, #F77AF8, ${tokens.colors.secondary})`);
  const resolvedColor = color ?? tokens.colors.accent;

  return (
    <Box
      aria-hidden="true"
      style={{
        width: isVertical ? thickness : length,
        height: isVertical ? length : thickness,
        minWidth: isVertical ? thickness : 0,
        minHeight: isVertical ? 0 : thickness,
        justifySelf: 'center',
        alignSelf: 'center',
        borderRadius: '999px',
        background: gradient || !color ? resolvedGradient : resolvedColor,
        boxShadow: glow ? `0 0 22px ${tokens.colors.secondary}99` : undefined,
        ...style,
      }}
    />
  );
}
