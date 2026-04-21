function compact(value) {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
}

function normalizeBlocks(blocks) {
  return Array.isArray(blocks) ? blocks : [blocks];
}

function createChartBlock(chartType, config = {}) {
  return compact({ type: 'chart', chartType, ...config });
}

export const fx = {
  floating: (options = {}) => ({ type: 'floating', ...options }),
  pulsing: (options = {}) => ({ type: 'pulsing', ...options }),
  slideIn: (direction = 'left', options = {}) => ({ type: 'slideIn', direction, ...options }),
};

export const b = {
  heading: (text, options = {}) => compact({ type: 'heading', text, ...options }),
  text: (text, options = {}) => compact({ type: 'text', text, ...options }),
  bullets: (items, options = {}) => compact({ type: 'bullets', items, fontSize: options.fontSize, gap: options.gap, ...options }),
  progressiveBullets: (items, options = {}) => compact({ type: 'progressiveBullets', items, fontSize: options.fontSize, gap: options.gap, ...options }),
  code: (code, language = 'javascript', options = {}) => compact({ type: 'code', code, language, fontSize: options.fontSize, ...options }),
  data: (data, options = {}) => compact({ type: 'data', data, ...options }),
  chart: (chartType, config = {}) => createChartBlock(chartType, config),
  lineChart: (config = {}) => createChartBlock('line', config),
  barChart: (config = {}) => createChartBlock('bar', config),
  topNBarChart: (config = {}) => createChartBlock('topNBar', config),
  pieChart: (config = {}) => createChartBlock('pie', config),
  media: (src, mediaType = 'image', options = {}) =>
    compact({ type: 'media', src, mediaType, alt: options.alt, style: options.style, ...options }),
  panel: (blocks, options = {}) => compact({ type: 'panel', blocks: normalizeBlocks(blocks), ...options }),
  stack: (blocks, options = {}) => compact({ type: 'stack', blocks: normalizeBlocks(blocks), ...options }),
  custom: (render) => ({ render }),
  customType: (type, props = {}) => ({ type, ...props }),
};

export const r = {
  blocks: (...blocks) => normalizeBlocks(blocks.flat()),
  panel: (blocks, options = {}) => compact({ panel: true, blocks: normalizeBlocks(blocks), ...options }),
};

export function slide({
  title,
  template = 'oneBox',
  regions = {},
  layout = {},
  id,
  notes,
  render,
  blockRenderers,
} = {}) {
  return compact({ title, template, regions, layout, id, notes, render, blockRenderers });
}

export function definePresentation({
  id,
  title,
  theme,
  favicon,
  browserTitle,
  titleSlide,
  outroSlide,
  slides = [],
  blockRenderers = {},
  progressBar,
  bulletIcon,
  slideNumbers,
  copyright,
} = {}) {
  return compact({
    id,
    title,
    theme,
    favicon,
    browserTitle,
    titleSlide,
    outroSlide,
    slides,
    blockRenderers,
    progressBar,
    bulletIcon,
    slideNumbers,
    copyright,
  });
}

export function presentation(initial = {}) {
  const state = {
    id: initial.id,
    title: initial.title,
    theme: initial.theme,
    favicon: initial.favicon,
    browserTitle: initial.browserTitle,
    titleSlide: initial.titleSlide,
    outroSlide: initial.outroSlide,
    slides: [...(initial.slides ?? [])],
    blockRenderers: { ...(initial.blockRenderers ?? {}) },
    progressBar: initial.progressBar,
    bulletIcon: initial.bulletIcon,
    slideNumbers: initial.slideNumbers,
    copyright: initial.copyright,
  };

  const api = {
    id(value) {
      state.id = value;
      return api;
    },
    theme(value) {
      state.theme = value;
      return api;
    },
    favicon(value) {
      state.favicon = value;
      return api;
    },
    title(title, subtitle) {
      state.title = title;
      state.titleSlide = { title, subtitle };
      return api;
    },
    browserTitle(value) {
      state.browserTitle = value;
      return api;
    },
    outro(title, subtitle) {
      state.outroSlide = { title, subtitle };
      return api;
    },
    progressBar(value) {
      state.progressBar = value;
      return api;
    },
    bulletIcon(value) {
      state.bulletIcon = value;
      return api;
    },
    slideNumbers(value) {
      state.slideNumbers = value;
      return api;
    },
    copyright(value) {
      state.copyright = value;
      return api;
    },
    add(slideDefinition) {
      state.slides.push(slideDefinition);
      return api;
    },
    addSlides(slideDefinitions = []) {
      state.slides.push(...slideDefinitions);
      return api;
    },
    useBlockRenderers(renderers = {}) {
      state.blockRenderers = { ...state.blockRenderers, ...renderers };
      return api;
    },
    build() {
      return definePresentation(state);
    },
  };

  return api;
}
