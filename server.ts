import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRoutes from './server/routes/auth';
import newsRoutes from './server/routes/news';
import analyticsRoutes from './server/routes/analytics';
import adminRoutes from './server/routes/admin';
import { connectDatabase } from './server/config/database';
import { seedArticles } from './server/utils/seeder';
import { fetchAndSeedExternalNews } from './server/services/newsService';

async function startServer() {
  // Connect to MongoDB Atlas / Local Database
  await connectDatabase();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(express.json());

  // Run database seeder and external news sync
  try {
    await seedArticles();
    // Run external news sync in the background
    fetchAndSeedExternalNews().catch((err) => {
      console.error('Failed to run external news sync on boot:', err);
    });
  } catch (err) {
    console.error('Failed to run database seeder on boot:', err);
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve static assets/Vite frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production build assets from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEWSMANIA AI] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
