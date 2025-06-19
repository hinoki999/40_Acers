import { db } from "./db";
import { userDevices, securityLogs } from "@shared/schema";
import type { InsertUserDevice, InsertSecurityLog, UserDevice } from "@shared/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import crypto from "crypto";

interface SecurityEvent {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  riskLevel?: "low" | "medium" | "high";
  metadata?: Record<string, any>;
}

interface DeviceInfo {
  userId: string;
  deviceId: string;
  deviceName?: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
}

export class SecurityService {
  // Device Management
  async registerDevice(deviceInfo: DeviceInfo): Promise<UserDevice> {
    try {
      const [device] = await db.insert(userDevices).values({
        userId: deviceInfo.userId,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: deviceInfo.ipAddress,
        isVerified: false,
        isTrusted: false
      }).returning();

      await this.logSecurityEvent({
        userId: deviceInfo.userId,
        action: "device_registered",
        ipAddress: deviceInfo.ipAddress,
        userAgent: `${deviceInfo.browser} on ${deviceInfo.os}`,
        riskLevel: "low",
        metadata: { deviceId: deviceInfo.deviceId }
      });

      return device;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  async verifyDevice(deviceId: string, userId: string): Promise<void> {
    try {
      await db.update(userDevices)
        .set({ 
          isVerified: true,
          lastUsed: new Date()
        })
        .where(and(
          eq(userDevices.deviceId, deviceId),
          eq(userDevices.userId, userId)
        ));

      await this.logSecurityEvent({
        userId,
        action: "device_verified",
        riskLevel: "low",
        metadata: { deviceId }
      });
    } catch (error) {
      console.error('Failed to verify device:', error);
      throw error;
    }
  }

  async trustDevice(deviceId: string, userId: string): Promise<void> {
    try {
      await db.update(userDevices)
        .set({ 
          isTrusted: true,
          lastUsed: new Date()
        })
        .where(and(
          eq(userDevices.deviceId, deviceId),
          eq(userDevices.userId, userId)
        ));

      await this.logSecurityEvent({
        userId,
        action: "device_trusted",
        riskLevel: "low",
        metadata: { deviceId }
      });
    } catch (error) {
      console.error('Failed to trust device:', error);
      throw error;
    }
  }

  async getUserDevices(userId: string): Promise<UserDevice[]> {
    try {
      return await db.select()
        .from(userDevices)
        .where(eq(userDevices.userId, userId))
        .orderBy(desc(userDevices.lastUsed));
    } catch (error) {
      console.error('Failed to get user devices:', error);
      return [];
    }
  }

  async updateDeviceActivity(deviceId: string): Promise<void> {
    try {
      await db.update(userDevices)
        .set({ lastUsed: new Date() })
        .where(eq(userDevices.deviceId, deviceId));
    } catch (error) {
      console.error('Failed to update device activity:', error);
    }
  }

  // Security Logging
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await db.insert(securityLogs).values({
        userId: event.userId,
        action: event.action,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        riskLevel: event.riskLevel || "low",
        blocked: false,
        metadata: event.metadata
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Risk Assessment
  async assessLoginRisk(userId: string, ipAddress: string, userAgent: string, deviceId?: string): Promise<{
    riskLevel: "low" | "medium" | "high";
    shouldBlock: boolean;
    reasons: string[];
    requiresMFA: boolean;
  }> {
    try {
      const reasons: string[] = [];
      let riskScore = 0;

      // Check if device is known and trusted
      if (deviceId) {
        const [device] = await db.select()
          .from(userDevices)
          .where(and(
            eq(userDevices.deviceId, deviceId),
            eq(userDevices.userId, userId)
          ));

        if (!device) {
          riskScore += 30;
          reasons.push("Unknown device");
        } else if (!device.isTrusted) {
          riskScore += 15;
          reasons.push("Untrusted device");
        }
      } else {
        riskScore += 40;
        reasons.push("No device fingerprint");
      }

      // Check recent failed login attempts
      const recentFailures = await db.select()
        .from(securityLogs)
        .where(and(
          eq(securityLogs.userId, userId),
          eq(securityLogs.action, "login_failed"),
          gte(securityLogs.createdAt, new Date(Date.now() - 60 * 60 * 1000)) // Last hour
        ));

      if (recentFailures.length >= 3) {
        riskScore += 50;
        reasons.push("Multiple recent failed login attempts");
      }

      // Check for unusual IP address
      const recentLogins = await db.select()
        .from(securityLogs)
        .where(and(
          eq(securityLogs.userId, userId),
          eq(securityLogs.action, "login_success"),
          gte(securityLogs.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last week
        ))
        .limit(10);

      const knownIPs = recentLogins.map(log => log.ipAddress).filter(Boolean);
      if (knownIPs.length > 0 && !knownIPs.includes(ipAddress)) {
        riskScore += 25;
        reasons.push("Unknown IP address");
      }

      // Check for suspicious patterns
      const todayLogins = await db.select()
        .from(securityLogs)
        .where(and(
          eq(securityLogs.userId, userId),
          eq(securityLogs.action, "login_success"),
          gte(securityLogs.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
        ));

      if (todayLogins.length > 10) {
        riskScore += 20;
        reasons.push("Unusual login frequency");
      }

      // Determine risk level and actions
      let riskLevel: "low" | "medium" | "high";
      let shouldBlock = false;
      let requiresMFA = false;

      if (riskScore >= 70) {
        riskLevel = "high";
        shouldBlock = true;
        requiresMFA = true;
      } else if (riskScore >= 40) {
        riskLevel = "medium";
        requiresMFA = true;
      } else {
        riskLevel = "low";
      }

      await this.logSecurityEvent({
        userId,
        action: "risk_assessment",
        ipAddress,
        userAgent,
        riskLevel,
        metadata: {
          riskScore,
          reasons,
          shouldBlock,
          requiresMFA
        }
      });

      return {
        riskLevel,
        shouldBlock,
        reasons,
        requiresMFA
      };
    } catch (error) {
      console.error('Failed to assess login risk:', error);
      return {
        riskLevel: "medium",
        shouldBlock: false,
        reasons: ["Risk assessment failed"],
        requiresMFA: true
      };
    }
  }

  // Fraud Detection
  async detectFraudulentActivity(userId: string, activityType: string, metadata: any): Promise<{
    isFraudulent: boolean;
    confidence: number;
    reasons: string[];
  }> {
    try {
      const reasons: string[] = [];
      let fraudScore = 0;

      // Check for rapid successive transactions
      if (activityType === "investment") {
        const recentInvestments = await db.select()
          .from(securityLogs)
          .where(and(
            eq(securityLogs.userId, userId),
            eq(securityLogs.action, "investment_created"),
            gte(securityLogs.createdAt, new Date(Date.now() - 5 * 60 * 1000)) // Last 5 minutes
          ));

        if (recentInvestments.length >= 3) {
          fraudScore += 40;
          reasons.push("Rapid successive investments");
        }

        // Check for unusually large investment amounts
        if (metadata.amount > 50000) {
          fraudScore += 30;
          reasons.push("Unusually large investment amount");
        }
      }

      // Check for account takeover indicators
      const recentDeviceChanges = await db.select()
        .from(securityLogs)
        .where(and(
          eq(securityLogs.userId, userId),
          eq(securityLogs.action, "device_registered"),
          gte(securityLogs.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
        ));

      if (recentDeviceChanges.length >= 2) {
        fraudScore += 35;
        reasons.push("Multiple new devices registered recently");
      }

      const isFraudulent = fraudScore >= 50;
      const confidence = Math.min(fraudScore / 100, 1);

      if (isFraudulent) {
        await this.logSecurityEvent({
          userId,
          action: "fraudulent_activity_detected",
          riskLevel: "high",
          metadata: {
            activityType,
            fraudScore,
            confidence,
            reasons,
            originalMetadata: metadata
          }
        });
      }

      return {
        isFraudulent,
        confidence,
        reasons
      };
    } catch (error) {
      console.error('Failed to detect fraudulent activity:', error);
      return {
        isFraudulent: false,
        confidence: 0,
        reasons: ["Fraud detection failed"]
      };
    }
  }

  // Security Reports
  async getSecurityReport(userId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const securityEvents = await db.select()
        .from(securityLogs)
        .where(and(
          eq(securityLogs.userId, userId),
          gte(securityLogs.createdAt, startDate)
        ))
        .orderBy(desc(securityLogs.createdAt));

      const devices = await this.getUserDevices(userId);

      const riskEvents = securityEvents.filter(event => 
        event.riskLevel === "medium" || event.riskLevel === "high"
      );

      const blockedAttempts = securityEvents.filter(event => event.blocked);

      return {
        totalEvents: securityEvents.length,
        riskEvents: riskEvents.length,
        blockedAttempts: blockedAttempts.length,
        activeDevices: devices.filter(d => d.lastUsed > startDate).length,
        trustedDevices: devices.filter(d => d.isTrusted).length,
        recentEvents: securityEvents.slice(0, 10),
        devices
      };
    } catch (error) {
      console.error('Failed to generate security report:', error);
      return null;
    }
  }

  // Utility functions
  generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    const data = `${userAgent}|${ipAddress}|${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  parseUserAgent(userAgent: string): { browser: string; os: string; deviceType: string } {
    const browser = this.getBrowser(userAgent);
    const os = this.getOS(userAgent);
    const deviceType = this.getDeviceType(userAgent);

    return { browser, os, deviceType };
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
      return 'mobile';
    }
    if (/iPad|Tablet/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }
}

export const securityService = new SecurityService();