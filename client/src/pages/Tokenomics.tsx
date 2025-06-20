export default function Tokenomics() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tokenomics</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Token Structure</h2>
            <p className="text-gray-700 mb-4">
              40 Acres uses a fractional ownership model where each property is divided into tokens 
              representing ownership shares. This allows investors to own a portion of high-value 
              real estate with smaller capital requirements.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-2">Property Tokens</h3>
              <p className="text-gray-700">
                Each property is tokenized into 10,000 shares, with each token representing 0.01% ownership. 
                Token prices are determined by property value and market demand.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Token Pricing Formula</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-mono text-sm mb-2">Token Price = (Property Value ÷ 10,000) + Market Premium</p>
              <p className="text-gray-600 text-sm">
                Where Market Premium is determined by supply and demand dynamics
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Revenue Distribution</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Rental Income</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 80% to token holders</li>
                  <li>• 15% to property management</li>
                  <li>• 5% to platform operations</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Capital Appreciation</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 90% to token holders</li>
                  <li>• 10% to platform</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Token Utility</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Ownership Rights:</strong> Proportional ownership in the underlying property</li>
              <li><strong>Income Distribution:</strong> Receive rental income based on token holdings</li>
              <li><strong>Voting Rights:</strong> Participate in major property decisions</li>
              <li><strong>Liquidity:</strong> Trade tokens on the secondary marketplace</li>
              <li><strong>Appreciation:</strong> Benefit from property value increases</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Investment Mechanics</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Minimum Investment</h3>
              <p className="text-gray-700">
                Investors can purchase as few as 10 tokens (0.1% ownership) with a minimum 
                investment of $100, making real estate accessible to retail investors.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Token Lifecycle</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Property is acquired and tokenized</li>
                <li>Tokens are offered to investors at fair market value</li>
                <li>Property generates rental income distributed to token holders</li>
                <li>Property appreciation increases token value</li>
                <li>Tokens can be traded on secondary marketplace</li>
                <li>Exit through property sale or token buyback program</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Risk Factors</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Property values may decrease, affecting token prices</li>
                <li>Rental income may fluctuate based on market conditions</li>
                <li>Liquidity may be limited in secondary markets</li>
                <li>Regulatory changes may impact token structure</li>
                <li>Property-specific risks (maintenance, vacancies, etc.)</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}