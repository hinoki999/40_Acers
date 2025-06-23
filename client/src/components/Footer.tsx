export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750355342962.png" 
              alt="40 Acres Logo" 
              className="h-26 w-auto object-contain mb-4"
            />
            <p className="text-gray-300 mb-4">
              Build wealth through fractional real estate investing. Own shares in rental properties and earn passive income without the hassle of management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/business" className="text-gray-300 hover:text-white transition-colors">Business</a></li>
              <li><a href="/community" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="/tokenomics" className="text-gray-300 hover:text-white transition-colors">Tokenomics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Legal Disclaimer</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 40 Acres App Inc.</p>
        </div>
      </div>
    </footer>
  );
}