import axios from 'axios';

// E0G Trust API Configuration
const E0G_API_URL = 'http://134.122.21.37:3001';
const E0G_API_KEY = '40ACRES_KEY';

export class E0GTrustService {
  private apiUrl: string;
  private apiKey: string;
  
  constructor() {
    this.apiUrl = E0G_API_URL;
    this.apiKey = E0G_API_KEY;
    console.log(`🔐 E0G Trust API configured at: ${this.apiUrl}`);
  }
  
  async analyzeInvestor(walletAddress: string, propertyId: number, amount: number) {
    try {
      console.log(`📊 Analyzing wallet: ${walletAddress}`);
      
      const response = await axios.post(
        `${this.apiUrl}/api/v1/trust/analyze`,
        {
          walletAddress,
          context: { propertyId, amount }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          timeout: 5000
        }
      );
      
      console.log(`✅ E0G Analysis complete: Trust Score ${response.data.result.trustScore}`);
      return response.data.result;
      
    } catch (error: any) {
      console.error('E0G Trust API error:', error.message);
      
      return {
        approved: true,
        trustScore: 5,
        confidence: 3.5,
        riskLevel: 'MEDIUM',
        recommendation: 'E0G service unavailable - proceeding with standard checks',
        classification: 'UNVERIFIED'
      };
    }
  }
  
  async batchAnalyze(walletAddresses: string[]) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v1/trust/batch`,
        { walletAddresses },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          timeout: 10000
        }
      );
      
      return response.data.results;
      
    } catch (error: any) {
      console.error('E0G batch analysis error:', error.message);
      
      return walletAddresses.map(address => ({
        address,
        trustScore: 5,
        approved: true,
        classification: 'UNVERIFIED'
      }));
    }
  }
  
  async getPropertyMetrics(propertyId: number) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/metrics/property/${propertyId}`,
        {
          headers: {
            'X-API-Key': this.apiKey
          },
          timeout: 5000
        }
      );
      
      return response.data.metrics;
      
    } catch (error: any) {
      console.error('E0G metrics error:', error.message);
      return null;
    }
  }
  
  async testConnection() {
    try {
      const response = await axios.get(`${this.apiUrl}/health`);
      console.log('✅ E0G Trust API is operational:', response.data);
      return true;
    } catch (error) {
      console.error('❌ E0G Trust API is not reachable');
      return false;
    }
  }
}

export const e0gTrust = new E0GTrustService();
