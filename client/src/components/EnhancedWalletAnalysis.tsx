import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, AlertTriangle, CheckCircle, Info, Activity, TrendingUp, Clock, Database } from 'lucide-react';
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

interface TransactionHistoryResult {
  walletAddress: string;
  transactionCount: number;
  totalVolume: number;
  lastActivity: string;
  riskIndicators: string[];
  complianceScore: number;
  status: string;
  error?: string;
}

interface E0GHealthStatus {
  connected: boolean;
  e0gStatus: string;
  threatPatterns: string;
  addressesMonitored: string;
}

interface BridgeHealthStatus {
  connected: boolean;
  bridgeStatus: string;
  service: string;
  apiVersion?: string;
}

export function EnhancedWalletAnalysis() {
  const [walletAddress, setWalletAddress] = useState('');
  const [securityResult, setSecurityResult] = useState<WalletAnalysisResult | null>(null);
  const [historyResult, setHistoryResult] = useState<TransactionHistoryResult | null>(null);
  const [activeTab, setActiveTab] = useState('security');
  const { toast } = useToast();

  // Health status queries
  const { data: e0gHealth } = useQuery<E0GHealthStatus>({
    queryKey: ['/api/e0g/health'],
    refetchInterval: 30000,
  });

  const { data: bridgeHealth } = useQuery<BridgeHealthStatus>({
    queryKey: ['/api/bridge/health'],
    refetchInterval: 30000,
  });

  // Security analysis mutation
  const securityAnalysis = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch('/api/e0g/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Security analysis failed');
      }
      return response.json();
    },
    onSuccess: (data: WalletAnalysisResult) => {
      setSecurityResult(data);
      toast({
        title: 'Security Analysis Complete',
        description: `Risk level: ${data.threatLevel}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Security Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Transaction history mutation
  const historyAnalysis = useMutation({
    mutationFn: async (address: string) => {
      const response = await fetch('/api/bridge/analyze-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data: TransactionHistoryResult) => {
      setHistoryResult(data);
      if (data.status === 'error') {
        toast({
          title: 'History Analysis Unavailable',
          description: 'Using enhanced analysis instead',
        });
      } else {
        toast({
          title: 'Transaction History Retrieved',
          description: `${data.transactionCount} transactions analyzed`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'History Analysis Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFullAnalysis = () => {
    if (!walletAddress.trim()) {
      toast({
        title: 'Wallet Address Required',
        description: 'Please enter a wallet address to analyze',
        variant: 'destructive',
      });
      return;
    }

    // Run both analyses simultaneously
    securityAnalysis.mutate(walletAddress.trim());
    historyAnalysis.mutate(walletAddress.trim());
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

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enhanced Wallet Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive security and transaction history analysis using E0G Trust and Bridge Analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className={`h-2 w-2 rounded-full ${e0gHealth?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">E0G Security: {e0gHealth?.e0gStatus || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className={`h-2 w-2 rounded-full ${bridgeHealth?.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">Bridge Analytics: {bridgeHealth?.bridgeStatus || 'Unknown'}</span>
            </div>
          </div>

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
                onKeyDown={(e) => e.key === 'Enter' && handleFullAnalysis()}
              />
              <Button
                onClick={handleFullAnalysis}
                disabled={securityAnalysis.isPending || historyAnalysis.isPending}
              >
                {securityAnalysis.isPending || historyAnalysis.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Full Analysis
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          {(securityResult || historyResult) && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="security">Security Analysis</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
                <TabsTrigger value="combined">Combined Report</TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-4">
                {securityResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">E0G Security Analysis</CardTitle>
                      <CardDescription>
                        Completed at {new Date(securityResult.timestamp).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {securityResult.riskScore}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                        </div>
                        <div className="text-center">
                          <Badge className={getThreatLevelColor(securityResult.threatLevel)}>
                            {getThreatIcon(securityResult.threatLevel)}
                            <span className="ml-1">{securityResult.threatLevel}</span>
                          </Badge>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Threat Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                            {securityResult.address.slice(0, 6)}...{securityResult.address.slice(-6)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                        </div>
                      </div>

                      {securityResult.patterns.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Security Patterns</h4>
                          <ul className="space-y-1">
                            {securityResult.patterns.map((pattern, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {pattern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {historyResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Transaction History Analysis
                      </CardTitle>
                      <CardDescription>
                        {historyResult.status === 'error' ? 'Enhanced analysis generated' : 'Bridge Analytics data'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {historyResult.status === 'error' ? (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Bridge Analytics API is currently unavailable. Enhanced analysis provided based on wallet patterns.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {historyResult.transactionCount?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${Number(historyResult.totalVolume)?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
                          </div>
                          <div className="text-center">
                            <Badge className={getComplianceColor(historyResult.complianceScore)}>
                              {historyResult.complianceScore}%
                            </Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compliance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {new Date(historyResult.lastActivity).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Last Activity</div>
                          </div>
                        </div>
                      )}

                      {historyResult.riskIndicators && historyResult.riskIndicators.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Activity Indicators</h4>
                          <div className="flex flex-wrap gap-2">
                            {historyResult.riskIndicators.map((indicator, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="combined" className="space-y-4">
                {securityResult && historyResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Combined Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Security Assessment</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>E0G Risk Score:</span>
                              <span className="font-medium">{securityResult.riskScore}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Threat Level:</span>
                              <Badge className={getThreatLevelColor(securityResult.threatLevel)}>
                                {securityResult.threatLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Transaction Profile</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Compliance Score:</span>
                              <span className="font-medium">{historyResult.complianceScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Activity Level:</span>
                              <span className="font-medium">
                                {(historyResult.transactionCount || 0) > 500 ? 'High' : 
                                 (historyResult.transactionCount || 0) > 100 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Overall Recommendation */}
                      <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Overall Risk Assessment
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {securityResult.threatLevel === 'HIGH' || (historyResult.complianceScore < 60) ? 
                            'High risk detected. Additional verification recommended before proceeding with transactions.' :
                            securityResult.threatLevel === 'MEDIUM' || (historyResult.complianceScore < 80) ?
                            'Moderate risk detected. Standard verification procedures apply.' :
                            'Low risk detected. Wallet appears safe for transactions.'
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}