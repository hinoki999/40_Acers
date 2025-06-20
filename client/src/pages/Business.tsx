export default function Business() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Business Information</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Company Overview</h2>
            <p className="text-gray-700 mb-4">
              40 Acres is a revolutionary real estate investment platform that democratizes property ownership 
              through blockchain technology and fractional investing.
            </p>
            <p className="text-gray-700">
              Our mission is to make real estate investing accessible to everyone, regardless of their 
              financial background or investment experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Fractional real estate investing</li>
              <li>Property tokenization and management</li>
              <li>Investment portfolio diversification</li>
              <li>Professional property management services</li>
              <li>Market analysis and investment insights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Choose 40 Acres?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Low Minimum Investment</h3>
                <p className="text-gray-600">Start investing with as little as $100</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Diversified Portfolio</h3>
                <p className="text-gray-600">Invest across multiple properties and markets</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Transparent Fees</h3>
                <p className="text-gray-600">No hidden costs or surprise charges</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Professional Management</h3>
                <p className="text-gray-600">Expert team handling all property operations</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}