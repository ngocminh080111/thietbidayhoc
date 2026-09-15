// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// EXPRESS + VITE INTEGRATED FULL-STACK SERVER
// ==============================================================================
import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './backend/routes/api.routes.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for API calls
  app.use('/api', (req, res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Mount API routes FIRST before frontend middleware
  app.use('/api', apiRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Trường Cao đẳng X Server đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer();
