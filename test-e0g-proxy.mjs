import axios from 'axios';

async function testViaLocalProxy() {
  console.log('🔍 Testing E0G via local proxy...\n');
  
  try {
    // Test through your local API that calls E0G
    const response = await axios.get('http://localhost:5000/api/e0g/test');
    console.log('Response:', response.data);
    
    if (response.data.connected) {
      console.log('✅ E0G is reachable via proxy!');
      
      // Now test analysis
      const analysis = await axios.post('http://localhost:5000/api/e0g/analyze', {
        walletAddress: '0x0000742d35Cc6634C0532925a3b844Bc9e7595f0',
        propertyId: 1,
        amount: 10000
      });
      
      console.log('Analysis result:', analysis.data);
    } else {
      console.log('❌ E0G not reachable:', response.data.error);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Wait for server to be ready
setTimeout(testViaLocalProxy, 2000);
