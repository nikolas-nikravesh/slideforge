import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

const DEFAULT_VIEWPORT = { width: 1600, height: 900, deviceScaleFactor: 1 };
const DEFAULT_PREVIEW_QUALITY = 82;
const PREVIEW_MANIFEST_FILE = 'manifest.json';

function getDefaultChromePath() {
  const candidates = [
    process.env.SLIDEFORGE_CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload, null, 2));
}

function readRequestBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        rejectBody(new Error('Request body is too large.'));
      }
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolveBody({});
        return;
      }

      try {
        resolveBody(JSON.parse(body));
      } catch (error) {
        rejectBody(error);
      }
    });

    req.on('error', rejectBody);
  });
}

function createSlideUrl(baseUrl, index, { includeHidden = true } = {}) {
  const url = new URL(baseUrl);
  url.search = '';
  url.searchParams.set('presentationMode', 'true');
  url.searchParams.set('includeHidden', includeHidden ? 'true' : 'false');
  url.searchParams.set('slideforgeExport', 'true');
  url.searchParams.set('slideIndex', String(index));
  url.searchParams.set('stepIndex', '999');
  return url.toString();
}

function getPublicPathOutputDir(publicPath) {
  if (!publicPath || !publicPath.startsWith('/')) {
    return null;
  }

  return resolve(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
}

function getPreviewOutputDir(deckMetadata, requestedOutputDir) {
  if (requestedOutputDir) {
    return resolve(process.cwd(), requestedOutputDir);
  }

  const previewConfig = deckMetadata?.previews;
  if (previewConfig && typeof previewConfig === 'object' && !Array.isArray(previewConfig)) {
    const publicOutputDir = getPublicPathOutputDir(previewConfig.basePath);
    if (publicOutputDir) {
      return publicOutputDir;
    }
  }

  const deckId = deckMetadata?.id ?? 'presentation';
  return resolve(process.cwd(), 'public', 'previews', deckId);
}

function getAdditionalPreviewOutputDirs(deckMetadata, requestedOutputDir) {
  if (requestedOutputDir) {
    return [];
  }

  const previewConfig = deckMetadata?.previews;
  if (!previewConfig || typeof previewConfig !== 'object' || Array.isArray(previewConfig)) {
    return [];
  }

  if (!previewConfig.basePath?.startsWith('/')) {
    return [];
  }

  const distOutputDir = resolve(process.cwd(), 'dist', previewConfig.basePath.replace(/^\/+/, ''));
  return existsSync(resolve(process.cwd(), 'dist')) ? [distOutputDir] : [];
}

function getPreviewIndexes({ slideCount, slideIndexes, limit }) {
  if (Array.isArray(slideIndexes) && slideIndexes.length > 0) {
    return slideIndexes
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index) && index >= 0 && index < slideCount);
  }

  const count = Number.isInteger(limit) && limit > 0 ? Math.min(limit, slideCount) : slideCount;
  return Array.from({ length: count }, (_, index) => index);
}

function getSlideIndexesFromRequest(body, requestUrl) {
  if (Array.isArray(body.slideIndexes)) {
    return body.slideIndexes;
  }

  const rawSlideIndexes = requestUrl.searchParams.get('slideIndexes');
  if (!rawSlideIndexes) {
    return undefined;
  }

  return rawSlideIndexes.split(',').map((value) => Number(value.trim()));
}

async function withRenderedSlides({
  url,
  viewport,
  chromePath,
  slideIndexes,
  limit,
  includeHidden = true,
  onSlide,
}) {
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.emulateMediaType('screen');
    await page.goto(createSlideUrl(url, 0, { includeHidden }), { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => window.__SLIDEFORGE_DECK__?.slideCount > 0, { timeout: 45000 });

    const deckMetadata = await page.evaluate(() => window.__SLIDEFORGE_DECK__);
    const renderedSlideCount =
      includeHidden === false ? deckMetadata.visibleSlideCount ?? deckMetadata.slideCount : deckMetadata.slideCount;
    const indexes = getPreviewIndexes({ slideCount: renderedSlideCount, slideIndexes, limit });

    for (const index of indexes) {
      await page.goto(createSlideUrl(url, index, { includeHidden }), { waitUntil: 'domcontentloaded', timeout: 45000 });
      await waitForRender(page);
      await onSlide({ page, index, deckMetadata });
    }

    return {
      deckMetadata: {
        ...deckMetadata,
        slideCount: renderedSlideCount,
      },
      indexes,
    };
  } finally {
    await browser.close();
  }
}

async function waitForRender(page) {
  await page.evaluate(async () => {
    for (const button of Array.from(document.querySelectorAll('button'))) {
      button.remove();
    }

    for (const video of Array.from(document.querySelectorAll('video'))) {
      video.pause();
      video.currentTime = 0;
      video.controls = false;
    }

    await Promise.all(
      Array.from(document.images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolveImage) => {
          img.addEventListener('load', resolveImage, { once: true });
          img.addEventListener('error', resolveImage, { once: true });
        });
      })
    );

    await document.fonts?.ready;
  });

  await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
}

export async function exportPresentationToPdf({
  url,
  output,
  viewport = DEFAULT_VIEWPORT,
  chromePath = getDefaultChromePath(),
  includeHidden = true,
} = {}) {
  if (!url) {
    throw new Error('Missing required export URL.');
  }

  if (!output) {
    throw new Error('Missing required output path.');
  }

  if (!chromePath) {
    throw new Error('Could not find Chrome. Set SLIDEFORGE_CHROME_PATH to a Chrome or Chromium executable.');
  }

  const { PDFDocument } = await import('pdf-lib');
  const outputPath = resolve(process.cwd(), output);
  const mergedPdf = await PDFDocument.create();
  const { deckMetadata, indexes } = await withRenderedSlides({
    url,
    viewport,
    chromePath,
    includeHidden,
    onSlide: async ({ page }) => {
      const pdfBytes = await page.pdf({
        width: `${viewport.width}px`,
        height: `${viewport.height}px`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        pageRanges: '1',
      });
      const slidePdf = await PDFDocument.load(pdfBytes);
      const [slidePage] = await mergedPdf.copyPages(slidePdf, [0]);
      mergedPdf.addPage(slidePage);
    },
  });

  const mergedBytes = await mergedPdf.save();
  mkdirSync(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, mergedBytes);

  return {
    outputPath,
    slideCount: deckMetadata.slideCount,
    generatedCount: indexes.length,
    viewport,
  };
}

export async function exportPresentationPreviews({
  url,
  outputDir,
  viewport = DEFAULT_VIEWPORT,
  chromePath = getDefaultChromePath(),
  format = 'jpeg',
  quality = DEFAULT_PREVIEW_QUALITY,
  slideIndexes,
  limit,
} = {}) {
  if (!url) {
    throw new Error('Missing required export URL.');
  }

  if (!chromePath) {
    throw new Error('Could not find Chrome. Set SLIDEFORGE_CHROME_PATH to a Chrome or Chromium executable.');
  }

  let resolvedOutputDir;
  let outputDirs = [];
  const extension = format === 'png' ? 'png' : 'jpg';
  const files = [];
  const version = String(Date.now());
  const { deckMetadata, indexes } = await withRenderedSlides({
    url,
    viewport,
    chromePath,
    slideIndexes,
    limit,
    onSlide: async ({ page, index, deckMetadata: metadata }) => {
      if (!resolvedOutputDir) {
        resolvedOutputDir = getPreviewOutputDir(metadata, outputDir);
        outputDirs = [resolvedOutputDir, ...getAdditionalPreviewOutputDirs(metadata, outputDir)];
        outputDirs.forEach((nextOutputDir) => mkdirSync(nextOutputDir, { recursive: true }));
      }
      const fileName = `slide-${String(index + 1).padStart(2, '0')}.${extension}`;
      const screenshotOptions = {
        fullPage: false,
        type: format === 'png' ? 'png' : 'jpeg',
      };

      if (screenshotOptions.type === 'jpeg') {
        screenshotOptions.quality = quality;
      }

      const screenshot = await page.screenshot(screenshotOptions);
      await Promise.all(outputDirs.map((nextOutputDir) => writeFile(resolve(nextOutputDir, fileName), screenshot)));
      const filePath = resolve(resolvedOutputDir, fileName);
      files.push(filePath);
    },
  });
  const manifest = {
    version,
    generatedAt: new Date(Number(version)).toISOString(),
    slideCount: deckMetadata.slideCount,
    generatedCount: indexes.length,
    format: format === 'png' ? 'png' : 'jpeg',
    quality: format === 'png' ? undefined : quality,
    files: files.map((filePath) => basename(filePath)),
  };

  if (outputDirs.length > 0) {
    await Promise.all(
      outputDirs.map((nextOutputDir) =>
        writeFile(resolve(nextOutputDir, PREVIEW_MANIFEST_FILE), JSON.stringify(manifest, null, 2))
      )
    );
  }

  return {
    outputDir: resolvedOutputDir,
    additionalOutputDirs: outputDirs.filter((nextOutputDir) => nextOutputDir !== resolvedOutputDir),
    slideCount: deckMetadata.slideCount,
    generatedCount: indexes.length,
    files,
    manifest: outputDirs.length > 0 ? resolve(resolvedOutputDir, PREVIEW_MANIFEST_FILE) : undefined,
    version,
    viewport,
    format: format === 'png' ? 'png' : 'jpeg',
    quality: format === 'png' ? undefined : quality,
  };
}

export function slideforgePdfExportPlugin() {
  const installExportMiddlewares = (server) => {
    server.middlewares.use('/__slideforge/export/pdf', async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed. Use GET or POST.' });
        return;
      }

      try {
        const host = req.headers.host ?? '127.0.0.1:5173';
        const requestUrl = new URL(req.url ?? '/', `http://${host}`);
        const body = req.method === 'POST' ? await readRequestBody(req) : {};
        const output = body.output ?? requestUrl.searchParams.get('output') ?? 'exports/presentation.pdf';
        const width = Number(body.width ?? requestUrl.searchParams.get('width') ?? DEFAULT_VIEWPORT.width);
        const height = Number(body.height ?? requestUrl.searchParams.get('height') ?? DEFAULT_VIEWPORT.height);
        const deviceScaleFactor = Number(
          body.deviceScaleFactor ?? requestUrl.searchParams.get('deviceScaleFactor') ?? DEFAULT_VIEWPORT.deviceScaleFactor
        );
        const protocol = req.headers['x-forwarded-proto'] ?? 'http';
        const baseUrl = body.url ?? `${protocol}://${host}/`;

        const result = await exportPresentationToPdf({
          url: baseUrl,
          output,
          viewport: { width, height, deviceScaleFactor },
          chromePath: body.chromePath ?? requestUrl.searchParams.get('chromePath') ?? getDefaultChromePath(),
          includeHidden: String(body.includeHidden ?? requestUrl.searchParams.get('includeHidden') ?? 'true') === 'true',
        });

        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    server.middlewares.use('/__slideforge/export/previews', async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed. Use GET or POST.' });
        return;
      }

      try {
        const host = req.headers.host ?? '127.0.0.1:5173';
        const requestUrl = new URL(req.url ?? '/', `http://${host}`);
        const body = req.method === 'POST' ? await readRequestBody(req) : {};
        const width = Number(body.width ?? requestUrl.searchParams.get('width') ?? DEFAULT_VIEWPORT.width);
        const height = Number(body.height ?? requestUrl.searchParams.get('height') ?? DEFAULT_VIEWPORT.height);
        const deviceScaleFactor = Number(
          body.deviceScaleFactor ?? requestUrl.searchParams.get('deviceScaleFactor') ?? DEFAULT_VIEWPORT.deviceScaleFactor
        );
        const quality = Number(body.quality ?? requestUrl.searchParams.get('quality') ?? DEFAULT_PREVIEW_QUALITY);
        const limitValue = body.limit ?? requestUrl.searchParams.get('limit');
        const limit = limitValue === undefined || limitValue === null ? undefined : Number(limitValue);
        const protocol = req.headers['x-forwarded-proto'] ?? 'http';
        const baseUrl = body.url ?? `${protocol}://${host}/`;

        const result = await exportPresentationPreviews({
          url: baseUrl,
          outputDir: body.outputDir ?? requestUrl.searchParams.get('outputDir'),
          viewport: { width, height, deviceScaleFactor },
          chromePath: body.chromePath ?? requestUrl.searchParams.get('chromePath') ?? getDefaultChromePath(),
          format: body.format ?? requestUrl.searchParams.get('format') ?? 'jpeg',
          quality,
          slideIndexes: getSlideIndexesFromRequest(body, requestUrl),
          limit: Number.isFinite(limit) ? limit : undefined,
        });

        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 500, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  };

  return {
    name: 'slideforge-pdf-export',
    configureServer(server) {
      installExportMiddlewares(server);
    },
    configurePreviewServer(server) {
      installExportMiddlewares(server);
    },
  };
}
