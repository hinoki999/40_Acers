import type { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analyticsService";
import { securityService } from "./securityService";

// Performance monitoring middleware
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Track API call
  res.on('finish', async () => {
    const responseTime = Date.now() - startTime;
    const userId = req.isAuthenticated() ? (req.user as any)?.id : undefined;
    
    try {
      await analyticsService.trackApiMetric({
        endpoint: req.route?.path || req.path,
        responseTime,
        statusCode: res.statusCode,
        userId,
        errorMessage: res.statusCode >= 400 ? res.statusMessage : undefined
      });
    } catch (error) {
      console.error('Failed to track API metric:', error);
    }
  });
  
  next();
}

// Security monitoring middleware  
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const ipAddress = req.ip || req.connection.remoteAddress || '';
  const userAgent = req.get('User-Agent') || '';
  
  // Log security events for authenticated users
  if (req.isAuthenticated()) {
    const userId = (req.user as any)?.id;
    
    // Track device activity
    const deviceId = req.headers['x-device-id'] as string;
    if (deviceId) {
      securityService.updateDeviceActivity(deviceId).catch(console.error);
    }
    
    // Log API access
    securityService.logSecurityEvent({
      userId,
      action: 'api_access',
      ipAddress,
      userAgent,
      riskLevel: 'low',
      metadata: {
        endpoint: req.path,
        method: req.method
      }
    }).catch(console.error);
  }
  
  next();
}

// Rate limiting middleware (simple implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();
    
    const current = requestCounts.get(identifier);
    
    if (!current || now > current.resetTime) {
      requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (current.count >= maxRequests) {
      return res.status(429).json({ 
        message: "Too many requests", 
        retryAfter: Math.ceil((current.resetTime - now) / 1000) 
      });
    }
    
    current.count++;
    next();
  };
}

// Cache middleware for expensive operations
const cache = new Map<string, { data: any; expiry: number }>();

export function cacheMiddleware(ttlSeconds: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      // Track cache hit
      analyticsService.trackCacheMetric(cacheKey, true, 0).catch(console.error);
      return res.json(cached.data);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      if (res.statusCode === 200) {
        cache.set(cacheKey, {
          data,
          expiry: Date.now() + (ttlSeconds * 1000)
        });
      }
      
      // Track cache miss
      analyticsService.trackCacheMetric(cacheKey, false, Date.now()).catch(console.error);
      
      return originalJson.call(this, data);
    };
    
    next();
  };
}