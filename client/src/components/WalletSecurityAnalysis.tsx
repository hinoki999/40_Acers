import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletAnalysisResult {
  success: boolean;
  address: string;
  riskScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  patterns: string[];
  demoMode: boolean;
  timestamp: string;
}

interface E0GHealthStatus {
  connected: boolean;
  e0gStatus: string;
  threatPatterns: string;
  addressesMonitored: string;
}

export function WalletSecurityAnalysis() {
  const [walletAddress, setWalletAddress] = useState('');
  const [analysisResult, setAnalysisResult] = useState<WalletAnalysisResult | null>(null);
  const { toast } = useToast();

  // Check E0G API health status
  const { data: healthStatus, isLoading: healthLoading } = useQuery<E0GHealthStatus>({
    queryKey: ['/api/e0g/health'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Wallet analysis mutation
  const analyzeWallet = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch('/api/e0g/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      return response.json();
    },
    onSuccess: (data: WalletAnalysisResult) => {
      setAnalysisResult(data);
      toast({
        title: 'Analysis Complete',
        description: `Wallet risk level: ${data.threatLevel}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAnalyze = () => {
    if (!walletAddress.trim()) {
      toast({
        title: 'Wallet Address Required',
        description: 'Please enter a wallet address to analyze',
        variant: 'destructive',
      });
      return;
    }
    analyzeWallet.mutate(walletAddress.trim());
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <CheckCircle className="h-4 w-4" />;
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Wallet Security Analysis
          </CardTitle>
          <CardDescription>
            Analyze wallet addresses for security risks using E0G Trust API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className={`h-2 w-2 rounded-full ${healthStatus?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              E0G API Status: {healthLoading ? 'Checking...' : healthStatus?.e0gStatus || 'Unknown'}
            </span>
          </div>

          {healthStatus && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Threat Patterns:</span>
                <p className="text-gray-600 dark:text-gray-400">{healthStatus.threatPatterns}</p>
              </div>
              <div>
                <span className="font-medium">Addresses Monitored:</span>
                <p className="text-gray-600 dark:text-gray-400">{healthStatus.addressesMonitored}</p>
              </div>
            </div>
          )}

          {/* Wallet Address Input */}
          <div className="space-y-2">
            <label htmlFor="wallet-address" className="text-sm font-medium">
              Wallet Address
            </label>
            <div className="flex gap-2">
              <Input
                id="wallet-address"
                placeholder="Enter wallet address (e.g., 0x1234...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Button
                onClick={handleAnalyze}
                disabled={analyzeWallet.isPending || !healthStatus?.connected}
              >
                {analyzeWallet.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Results</CardTitle>
                <CardDescription>
                  Analysis completed at {new Date(analysisResult.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analysisResult.riskScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getThreatLevelColor(analysisResult.threatLevel)}>
                      {getThreatIcon(analysisResult.threatLevel)}
                      <span className="ml-1">{analysisResult.threatLevel}</span>
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Threat Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                      {analysisResult.address.slice(0, 6)}...{analysisResult.address.slice(-6)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                  </div>
                </div>

                {analysisResult.patterns.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Analysis Patterns</h4>
                    <ul className="space-y-1">
                      {analysisResult.patterns.map((pattern, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.demoMode && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This analysis is running in demo mode with simulated data.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Security Recommendations */}
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Security Recommendations
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    {analysisResult.threatLevel === 'HIGH' && (
                      <>
                        <li>• High risk detected - proceed with extreme caution</li>
                        <li>• Consider additional verification steps</li>
                        <li>• Review transaction history carefully</li>
                      </>
                    )}
                    {analysisResult.threatLevel === 'MEDIUM' && (
                      <>
                        <li>• Moderate risk detected - additional monitoring recommended</li>
                        <li>• Verify wallet ownership through multiple channels</li>
                      </>
                    )}
                    {analysisResult.threatLevel === 'LOW' && (
                      <>
                        <li>• Low risk detected - wallet appears safe</li>
                        <li>• Standard verification procedures apply</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}