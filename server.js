const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8'
};

function serveFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>404 - Halaman Tidak Ditemukan</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0b0f19; color: #f1f5f9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #6366f1; }
            p { color: #94a3b8; }
            a { color: #38bdf8; text-decoration: none; font-weight: bold; border: 1px solid #38bdf8; padding: 0.5rem 1rem; border-radius: 8px; display: inline-block; margin-top: 1rem; }
            a:hover { background: #38bdf8; color: #0b0f19; }
          </style>
        </head>
        <body>
          <div>
            <h1>404</h1>
            <p>Halaman atau file tidak ditemukan.</p>
            <a href="/">Kembali ke Beranda</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const safeUrl = decodeURI(req.url.split('?')[0]);
    let reqPath = safeUrl === '/' ? '/index.html' : safeUrl;
    let fullPath = path.join(BASE_DIR, reqPath);

    // Security check to avoid path traversal
    if (!fullPath.startsWith(BASE_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Akses ditolak.');
      return;
    }

    // Check if directory, serve index.html
    fs.stat(fullPath, (err, stats) => {
      if (!err && stats.isDirectory()) {
        fullPath = path.join(fullPath, 'index.html');
      }
      serveFile(req, res, fullPath);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} sedang digunakan, mencoba port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Portofolio Server Berjalan!`);
    console.log(`👉 Buka di browser: http://localhost:${port}`);
    console.log(`⚡ Tekan Ctrl+C untuk menghentikan server`);
    console.log(`=================================================\n`);
  });
}

startServer(Number(PORT));
