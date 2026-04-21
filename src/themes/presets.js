// Bullet icon presets that can be used in theme configurations
export const bulletPresets = {
  default: null, // Uses the default gradient diamond

  circle: {
    symbol: '●',
    size: '0.6rem',
  },

  arrow: {
    symbol: '▸',
    size: '0.8rem',
  },

  checkmark: {
    symbol: '✓',
    size: '0.9rem',
  },

  star: {
    symbol: '★',
    size: '0.75rem',
  },

  diamond: {
    symbol: '◆',
    size: '0.6rem',
  },

  dash: {
    symbol: '–',
    size: '0.9rem',
  },

  plus: {
    symbol: '+',
    size: '0.8rem',
  },
};

// Font presets for common font stacks
export const fontPresets = {
  serif: {
    header: '"Merriweather", "Georgia", serif',
    text: '"Source Serif 4", "Iowan Old Style", "Georgia", serif',
    monospace: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },

  sansSerif: {
    header: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    text: '"Inter", "Helvetica Neue", "Arial", sans-serif',
    monospace: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  },

  modern: {
    header: '"Montserrat", "Helvetica Neue", sans-serif',
    text: '"Open Sans", "Helvetica Neue", sans-serif',
    monospace: '"Fira Code", "Consolas", monospace',
  },

  classic: {
    header: '"Playfair Display", "Georgia", serif',
    text: '"Lora", "Georgia", serif',
    monospace: '"Courier New", monospace',
  },

  mono: {
    header: '"JetBrains Mono", "Fira Code", monospace',
    text: '"JetBrains Mono", "Fira Code", monospace',
    monospace: '"JetBrains Mono", "Fira Code", monospace',
  },

  system: {
    header: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    text: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    monospace: 'ui-monospace, "SF Mono", "Cascadia Code", monospace',
  },
};

// Progress bar presets
export const progressBarPresets = {
  gradient: { type: 'gradient' },
  segments: { type: 'segments' },
  none: { type: 'none' },
};
