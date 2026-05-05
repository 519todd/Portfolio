import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('.', import.meta.url));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = join(dir, url === '/' ? 'index.html' : url);
    const data = await readFile(file);
    const ct = mime[extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(3000, () => console.log('http://localhost:3000'));
