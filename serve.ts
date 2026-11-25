// Tiny static server for local play-testing: `node serve.ts [--port 8080]`.
// Serves game/ only, refuses paths outside it. Development convenience.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const wanted = process.argv.includes('--port')
  ? Number(process.argv[process.argv.indexOf('--port') + 1])
  : Number(process.argv[2]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
};

createServer(async (request, response) => {
  try {
    const raw = decodeURIComponent(request.url.split('?')[0]);
    const path = raw === '/' ? '/index.html' : raw;
    const file = join(root, path);
    if (!file.startsWith(root)) { response.writeHead(403); response.end(); return; }
    const data = await readFile(file);
    response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('not found');
  }
}).listen(port, () => console.log('serving game/ at http://localhost:' + port));
