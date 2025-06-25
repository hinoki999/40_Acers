export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-2 flex flex-col">
            <img 
              src="/attached_assets/white_40_1750724342243.png" 
              alt="40 Acres Logo" 
              className="h-12 w-auto object-contain mb-4 self-start"
            />
            <p className="text-gray-300 mb-4">
              Build wealth through fractional real estate investing. Own shares in rental properties and earn passive income without the hassle of management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/business" className="text-gray-300 hover:text-white transition-colors">Schedule Consultation</a></li>
              <li><a href="/community" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="/learn" className="text-gray-300 hover:text-white transition-colors">Learn</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Legal Disclaimer</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 max-w-7xl mx-auto">
          <p>© 2025 40 Acres App Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}