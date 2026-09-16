import { Box } from 'spectacle';

function normalizeBackground(background, fallbackColor) {
  if (!background) {
    return { color: fallbackColor };
  }

  if (typeof background === 'string') {
    return { color: fallbackColor, image: background };
  }

  return {
    color: background.color ?? fallbackColor,
    image: background.image ?? background.src ?? background.url,
    opacity: background.opacity,
    size: background.size,
    position: background.position,
    repeat: background.repeat,
    blendMode: background.blendMode,
    filter: background.filter,
    overlay: background.overlay,
    style: background.style,
  };
}

function normalizeOverlay(overlay) {
  if (!overlay) {
    return null;
  }

  if (typeof overlay === 'string') {
    return { color: overlay };
  }

  return {
    color: overlay.color,
    opacity: overlay.opacity,
    blendMode: overlay.blendMode,
    style: overlay.style,
  };
}

export function getSlideBackgroundColor(background, fallbackColor) {
  return normalizeBackground(background, fallbackColor).color;
}

export function SlideBackground({ background, fallbackColor }) {
  const resolvedBackground = normalizeBackground(background, fallbackColor);
  const overlay = normalizeOverlay(resolvedBackground.overlay);

  if (!resolvedBackground.image && !overlay) {
    return null;
  }

  return (
    <>
      {resolvedBackground.image ? (
        <Box
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${resolvedBackground.image}")`,
            backgroundSize: resolvedBackground.size ?? 'cover',
            backgroundPosition: resolvedBackground.position ?? 'center',
            backgroundRepeat: resolvedBackground.repeat ?? 'no-repeat',
            opacity: resolvedBackground.opacity ?? 1,
            mixBlendMode: resolvedBackground.blendMode,
            filter: resolvedBackground.filter,
            pointerEvents: 'none',
            ...resolvedBackground.style,
          }}
        />
      ) : null}
      {overlay ? (
        <Box
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: overlay.color,
            opacity: overlay.opacity ?? 1,
            mixBlendMode: overlay.blendMode,
            pointerEvents: 'none',
            ...overlay.style,
          }}
        />
      ) : null}
    </>
  );
}
