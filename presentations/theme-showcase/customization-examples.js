import { bulletPresets, fontPresets, progressBarPresets } from 'slideforge';

// Example 1: Custom progress bar (Instagram-style segments)
export const segmentedProgressExample = {
  progressBar: progressBarPresets.segments,
};

// Example 2: No progress bar
export const noProgressExample = {
  progressBar: progressBarPresets.none,
};

// Example 3: Custom bullet icons
export const arrowBulletsExample = {
  bulletIcon: bulletPresets.arrow,
};

export const checkmarkBulletsExample = {
  bulletIcon: bulletPresets.checkmark,
};

export const starBulletsExample = {
  bulletIcon: bulletPresets.star,
};

// Example 4: Slide numbers
export const slideNumbersExample = {
  slideNumbers: {
    position: 'bottom-right',
    showTotal: true,
  },
};

export const slideNumbersLeftExample = {
  slideNumbers: {
    position: 'bottom-left',
    showTotal: false,
  },
};

// Example 5: Copyright footer
export const copyrightExample = {
  copyright: {
    text: '© 2026 Slideforge',
    position: 'bottom-right',
  },
};

// Example 6: Custom fonts
export const modernFontsExample = {
  tokens: {
    fonts: fontPresets.modern,
  },
};

export const monoFontsExample = {
  tokens: {
    fonts: fontPresets.mono,
  },
};

// Example 7: Everything combined
export const kitchenSinkExample = {
  progressBar: progressBarPresets.segments,
  bulletIcon: bulletPresets.checkmark,
  slideNumbers: {
    position: 'bottom-left',
    showTotal: true,
  },
  copyright: {
    text: '© 2026 My Company',
    position: 'bottom-right',
  },
  tokens: {
    fonts: fontPresets.sansSerif,
  },
};
