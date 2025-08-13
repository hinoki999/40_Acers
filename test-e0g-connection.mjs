import axios from 'axios';

async function testE0G() {
  console.log('🔍 Testing E0G API Connection...\n');
  
  const E0G_URL = 'http://134.122.21.37:3001';
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${E0G_URL}/health`, { timeout: 5000 });
    console.log('✅ Health check passed:', health.data);
    console.log('');
    
    // Test 2: Regular wallet
    console.log('2️⃣ Testing regular wallet analysis...');
    const regular = await axios.post(
      `${E0G_URL}/api/v1/trust/analyze`,
      { walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0fA7b' },
      {
        headers: { 'X-API-Key': '40ACRES_KEY', 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    console.log('✅ Regular wallet:', {
      trustScore: regular.data.result.trustScore,
      classification: regular.data.result.classification,
      approved: regular.data.result.approved
    });
    console.log('');
    
    // Test 3: Whale wallet
    console.log('3️⃣ Testing whale wallet detection...');
    const whale = await axios.post(
      `${E0G_URL}/api/v1/trust/analyze`,
      { walletAddress: '0x0000742d35Cc6634C0532925a3b844Bc9e7595f0' },
      {
        headers: { 'X-API-Key': '40ACRES_KEY', 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    console.log('✅ Whale wallet:', {
      trustScore: whale.data.result.trustScore,
      classification: whale.data.result.classification,
      approved: whale.data.result.approved
    });
    
    console.log('\n🎉 ALL TESTS PASSED! E0G Integration is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Connection refused. Check E0G server.');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n🔧 Connection timeout. Network issue.');
    }
  }
}

testE0G();
