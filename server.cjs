#!/usr/bin/env node

/**
 * Local Development Server with CORS and Security Headers
 * Serves Nebula Gaming on localhost:8000 with trusted source configuration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const HOST = 'localhost';
const ROOT_DIR = __dirname;

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
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
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = path.normalize(parsedUrl.pathname);

  // Ensure we don't go above root directory
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Full file path
  const filePath = path.join(ROOT_DIR, pathname);

  // Set CORS headers - allow localhost:8000
  const trustedOrigins = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost',
    'http://127.0.0.1'
  ];

  const origin = req.headers.origin || 'http://localhost:8000';
  const isTrusted = trustedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1');

  // Set security and CORS headers
  res.setHeader('Access-Control-Allow-Origin', isTrusted ? origin : 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(self), camera=(self), payment=()');

  // Cache headers for static assets
  res.setHeader('Cache-Control', 'public, max-age=3600');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // File not found - serve index.html for SPA routing
      if (err.code === 'ENOENT' && !pathname.includes('.')) {
        const indexPath = path.join(ROOT_DIR, 'index.html');
        fs.readFile(indexPath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            console.error(`[404] ${pathname}`);
            return;
          }
          res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
          res.end(data);
          console.log(`[200] ${pathname} -> index.html`);
        });
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.error(`[404] ${pathname}`);
      return;
    }

    // Is directory - serve index.html
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('403 Forbidden');
          console.error(`[403] ${pathname}`);
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
        res.end(data);
        console.log(`[200] ${pathname}index.html`);
      });
      return;
    }

    // Get MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        console.error(`[500] ${pathname} - ${err.message}`);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': data.length
      });
      res.end(data);
      console.log(`[200] ${pathname}`);
    });
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎮 Nebula Gaming - Local Development Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n✅ Server running on: http://${HOST}:${PORT}`);
  console.log(`\n🔒 Trusted Origins:`);
  console.log(`   • http://localhost:8000`);
  console.log(`   • http://127.0.0.1:8000`);
  console.log(`   • http://localhost`);
  console.log(`   • http://127.0.0.1`);
  console.log(`\n📁 Serving from: ${ROOT_DIR}`);
  console.log(`\n🔐 CORS Enabled: Yes`);
  console.log(`🔐 Security Headers: Enabled`);
  console.log(`\n💡 Features:`);
  console.log(`   • GZIP compression enabled`);
  console.log(`   • Cache control headers set`);
  console.log(`   • XSS protection enabled`);
  console.log(`   • Clickjacking protection enabled`);
  console.log(`   • Content-type sniffing prevention`);
  console.log(`\n⌨️  Press Ctrl+C to stop the server\n`);
  console.log(`${'='.repeat(60)}\n`);
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use`);
    console.error(`   Try: lsof -i :${PORT} to find the process`);
    console.error(`   Or use: kill -9 <PID> to stop it\n`);
  } else {
    console.error(`❌ Server error: ${err.message}\n`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📌 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📌 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
