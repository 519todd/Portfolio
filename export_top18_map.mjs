import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/toddwu/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const OUTPUT_DIR = '/Users/toddwu/Desktop/Keynote slides/Localization';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto('http://localhost:3000/Forma_Localization.html', { waitUntil: 'networkidle0' });

// Wait for the D3 map dots to actually render (async d3.json fetch)
await page.waitForFunction(() => document.querySelectorAll('circle.forma-dot').length > 0, { timeout: 15000 });
await new Promise(r => setTimeout(r, 500));

const el = await page.$('#challenge .img-block');
if (!el) throw new Error('Could not find Top 18 countries img-block');

await page.evaluate(() => {
  const block = document.querySelector('#challenge .img-block');
  block.style.background = 'transparent';
  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';

  // Recolor map dots: English-official (#4E008E) -> #FFFFFF, non-official (#BA8AD6) -> #9E9E9E
  document.querySelectorAll('circle.forma-dot').forEach(c => {
    const fill = c.getAttribute('fill');
    if (fill === '#4E008E') c.setAttribute('fill', '#FFFFFF');
    else if (fill === '#BA8AD6') c.setAttribute('fill', '#9E9E9E');
  });

  // Match legend swatches to the new colors
  block.querySelectorAll('span[style*="border-radius:50%"]').forEach(s => {
    if (s.style.background === 'rgb(78, 0, 142)') s.style.background = '#FFFFFF';
    else if (s.style.background === 'rgb(186, 138, 214)') s.style.background = '#9E9E9E';
  });
});

await el.screenshot({ path: `${OUTPUT_DIR}/Top 18 countries using Forma.png`, omitBackground: true });
console.log('Saved: Top 18 countries using Forma.png');

await browser.close();
