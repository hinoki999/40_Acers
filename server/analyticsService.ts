import { db } from "./db";
import { 
  userSessions, propertyAnalytics, apiMetrics, cacheMetrics, 
  users, properties, investments, transactions 
} from "@shared/schema";
import type { 
  InsertUserSession, InsertPropertyAnalytics, InsertApiMetric, 
  InsertCacheMetric, UserSession, PropertyAnalytics 
} from "@shared/schema";
import { eq, desc, sum, count, avg, gte, lte, and, sql } from "drizzle-orm";

interface AnalyticsEvent {
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  page: string;
  referrer?: string;
}

interface PerformanceMetrics {
  endpoint: string;
  responseTime: number;
  statusCode: number;
  userId?: string;
  errorMessage?: string;
}

export class AnalyticsService {
  // Session Tracking
  async trackSession(sessionData: {
    userId?: string;
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    landingPage: string;
    deviceType?: string;
    browser?: string;
    country?: string;
    city?: string;
  }): Promise<void> {
    try {
      await db.insert(userSessions).values({
        userId: sessionData.userId,
        sessionId: sessionData.sessionId,
        ipAddress: sessionData.ipAddress,
        userAgent: sessionData.userAgent,
        referrer: sessionData.referrer,
        landingPage: sessionData.landingPage,
        deviceType: sessionData.deviceType || this.detectDeviceType(sessionData.userAgent),
        browser: sessionData.browser || this.detectBrowser(sessionData.userAgent),
        country: sessionData.country,
        city: sessionData.city,
        pageViews: 1,
        bounced: false
      });
    } catch (error) {
      console.error('Failed to track session:', error);
    }
  }

  async updateSession(sessionId: string, updates: {
    exitPage?: string;
    duration?: number;
    pageViews?: number;
    bounced?: boolean;
    converted?: boolean;
    conversionType?: string;
  }): Promise<void> {
    try {
      await db.update(userSessions)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(userSessions.sessionId, sessionId));
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }

  // Property Analytics
  async trackPropertyView(propertyId: number, sessionId: string, timeOnPage?: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if analytics record exists for today
      const existing = await db.select()
        .from(propertyAnalytics)
        .where(and(
          eq(propertyAnalytics.propertyId, propertyId),
          eq(propertyAnalytics.date, today)
        ));

      if (existing.length > 0) {
        // Update existing record
        await db.update(propertyAnalytics)
          .set({
            views: sql`${propertyAnalytics.views} + 1`,
            uniqueViews: sql`${propertyAnalytics.uniqueViews} + 1`,
            averageTimeOnPage: timeOnPage ? 
              sql`((${propertyAnalytics.averageTimeOnPage} * (${propertyAnalytics.views} - 1)) + ${timeOnPage}) / ${propertyAnalytics.views}` : 
              propertyAnalytics.averageTimeOnPage
          })
          .where(and(
            eq(propertyAnalytics.propertyId, propertyId),
            eq(propertyAnalytics.date, today)
          ));
      } else {
        // Create new record
        await db.insert(propertyAnalytics).values({
          propertyId,
          date: today,
          views: 1,
          uniqueViews: 1,
          averageTimeOnPage: timeOnPage || 0
        });
      }
    } catch (error) {
      console.error('Failed to track property view:', error);
    }
  }

  async trackPropertyInvestment(propertyId: number, amount: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await db.update(propertyAnalytics)
        .set({
          investments: sql`${propertyAnalytics.investments} + 1`,
          totalInvestmentAmount: sql`${propertyAnalytics.totalInvestmentAmount} + ${amount}`,
          conversionRate: sql`(${propertyAnalytics.investments} + 1) * 100.0 / ${propertyAnalytics.views}`
        })
        .where(and(
          eq(propertyAnalytics.propertyId, propertyId),
          eq(propertyAnalytics.date, today)
        ));
    } catch (error) {
      console.error('Failed to track property investment:', error);
    }
  }

  // Performance Monitoring
  async trackApiMetric(metricData: PerformanceMetrics): Promise<void> {
    try {
      await db.insert(apiMetrics).values({
        endpoint: metricData.endpoint,
        method: 'GET', // Default, should be passed from middleware
        responseTime: metricData.responseTime,
        statusCode: metricData.statusCode,
        userId: metricData.userId,
        errorMessage: metricData.errorMessage
      });
    } catch (error) {
      console.error('Failed to track API metric:', error);
    }
  }

  async trackCacheMetric(cacheKey: string, hit: boolean, responseTime: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const existing = await db.select()
        .from(cacheMetrics)
        .where(and(
          eq(cacheMetrics.cacheKey, cacheKey),
          eq(cacheMetrics.date, today)
        ));

      if (existing.length > 0) {
        const current = existing[0];
        const newTotalRequests = current.totalRequests + 1;
        const newHits = hit ? (current.hitRate * current.totalRequests + 1) : (current.hitRate * current.totalRequests);
        const newHitRate = newHits / newTotalRequests;
        const newMissRate = 1 - newHitRate;

        await db.update(cacheMetrics)
          .set({
            hitRate: newHitRate.toString(),
            missRate: newMissRate.toString(),
            avgResponseTime: Math.round(((current.avgResponseTime * current.totalRequests) + responseTime) / newTotalRequests),
            totalRequests: newTotalRequests
          })
          .where(and(
            eq(cacheMetrics.cacheKey, cacheKey),
            eq(cacheMetrics.date, today)
          ));
      } else {
        await db.insert(cacheMetrics).values({
          cacheKey,
          hitRate: hit ? "1.00" : "0.00",
          missRate: hit ? "0.00" : "1.00",
          avgResponseTime: responseTime,
          totalRequests: 1,
          date: today
        });
      }
    } catch (error) {
      console.error('Failed to track cache metric:', error);
    }
  }

  // Analytics Reports
  async getUserEngagementReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const sessions = await db.select({
        totalSessions: count(),
        uniqueUsers: count(userSessions.userId),
        avgDuration: avg(userSessions.duration),
        totalPageViews: sum(userSessions.pageViews),
        bounceRate: sql<number>`AVG(CASE WHEN ${userSessions.bounced} THEN 1.0 ELSE 0.0 END) * 100`,
        conversionRate: sql<number>`AVG(CASE WHEN ${userSessions.converted} THEN 1.0 ELSE 0.0 END) * 100`
      })
      .from(userSessions)
      .where(and(
        gte(userSessions.createdAt, startDate),
        lte(userSessions.createdAt, endDate)
      ));

      const topReferrers = await db.select({
        referrer: userSessions.referrer,
        count: count()
      })
      .from(userSessions)
      .where(and(
        gte(userSessions.createdAt, startDate),
        lte(userSessions.createdAt, endDate)
      ))
      .groupBy(userSessions.referrer)
      .orderBy(desc(count()))
      .limit(10);

      const deviceBreakdown = await db.select({
        deviceType: userSessions.deviceType,
        count: count(),
        percentage: sql<number>`COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ${userSessions} WHERE ${userSessions.createdAt} >= ${startDate} AND ${userSessions.createdAt} <= ${endDate})`
      })
      .from(userSessions)
      .where(and(
        gte(userSessions.createdAt, startDate),
        lte(userSessions.createdAt, endDate)
      ))
      .groupBy(userSessions.deviceType);

      return {
        overview: sessions[0],
        topReferrers,
        deviceBreakdown
      };
    } catch (error) {
      console.error('Failed to generate user engagement report:', error);
      return null;
    }
  }

  async getPropertyPerformanceReport(propertyId?: number): Promise<any> {
    try {
      const baseQuery = db.select({
        propertyId: propertyAnalytics.propertyId,
        totalViews: sum(propertyAnalytics.views),
        totalUniqueViews: sum(propertyAnalytics.uniqueViews),
        totalInvestments: sum(propertyAnalytics.investments),
        totalInvestmentAmount: sum(propertyAnalytics.totalInvestmentAmount),
        avgConversionRate: avg(propertyAnalytics.conversionRate),
        avgTimeOnPage: avg(propertyAnalytics.averageTimeOnPage)
      })
      .from(propertyAnalytics);

      const results = propertyId ? 
        await baseQuery.where(eq(propertyAnalytics.propertyId, propertyId)).groupBy(propertyAnalytics.propertyId) :
        await baseQuery.groupBy(propertyAnalytics.propertyId).orderBy(desc(sum(propertyAnalytics.views)));

      return results;
    } catch (error) {
      console.error('Failed to generate property performance report:', error);
      return null;
    }
  }

  async getAPIPerformanceReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const endpointMetrics = await db.select({
        endpoint: apiMetrics.endpoint,
        totalRequests: count(),
        avgResponseTime: avg(apiMetrics.responseTime),
        errorRate: sql<number>`AVG(CASE WHEN ${apiMetrics.statusCode} >= 400 THEN 1.0 ELSE 0.0 END) * 100`,
        p95ResponseTime: sql<number>`PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ${apiMetrics.responseTime})`
      })
      .from(apiMetrics)
      .where(and(
        gte(apiMetrics.timestamp, startDate),
        lte(apiMetrics.timestamp, endDate)
      ))
      .groupBy(apiMetrics.endpoint)
      .orderBy(desc(count()));

      const slowestEndpoints = await db.select({
        endpoint: apiMetrics.endpoint,
        avgResponseTime: avg(apiMetrics.responseTime)
      })
      .from(apiMetrics)
      .where(and(
        gte(apiMetrics.timestamp, startDate),
        lte(apiMetrics.timestamp, endDate)
      ))
      .groupBy(apiMetrics.endpoint)
      .orderBy(desc(avg(apiMetrics.responseTime)))
      .limit(10);

      return {
        endpointMetrics,
        slowestEndpoints
      };
    } catch (error) {
      console.error('Failed to generate API performance report:', error);
      return null;
    }
  }

  async getRevenueAnalytics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const revenueData = await db.select({
        date: sql<string>`DATE(${transactions.createdAt})`,
        totalRevenue: sum(transactions.amount),
        transactionCount: count(),
        avgTransactionValue: avg(transactions.amount)
      })
      .from(transactions)
      .where(and(
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate),
        eq(transactions.type, 'investment')
      ))
      .groupBy(sql`DATE(${transactions.createdAt})`)
      .orderBy(sql`DATE(${transactions.createdAt})`);

      const topInvestors = await db.select({
        userId: transactions.userId,
        totalInvested: sum(transactions.amount),
        investmentCount: count()
      })
      .from(transactions)
      .where(and(
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate),
        eq(transactions.type, 'investment')
      ))
      .groupBy(transactions.userId)
      .orderBy(desc(sum(transactions.amount)))
      .limit(10);

      return {
        dailyRevenue: revenueData,
        topInvestors
      };
    } catch (error) {
      console.error('Failed to generate revenue analytics:', error);
      return null;
    }
  }

  // Real-time Analytics
  async getRealTimeMetrics(): Promise<any> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const activeUsers = await db.select({ count: count() })
        .from(userSessions)
        .where(gte(userSessions.updatedAt, oneHourAgo));

      const recentInvestments = await db.select({ 
        count: count(),
        totalAmount: sum(transactions.amount)
      })
        .from(transactions)
        .where(and(
          gte(transactions.createdAt, oneHourAgo),
          eq(transactions.type, 'investment')
        ));

      const topPages = await db.select({
        page: userSessions.landingPage,
        views: count()
      })
        .from(userSessions)
        .where(gte(userSessions.createdAt, oneHourAgo))
        .groupBy(userSessions.landingPage)
        .orderBy(desc(count()))
        .limit(5);

      return {
        activeUsers: activeUsers[0]?.count || 0,
        recentInvestments: recentInvestments[0] || { count: 0, totalAmount: 0 },
        topPages
      };
    } catch (error) {
      console.error('Failed to get real-time metrics:', error);
      return null;
    }
  }

  // Utility methods
  private detectDeviceType(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
      return /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }

  private detectBrowser(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'other';
  }
}

export const analyticsService = new AnalyticsService();