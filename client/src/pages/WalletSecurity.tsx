import { EnhancedWalletAnalysis } from '@/components/EnhancedWalletAnalysis';

export default function WalletSecurity() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Wallet Security Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive wallet analysis combining security assessment and transaction history
            </p>
          </div>
          
          <EnhancedWalletAnalysis />
        </div>
      </div>
    </div>
  );
}