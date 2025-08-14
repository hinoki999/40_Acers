import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface QuickWalletAnalysisProps {
  onAnalysisComplete?: (result: WalletAnalysisResult) => void;
  compact?: boolean;
}

export function QuickWalletAnalysis({ onAnalysisComplete, compact = false }: QuickWalletAnalysisProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [analysisResult, setAnalysisResult] = useState<WalletAnalysisResult | null>(null);
  const { toast } = useToast();

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
      onAnalysisComplete?.(data);
      toast({
        title: 'Wallet Verified',
        description: `Risk level: ${data.threatLevel}`,
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
      case 'LOW': return <CheckCircle className="h-3 w-3" />;
      case 'MEDIUM': return <AlertTriangle className="h-3 w-3" />;
      case 'HIGH': return <AlertTriangle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  if (compact && analysisResult) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Wallet Security Status</span>
          <Badge className={getThreatLevelColor(analysisResult.threatLevel)}>
            {getThreatIcon(analysisResult.threatLevel)}
            <span className="ml-1 text-xs">{analysisResult.threatLevel}</span>
          </Badge>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Risk Score: {analysisResult.riskScore}/100
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Wallet Security Verification</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="text-sm"
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzeWallet.isPending}
            size="sm"
          >
            {analyzeWallet.isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Checking...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </div>

      {analysisResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Badge className={getThreatLevelColor(analysisResult.threatLevel)}>
                {getThreatIcon(analysisResult.threatLevel)}
                <span className="ml-1">{analysisResult.threatLevel} RISK</span>
              </Badge>
              <span className="text-sm">Score: {analysisResult.riskScore}/100</span>
            </div>
          </div>

          {analysisResult.threatLevel === 'HIGH' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High risk wallet detected. Please proceed with caution and consider additional verification.
              </AlertDescription>
            </Alert>
          )}

          {analysisResult.threatLevel === 'LOW' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Wallet verification successful. Low risk detected.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}