/**
 * MotionForge — Frame Capture
 *
 * Uses Puppeteer (headless Chrome) to capture frames from the HTML composition.
 * Steps through the GSAP timeline frame-by-frame for deterministic output.
 */

import puppeteer from 'puppeteer';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { existsSync } from 'node:fs';

function findBrowserPath(): string | undefined {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter((p): p is string => Boolean(p));

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

export interface CaptureOptions {
  htmlPath: string;
  frameDir: string;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  startFrame: number;
  endFrame: number;
  onProgress?: (captured: number, total: number) => void;
}

/**
 * Capture frames from the HTML composition using headless Chrome.
 * Each frame is a PNG screenshot at the specified resolution.
 */
export async function captureFrames(options: CaptureOptions): Promise<void> {
  const {
    htmlPath,
    frameDir,
    width,
    height,
    fps,
    totalFrames,
    startFrame,
    endFrame,
    onProgress,
  } = options;

  const executablePath = findBrowserPath();

  const browser = await puppeteer.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=default',
      '--enable-accelerated-2d-canvas',
      '--disable-dev-shm-usage',
    ],
  });

  try {
    const page = await browser.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser error:', msg.text());
      }
    });
    page.on('pageerror', (err: any) => {
      console.error('Page runtime error:', err?.message || err);
    });

    // Set viewport to exact scene dimensions
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 1,
    });

    // Navigate to the composition HTML
    const fileUrl = pathToFileURL(htmlPath).href;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Ensure all web fonts are loaded
    await page.evaluate(() => (document as any).fonts?.ready);

    // Wait for GSAP timeline to be ready
    await page.waitForFunction('window.__mf_ready === true', { timeout: 10000 });

    // Capture frames
    const framesToCapture = endFrame - startFrame;

    for (let i = startFrame; i < endFrame; i++) {
      // Seek GSAP timeline to this frame
      await page.evaluate((frame: number) => {
        (window as any).__mf_seekToFrame(frame);
      }, i);

      // Small delay for rendering to settle
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));

      // Capture screenshot
      const frameNumber = String(i - startFrame).padStart(6, '0');
      const framePath = join(frameDir, `frame_${frameNumber}.png`);

      await page.screenshot({
        path: framePath,
        type: 'png',
        clip: { x: 0, y: 0, width, height },
      });

      onProgress?.(i - startFrame + 1, framesToCapture);
    }
  } finally {
    await browser.close();
  }
}
