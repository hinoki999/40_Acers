import type { Express } from "express";
import { hubspotService } from "./hubspotService";
import { analyticsService } from "./analyticsService";
import { securityService } from "./securityService";
import { enhancedPaymentService } from "./enhancedPaymentService";
import { storage } from "./storage";

export function registerEnhancedRoutes(app: Express): void {
  
  // HubSpot Integration Routes
  app.post("/api/hubspot/contact", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contact = await hubspotService.createContact(req.user);
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create HubSpot contact", error: error.message });
    }
  });

  app.post("/api/hubspot/deal", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { dealName, amount, dealType, propertyId, stage, closeDate } = req.body;
      
      const deal = await hubspotService.createDeal({
        userId: (req.user as any).id,
        propertyId,
        dealName,
        amount,
        dealType,
        stage,
        closeDate: closeDate ? new Date(closeDate) : undefined
      });

      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create HubSpot deal", error: error.message });
    }
  });

  app.post("/api/hubspot/webhook", async (req, res) => {
    try {
      await hubspotService.handleWebhook(req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to process webhook", error: error.message });
    }
  });

  app.patch("/api/hubspot/contact/sync", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const investmentData = await storage.getUserPortfolioValue(userId);
      
      await hubspotService.syncInvestmentData(userId, {
        totalAmount: investmentData,
        count: (await storage.getUserInvestments(userId)).length,
        lastDate: new Date().toISOString()
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to sync contact data", error: error.message });
    }
  });

  // Enhanced Analytics Routes
  app.post("/api/analytics/session", async (req, res) => {
    try {
      const { sessionId, ipAddress, userAgent, referrer, landingPage } = req.body;
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;

      await analyticsService.trackSession({
        userId,
        sessionId,
        ipAddress,
        userAgent,
        referrer,
        landingPage
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to track session", error: error.message });
    }
  });

  app.patch("/api/analytics/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;

      await analyticsService.updateSession(sessionId, updates);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update session", error: error.message });
    }
  });

  app.post("/api/analytics/property/:propertyId/view", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const { sessionId, timeOnPage } = req.body;

      await analyticsService.trackPropertyView(propertyId, sessionId, timeOnPage);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to track property view", error: error.message });
    }
  });

  app.get("/api/analytics/reports/engagement", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const report = await analyticsService.getUserEngagementReport(start, end);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate engagement report", error: error.message });
    }
  });

  app.get("/api/analytics/reports/property-performance", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
      const report = await analyticsService.getPropertyPerformanceReport(propertyId);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate property performance report", error: error.message });
    }
  });

  app.get("/api/analytics/reports/api-performance", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const report = await analyticsService.getAPIPerformanceReport(start, end);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate API performance report", error: error.message });
    }
  });

  app.get("/api/analytics/real-time", async (req, res) => {
    try {
      const metrics = await analyticsService.getRealTimeMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get real-time metrics", error: error.message });
    }
  });

  // Enhanced Security Routes
  app.post("/api/security/device/register", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { deviceId, deviceName, userAgent } = req.body;
      const userId = (req.user as any).id;
      const ipAddress = req.ip;
      
      const deviceInfo = securityService.parseUserAgent(userAgent);
      
      const device = await securityService.registerDevice({
        userId,
        deviceId,
        deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress
      });

      res.json(device);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to register device", error: error.message });
    }
  });

  app.post("/api/security/device/:deviceId/verify", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { deviceId } = req.params;
      const userId = (req.user as any).id;

      await securityService.verifyDevice(deviceId, userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to verify device", error: error.message });
    }
  });

  app.post("/api/security/device/:deviceId/trust", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { deviceId } = req.params;
      const userId = (req.user as any).id;

      await securityService.trustDevice(deviceId, userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to trust device", error: error.message });
    }
  });

  app.get("/api/security/devices", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const devices = await securityService.getUserDevices(userId);
      res.json(devices);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get user devices", error: error.message });
    }
  });

  app.post("/api/security/assess-risk", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { deviceId } = req.body;
      const userId = (req.user as any).id;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent') || '';

      const assessment = await securityService.assessLoginRisk(userId, ipAddress, userAgent, deviceId);
      res.json(assessment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to assess risk", error: error.message });
    }
  });

  app.get("/api/security/report", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const days = parseInt(req.query.days as string) || 30;
      
      const report = await securityService.getSecurityReport(userId, days);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate security report", error: error.message });
    }
  });

  // Enhanced Payment Routes
  app.post("/api/payments/methods", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { paymentMethodId } = req.body;
      const userId = (req.user as any).id;

      const paymentMethod = await enhancedPaymentService.addPaymentMethod(userId, paymentMethodId);
      res.json(paymentMethod);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to add payment method", error: error.message });
    }
  });

  app.get("/api/payments/methods", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const methods = await enhancedPaymentService.getUserPaymentMethods(userId);
      res.json(methods);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get payment methods", error: error.message });
    }
  });

  app.patch("/api/payments/methods/:methodId/default", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const methodId = parseInt(req.params.methodId);
      const userId = (req.user as any).id;

      await enhancedPaymentService.setDefaultPaymentMethod(userId, methodId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to set default payment method", error: error.message });
    }
  });

  app.delete("/api/payments/methods/:methodId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const methodId = parseInt(req.params.methodId);
      const userId = (req.user as any).id;

      await enhancedPaymentService.removePaymentMethod(userId, methodId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to remove payment method", error: error.message });
    }
  });

  app.post("/api/payments/setup-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const setupIntent = await enhancedPaymentService.createSavedPaymentSetup(userId);
      res.json(setupIntent);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create setup intent", error: error.message });
    }
  });

  app.post("/api/payments/recurring", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { propertyId, paymentMethodId, amount, frequency } = req.body;
      const userId = (req.user as any).id;

      const recurringInvestment = await enhancedPaymentService.setupRecurringInvestment({
        userId,
        propertyId,
        paymentMethodId,
        amount,
        frequency
      });

      res.json(recurringInvestment);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to setup recurring investment", error: error.message });
    }
  });

  app.patch("/api/payments/recurring/:recurringId/pause", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const recurringId = parseInt(req.params.recurringId);
      const userId = (req.user as any).id;

      await enhancedPaymentService.pauseRecurringInvestment(userId, recurringId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to pause recurring investment", error: error.message });
    }
  });

  app.patch("/api/payments/recurring/:recurringId/resume", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const recurringId = parseInt(req.params.recurringId);
      const userId = (req.user as any).id;

      await enhancedPaymentService.resumeRecurringInvestment(userId, recurringId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to resume recurring investment", error: error.message });
    }
  });

  app.get("/api/payments/analytics", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const analytics = await enhancedPaymentService.getPaymentAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get payment analytics", error: error.message });
    }
  });

  // Performance Monitoring Middleware
  app.use("/api/*", async (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', async () => {
      const responseTime = Date.now() - startTime;
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;
      
      await analyticsService.trackApiMetric({
        endpoint: req.route?.path || req.path,
        responseTime,
        statusCode: res.statusCode,
        userId,
        errorMessage: res.statusCode >= 400 ? res.statusMessage : undefined
      });
    });
    
    next();
  });

  // Data Export Routes
  app.get("/api/export/user-data", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).id;
      const format = req.query.format as string || 'json';

      const userData = {
        user: req.user,
        investments: await storage.getUserInvestments(userId),
        transactions: await storage.getUserTransactions(userId),
        portfolio: await storage.getUserPortfolioValue(userId)
      };

      if (format === 'csv') {
        // Generate CSV format
        const csv = this.generateCSV(userData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=user-data.csv');
        res.send(csv);
      } else {
        res.json(userData);
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to export user data", error: error.message });
    }
  });

  // Admin Dashboard Routes (for platform administrators)
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Add admin role check here
      const isAdmin = (req.user as any).role === 'admin';
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const dashboard = {
        realTimeMetrics: await analyticsService.getRealTimeMetrics(),
        recentActivity: await storage.getAllTransactions(),
        systemHealth: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          timestamp: new Date()
        }
      };

      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get admin dashboard", error: error.message });
    }
  });
}

// Helper function for CSV generation
function generateCSV(data: any): string {
  const headers = ['Type', 'Date', 'Amount', 'Property', 'Status'];
  const rows: string[][] = [];

  // Add investment data
  data.investments?.forEach((investment: any) => {
    rows.push([
      'Investment',
      investment.createdAt,
      investment.investmentAmount,
      investment.property?.address || '',
      'Completed'
    ]);
  });

  // Add transaction data  
  data.transactions?.forEach((transaction: any) => {
    rows.push([
      'Transaction',
      transaction.createdAt,
      transaction.amount,
      transaction.propertyId?.toString() || '',
      transaction.status
    ]);
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}