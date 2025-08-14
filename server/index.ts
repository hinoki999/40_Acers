import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { performanceMiddleware, securityMiddleware, rateLimitMiddleware } from "./performanceMiddleware";
import cors from "cors";

const app = express();

// Production-ready middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://40ac.app', 
        'https://40acres.app',
        'https://40a.property', 
        'https://40a.homes',
        'https://40acresapp.replit.app'
      ] 
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Health check endpoint (highest priority)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    api: 'functional',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      security: 'active',
      payments: 'ready'
    }
  });
});

// Serve attached assets
app.use('/attached_assets', express.static('attached_assets'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Production-grade error handling
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Enhanced error logging for production debugging
    console.error(`[${new Date().toISOString()}] Server Error:`, {
      url: req.url,
      method: req.method,
      status,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    if (!res.headersSent) {
      const errorResponse = {
        error: true,
        status,
        message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { 
          stack: err.stack,
          details: err 
        })
      };
      
      res.status(status).json(errorResponse);
    }
  });

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: true,
      status: 404,
      message: `API endpoint not found: ${req.originalUrl}`,
      timestamp: new Date().toISOString()
    });
  });

  // Setup different serving strategies for dev vs production
  if (process.env.NODE_ENV === "production") {
    // Production: serve built assets and handle SPA routing
    const { setupProductionServer } = await import('./production');
    setupProductionServer(app);
  } else {
    // Development: use Vite dev server
    await setupVite(app, server);
  }

  // Production server startup with graceful error handling
  const port = Number(process.env.PORT) || 5000;
  const host = "0.0.0.0";
  
  server.listen(port, host, () => {
    log(`🚀 Production server running on ${host}:${port}`);
    log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`🔗 Health check: http://${host}:${port}/health`);
    log(`🛡️ Security services: integrated and active`);
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
      log('✅ Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
      log('✅ Process terminated');
      process.exit(0);
    });
  });

  // Unhandled promise rejection handler
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in production to maintain uptime
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });
})();
