export default function Documentation() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Documentation</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              Welcome to 40 Acres! This documentation will help you understand how to use our platform 
              to invest in real estate and manage your portfolio.
            </p>
            
            <h3 className="text-lg font-medium mb-2">Account Setup</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
              <li>Create your account by clicking "Register"</li>
              <li>Verify your email address</li>
              <li>Complete your investor profile</li>
              <li>Add a payment method</li>
              <li>Start investing!</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Invest</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2">Step 1: Browse Properties</h3>
              <p className="text-gray-700">
                Visit the Marketplace to view available investment opportunities. Each property 
                shows detailed information including location, price, and investment potential.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-2">Step 2: Make Your Investment</h3>
              <p className="text-gray-700">
                Choose your investment amount and complete the secure payment process. 
                You'll receive tokens representing your ownership share.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Step 3: Track Your Portfolio</h3>
              <p className="text-gray-700">
                Monitor your investments through your dashboard, track performance, 
                and receive regular updates about your properties.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Fractional Ownership:</strong> Own a portion of high-value properties</li>
              <li><strong>Liquidity:</strong> Trade your tokens on our marketplace</li>
              <li><strong>Transparency:</strong> Real-time updates on property performance</li>
              <li><strong>Professional Management:</strong> Properties managed by experts</li>
              <li><strong>Diversification:</strong> Spread risk across multiple properties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fees and Charges</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Investment Transaction</td>
                    <td className="border border-gray-300 px-4 py-2">1% of investment amount</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Annual Management</td>
                    <td className="border border-gray-300 px-4 py-2">0.5% of portfolio value</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Withdrawal</td>
                    <td className="border border-gray-300 px-4 py-2">$2.50 per transaction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}