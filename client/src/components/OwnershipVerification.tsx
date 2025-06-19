import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Wallet, 
  FileText, 
  Download,
  RefreshCw,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OwnershipProof {
  fiatProof: {
    isVerified: boolean;
    method: string;
    amount: number;
    transactionId: string;
    timestamp: string;
  };
  blockchainProof: {
    isVerified: boolean;
    walletAddress: string;
    tokenBalance: number;
    contractAddress: string;
    blockchainNetwork: string;
    lastVerification: string;
  };
  combinedVerificationScore: number;
  proofDocument: string;
}

interface OwnershipVerificationProps {
  propertyId: number;
  propertyAddress: string;
}

export default function OwnershipVerification({ propertyId, propertyAddress }: OwnershipVerificationProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showProofDetails, setShowProofDetails] = useState(false);
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  const verificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/verification/ownership`, {
        method: "POST",
        body: JSON.stringify({ propertyId }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Verification Complete",
        description: "Ownership verification has been generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Unable to verify ownership at this time",
        variant: "destructive",
      });
    }
  });

  const { data: verification, isLoading } = useQuery<OwnershipProof>({
    queryKey: [`/api/verification/ownership/${propertyId}`],
    enabled: !!verificationMutation.data,
    select: () => verificationMutation.data as OwnershipProof,
  });

  const handleGenerateProof = () => {
    verificationMutation.mutate();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const downloadProof = () => {
    if (!verification) return;
    
    const proofData = JSON.parse(atob(verification.proofDocument));
    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ownership-proof-${propertyId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatAddress = (address: string) => {
    if (!showWalletAddress) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  const getVerificationColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Shield size={48} className="mx-auto text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Ownership Verification</h3>
            <p className="text-gray-600">Sign in to verify your property ownership</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            Ownership Verification
          </div>
          {verification && (
            <Badge 
              variant="outline" 
              className={getVerificationColor(verification.combinedVerificationScore)}
            >
              {verification.combinedVerificationScore}% Verified
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600 mb-4">
          <strong>Property:</strong> {propertyAddress}
        </div>

        {!verification ? (
          <div className="text-center py-8">
            <Shield size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Ownership Proof</h3>
            <p className="text-gray-600 mb-6">
              Verify your ownership through both fiat and blockchain records
            </p>
            <Button 
              onClick={handleGenerateProof}
              disabled={verificationMutation.isPending}
              className="flex items-center gap-2"
            >
              {verificationMutation.isPending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generating Proof...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Generate Verification
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Verification Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {verification.combinedVerificationScore}%
              </div>
              <div className="text-gray-600 text-sm mb-3">Verification Score</div>
              <Progress 
                value={verification.combinedVerificationScore} 
                className="h-3"
              />
            </div>

            {/* Fiat Verification */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CreditCard size={16} />
                  Fiat Verification
                </h4>
                {verification.fiatProof.isVerified ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
              </div>
              
              {verification.fiatProof.isVerified ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium capitalize">{verification.fiatProof.method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${verification.fiatProof.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{verification.fiatProof.transactionId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(verification.fiatProof.transactionId, "Transaction ID")}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No fiat transactions found for this property</p>
              )}
            </div>

            {/* Blockchain Verification */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Wallet size={16} />
                  Blockchain Verification
                </h4>
                {verification.blockchainProof.isVerified ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
              </div>
              
              {verification.blockchainProof.isVerified ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <Badge variant="outline" className="capitalize">
                      {verification.blockchainProof.blockchainNetwork}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token Balance:</span>
                    <span className="font-medium">{verification.blockchainProof.tokenBalance.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Wallet Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {formatAddress(verification.blockchainProof.walletAddress)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowWalletAddress(!showWalletAddress)}
                      >
                        {showWalletAddress ? <EyeOff size={12} /> : <Eye size={12} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(verification.blockchainProof.walletAddress, "Wallet address")}
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No blockchain tokens found for this property</p>
              )}
            </div>

            {/* Proof Document */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-600" />
                <span className="text-sm text-gray-600">Verification Document</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadProof}
                className="flex items-center gap-2"
              >
                <Download size={14} />
                Download Proof
              </Button>
            </div>

            {/* Regenerate */}
            <Button
              variant="ghost"
              onClick={handleGenerateProof}
              disabled={verificationMutation.isPending}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw size={16} className={verificationMutation.isPending ? "animate-spin" : ""} />
              Regenerate Verification
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}