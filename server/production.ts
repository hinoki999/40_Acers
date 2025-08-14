import express from "express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function setupProductionServer(app: express.Application) {
  console.log('🏗️ Setting up production server...');
  
  // Production static file path - must be relative to bundle location
  const staticPath = join(__dirname, 'public');
  console.log(`📦 Static files path: ${staticPath}`);
  
  app.use(express.static(staticPath, {
    maxAge: '1y',
    etag: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // API route prefix handling
  app.use('/api/*', (req, res, next) => {
    // Log API requests for debugging
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
  });

  // Catch-all handler: send back React's index.html file for SPA routing
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    try {
      const indexPath = join(__dirname, 'public/index.html');
      console.log(`📄 Serving index.html from: ${indexPath}`);
      const indexHtml = readFileSync(indexPath, 'utf8');
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(indexHtml);
    } catch (error) {
      console.error('❌ Error serving index.html:', error);
      console.error(`❌ Attempted path: ${join(staticPath, 'index.html')}`);
      res.status(500).json({
        error: 'Production build not found',
        message: 'Run `vite build` to create the frontend build',
        timestamp: new Date().toISOString()
      });
    }
  });

  console.log('✅ Production server setup complete');
}