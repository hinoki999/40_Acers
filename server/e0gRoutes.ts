import { Express } from 'express';
import axios from 'axios';

const E0G_API_URL = 'http://134.122.21.37:3001';
const E0G_API_KEY = '40ACRES_KEY';

export function setupE0GRoutes(app: Express) {
  console.log('🔐 Setting up E0G Trust API routes...');
  
  // Health check endpoint
  app.get('/api/e0g/health', async (req, res) => {
    try {
      const response = await axios.get(`${E0G_API_URL}/health`, {
        timeout: 5000
      });
      res.json({ 
        connected: true, 
        e0gStatus: response.data 
      });
    } catch (error: any) {
      res.json({ 
        connected: false, 
        error: error.message,
        details: error.code 
      });
    }
  });
  
  // Analyze wallet endpoint
  app.post('/api/e0g/analyze', async (req, res) => {
    try {
      const { walletAddress, propertyId, amount } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }
      
      console.log(`Analyzing wallet: ${walletAddress}`);
      
      const response = await axios.post(
        `${E0G_API_URL}/api/v1/trust/analyze`,
        { 
          walletAddress,
          context: { propertyId, amount }
        },
        { 
          headers: { 
            'X-API-Key': E0G_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      
      res.json({
        success: true,
        ...response.data.result,
        poweredBy: 'E0G Crypto Intelligence'
      });
    } catch (error: any) {
      console.error('E0G analysis error:', error.message);
      res.status(500).json({ 
        success: false,
        error: error.message,
        code: error.code 
      });
    }
  });
  
  // Batch analysis endpoint
  app.post('/api/e0g/batch', async (req, res) => {
    try {
      const { walletAddresses } = req.body;
      
      const response = await axios.post(
        `${E0G_API_URL}/api/v1/trust/batch`,
        { walletAddresses },
        { 
          headers: { 
            'X-API-Key': E0G_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });
  
  console.log('✅ E0G routes registered at /api/e0g/*');
}
