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

await page.evaluate(() => {
  const block = document.querySelector('#challenge .img-block');
  block.style.background = 'transparent';
  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';

  // Remove title text
  const title = block.querySelector('div[style*="text-align:center"]');
  if (title) title.remove();

  // Remove legend label text (keep the colored swatch dots)
  block.querySelectorAll('span.P-400-B').forEach(label => {
    [...label.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
  });

  // Landmass: outline only, using the current fill color as the line color
  document.querySelectorAll('path.bg-country').forEach(p => {
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', '#eeeeee');
    p.setAttribute('stroke-width', '1.2');
  });

  // Recolor map dots: English-official keeps original purple, non-official -> #E9DAF6
  document.querySelectorAll('circle.forma-dot').forEach(c => {
    const fill = c.getAttribute('fill');
    if (fill === '#BA8AD6') c.setAttribute('fill', '#E9DAF6');
  });

  // Match legend swatch for non-official group
  block.querySelectorAll('span[style*="border-radius:50%"]').forEach(s => {
    if (s.style.background === 'rgb(186, 138, 214)') s.style.background = '#E9DAF6';
  });
});

await el.screenshot({ path: `${OUTPUT_DIR}/Top 18 countries using Forma - outline map.png`, omitBackground: true });
console.log('Saved: Top 18 countries using Forma - outline map.png');

await browser.close();
