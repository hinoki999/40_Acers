import axios from 'axios';

console.log('🚀 Testing E0G Trust API Integration\n');

async function testE0G() {
  const E0G_API = 'http://134.122.21.37:3001';
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing connection...');
    const health = await axios.get(`${E0G_API}/health`);
    console.log('✅ Connected:', health.data);
    console.log('');
    
    // Test 2: Analyze regular wallet
    console.log('2️⃣ Analyzing regular wallet...');
    const regular = await axios.post(
      `${E0G_API}/api/v1/trust/analyze`,
      { walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0fA7b' },
      { headers: { 'X-API-Key': '40ACRES_KEY' }}
    );
    console.log('Result:', regular.data.result);
    console.log('');
    
    // Test 3: Analyze whale wallet
    console.log('3️⃣ Analyzing whale wallet...');
    const whale = await axios.post(
      `${E0G_API}/api/v1/trust/analyze`,
      { walletAddress: '0x0000742d35Cc6634C0532925a3b844Bc9e7595f0' },
      { headers: { 'X-API-Key': '40ACRES_KEY' }}
    );
    console.log('Result:', whale.data.result);
    console.log('');
    
    console.log('🎉 SUCCESS! E0G Trust API is fully operational!');
    console.log('📊 Integration ready for 40 Acres platform');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testE0G();
