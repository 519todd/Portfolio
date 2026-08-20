import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/toddwu/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const OUTPUT_DIR = '/Users/toddwu/Desktop/Keynote slides/Localization';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

await page.goto('http://localhost:3000/Forma_Localization.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));

// Get both img-block elements inside #challenge .two-col
const imgBlocks = await page.$$('#challenge .two-col > div > .img-block');
console.log('Found img-blocks:', imgBlocks.length);

if (imgBlocks.length >= 1) {
  // Scroll into view and screenshot each element directly
  await page.evaluate(el => el.scrollIntoView({ block: 'center' }), imgBlocks[0]);
  await new Promise(r => setTimeout(r, 1000));
  await imgBlocks[0].screenshot({ path: `${OUTPUT_DIR}/Challenge - User Problem.png` });
  console.log('Saved: Challenge - User Problem.png');
}

if (imgBlocks.length >= 2) {
  await page.evaluate(el => el.scrollIntoView({ block: 'center' }), imgBlocks[1]);
  await new Promise(r => setTimeout(r, 1000));
  await imgBlocks[1].screenshot({ path: `${OUTPUT_DIR}/Challenge - Business Problem.png` });
  console.log('Saved: Challenge - Business Problem.png');
}

await browser.close();
console.log('Done.');
