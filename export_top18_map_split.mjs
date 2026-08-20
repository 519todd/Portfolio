import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/toddwu/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const OUTPUT_DIR = '/Users/toddwu/Desktop/Keynote slides/Localization';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto('http://localhost:3000/Forma_Localization.html', { waitUntil: 'networkidle0' });

await page.waitForFunction(() => document.querySelectorAll('circle.forma-dot').length > 0, { timeout: 15000 });
await new Promise(r => setTimeout(r, 500));

const el = await page.$('#challenge .img-block');
if (!el) throw new Error('Could not find Top 18 countries img-block');

async function prepareBase() {
  await page.evaluate(() => {
    const block = document.querySelector('#challenge .img-block');
    block.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    const title = block.querySelector('div[style*="text-align:center"]');
    if (title) title.remove();

    block.querySelectorAll('span.P-400-B').forEach(label => label.remove());

    document.querySelectorAll('path.bg-country').forEach(p => {
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', '#eeeeee');
      p.setAttribute('stroke-width', '1.2');
    });

    document.querySelectorAll('circle.forma-dot').forEach(c => {
      const fill = c.getAttribute('fill');
      if (fill === '#BA8AD6') c.setAttribute('fill', '#E9DAF6');
    });
  });
}

await prepareBase();

// Version A: only English-official dots (purple #4E008E)
await page.evaluate(() => {
  document.querySelectorAll('circle.forma-dot').forEach(c => {
    if (c.getAttribute('fill') === '#E9DAF6') c.style.display = 'none';
  });
});
await el.screenshot({ path: `${OUTPUT_DIR}/Top 18 countries - English official dots only.png`, omitBackground: true });
console.log('Saved: Top 18 countries - English official dots only.png');

// Reset and version B: only non-official dots (#E9DAF6)
await page.evaluate(() => {
  document.querySelectorAll('circle.forma-dot').forEach(c => {
    c.style.display = '';
    if (c.getAttribute('fill') === '#4E008E') c.style.display = 'none';
  });
});
await el.screenshot({ path: `${OUTPUT_DIR}/Top 18 countries - non-official dots only.png`, omitBackground: true });
console.log('Saved: Top 18 countries - non-official dots only.png');

await browser.close();
