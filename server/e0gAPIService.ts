import axios from 'axios';

interface TrustAnalysisRequest {
  walletAddress: string;
  propertyId?: number;
  investmentAmount?: number;
  requestingPlatform: string;
  apiKey: string;
}

interface TrustAnalysisResponse {
  approved: boolean;
  trustScore: number;  // 0-10 score, no proprietary details
  confidence: number;  // Simple confidence level
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  // NO PATTERNS, NO PROPRIETARY DATA
}

export class E0GAPIService {
  private apiUrl = process.env.E0G_API_URL || 'https://api.bridge-analytics.net';
  private apiKey = process.env.E0G_API_KEY || '';
  private platformId = '40ACRES';

  // Request trust analysis from E0G (E0G keeps all proprietary data)
  async requestTrustAnalysis(walletAddress: string, context?: any): Promise<TrustAnalysisResponse> {
    try {
      // E0G analyzes internally and returns ONLY the decision
      const response = await axios.post(`${this.apiUrl}/api/trust/analyze`, {
        walletAddress,
        platform: this.platformId,
        context: {
          propertyId: context?.propertyId,
          investmentAmount: context?.investmentAmount,
          timestamp: new Date().toISOString()
        }
      }, {
        headers: {
          'X-API-Key': this.apiKey,
          'X-Platform-ID': this.platformId
        }
      });

      // E0G returns only what 40 Acres needs to know
      return {
        approved: response.data.approved,
        trustScore: response.data.trustScore,
        confidence: response.data.confidence,
        riskLevel: response.data.riskLevel,
        recommendation: response.data.recommendation
      };
    } catch (error) {
      console.error('E0G API request failed:', error);
      
      // Fallback - approve with medium confidence
      return {
        approved: true,
        trustScore: 5,
        confidence: 3.5,
        riskLevel: 'MEDIUM',
        recommendation: 'Unable to verify - proceeding with caution'
      };
    }
  }

  // Get aggregated metrics only (no raw data)
  async getPropertyMetrics(propertyId: number): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/metrics/property/${propertyId}`, {
        headers: {
          'X-API-Key': this.apiKey,
          'X-Platform-ID': this.platformId
        }
      });

      // Return only aggregated, non-proprietary metrics
      return {
        overallHealth: response.data.health,
        investorQuality: response.data.quality,
        riskIndicator: response.data.risk
      };
    } catch (error) {
      console.error('Failed to get property metrics:', error);
      return null;
    }
  }

  // Subscribe to alerts (E0G pushes alerts, doesn't share how it detected them)
  async subscribeToAlerts(webhookUrl: string): Promise<boolean> {
    try {
      await axios.post(`${this.apiUrl}/api/webhooks/subscribe`, {
        platform: this.platformId,
        webhookUrl,
        alertTypes: ['HIGH_RISK', 'WHALE_ACTIVITY', 'SUSPICIOUS_PATTERN']
      }, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to subscribe to alerts:', error);
      return false;
    }
  }
}

export const e0gAPI = new E0GAPIService();
