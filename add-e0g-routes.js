import fs from 'fs';

const content = fs.readFileSync('server/routes.ts', 'utf8');
const lines = content.split('\n');

// Find where to insert (before the last closing brace of setupRoutes)
let insertIndex = -1;
let braceCount = 0;
let inSetupRoutes = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export function setupRoutes')) {
    inSetupRoutes = true;
  }
  
  if (inSetupRoutes) {
    if (lines[i].includes('{')) braceCount++;
    if (lines[i].includes('}')) {
      braceCount--;
      if (braceCount === 0) {
        insertIndex = i;
        break;
      }
    }
  }
}

if (insertIndex > 0) {
  const e0gRoutes = `
  // ===== E0G Trust API Integration =====
  console.log('Setting up E0G routes...');
  
  app.get('/api/e0g/test', async (req, res) => {
    try {
      const response = await axios.get('http://134.122.21.37:3001/health');
      res.json({ 
        connected: true, 
        e0gStatus: response.data 
      });
    } catch (error: any) {
      res.json({ 
        connected: false, 
        error: error.message 
      });
    }
  });

  app.post('/api/e0g/analyze', async (req, res) => {
    try {
      const { walletAddress, propertyId, amount } = req.body;
      
      const response = await axios.post(
        'http://134.122.21.37:3001/api/v1/trust/analyze',
        { 
          walletAddress,
          context: { propertyId, amount }
        },
        { 
          headers: { 
            'X-API-Key': '40ACRES_KEY',
            'Content-Type': 'application/json'
          }
        }
      );
      
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  });
  
  console.log('✅ E0G routes registered');
`;

  lines.splice(insertIndex, 0, e0gRoutes);
  fs.writeFileSync('server/routes.ts', lines.join('\n'));
  console.log('✅ E0G routes added inside setupRoutes function');
} else {
  console.log('❌ Could not find setupRoutes function');
}
