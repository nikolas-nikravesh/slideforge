import { Box } from 'spectacle';

export function MediaBlock({ type, src, alt = '', style = {}, ...rest }) {
  if (type === 'video') {
    return (
      <Box>
        <video controls style={{ width: '100%', borderRadius: '8px', ...style }} {...rest}>
          <source src={src} />
        </video>
      </Box>
    );
  }

  return (
    <Box>
      <img src={src} alt={alt} style={{ width: '100%', borderRadius: '8px', ...style }} {...rest} />
    </Box>
  );
}
