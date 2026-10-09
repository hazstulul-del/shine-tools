import dotenv from 'dotenv';
dotenv.config({ override: true });

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './api/index.ts';

// Runner lokal / panel (npm run dev, npm start).
// Di Vercel file ini tidak dipakai: Vercel memakai api/index.ts sebagai serverless function.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ SHINE TOOLS Server is running on port ${PORT}`);
  });
}

startServer();
