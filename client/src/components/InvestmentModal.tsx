import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Users, Calculator, DollarSign, Bitcoin, MapPin, Building, CreditCard, ChevronDown, Plus, Crown, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";
import { QuickWalletAnalysis } from "./QuickWalletAnalysis";

interface WalletAnalysisResult {
  security: {
    success: boolean;
    address: string;
    riskScore: number;
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    patterns: string[];
  };
  history: {
    walletAddress: string;
    transactionCount: number;
    totalVolume: number;
    complianceScore: number;
    status: string;
  };
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export default function InvestmentModal({ isOpen, onClose, property }: InvestmentModalProps) {
  const [shares, setShares] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'USD' | 'BTC'>('USD');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [showGoldUpgrade, setShowGoldUpgrade] = useState(false);
  const [walletAnalysisResult, setWalletAnalysisResult] = useState<WalletAnalysisResult | null>(null);
  const [showWalletAnalysis, setShowWalletAnalysis] = useState(false);
  const [walletVerificationStatus, setWalletVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'blocked'>('idle');
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Check if user is Gold member
  const isGoldMember = (user as any)?.membershipType === "gold";

  const { data: bitcoinPrice } = useQuery<{ price: number }>({
    queryKey: ["/api/bitcoin-price"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch user's saved payment methods
  const { data: paymentMethods = [] } = useQuery<any[]>({
    queryKey: ["/api/payments/methods"],
    enabled: paymentMethod === 'USD', // Only fetch when USD is selected
  });

  // Auto-select default payment method
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      const defaultMethod = paymentMethods.find(method => method.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id.toString());
      } else {
        // If no default, select the first one
        setSelectedPaymentMethodId(paymentMethods[0].id.toString());
      }
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  // Calculate ownership details with 49% minimum rule
  const sharePriceValue = property ? parseFloat(property.sharePrice) : 0;
  const ownershipPercentage = property ? (shares / property.maxShares) * 100 : 0;
  const propertyValue = property ? parseFloat(property.propertyValue) : 0;
  const propertyValueShare = (propertyValue * ownershipPercentage) / 100;
  const totalInvestment = shares * sharePriceValue;
  
  // Corrected token pricing and 49% ownership calculations
  const squareFootage = property?.squareFootage || 1000;
  
  // Corrected Formula: Property Value ÷ Square Footage = Token Price
  const tokenPrice = property ? propertyValue / squareFootage : 0;
  
  // Token Supply = Total Listing Price × 1 × 0.49
  const tokenSupply49Percent = property ? Math.floor(propertyValue * 0.49) : 0;
  
  // Max tokens available for 49% ownership
  const maxTokensFor49Percent = property ? Math.floor(tokenSupply49Percent / tokenPrice) : 0;
  
  // Calculate ownership percentage (scaled to 49% max)
  const adjustedOwnershipPercentage = property ? (shares / maxTokensFor49Percent) * 49 : 0;
  
  // Minimum investment: 10% of available 49% ownership
  const minTokensRequired = Math.ceil(maxTokensFor49Percent * 0.1);
  const meetsMinimumOwnership = shares >= minTokensRequired;

  const investMutation = useMutation({
    mutationFn: async (data: { propertyId: number; shares: number }) => {
      return apiRequest('/api/investments', 'POST', data);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Investment Successful",
        description: `You've successfully invested in ${shares} shares of this property.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/investments'] });
      setShares(1);
      setInvestmentAmount("");
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message || "There was an error processing your investment.",
        variant: "destructive",
      });
    },
  });

  if (!property) return null;

  const sharePrice = Number(property.sharePrice);
  const totalCost = sharePrice * shares;
  const maxAvailableShares = property.maxShares - property.currentShares;
  const progressPercentage = (property.currentShares / property.maxShares) * 100;

  const handleSliderChange = (value: number[]) => {
    setShares(value[0]);
    setInvestmentAmount((sharePrice * value[0]).toString());
  };

  const handleAmountChange = (value: string) => {
    setInvestmentAmount(value);
    const amount = parseFloat(value) || 0;
    const calculatedShares = Math.floor(amount / sharePrice);
    setShares(Math.min(calculatedShares, maxAvailableShares));
  };

  // Enhanced wallet verification for crypto payments
  const performWalletVerification = async (walletAddress: string) => {
    setWalletVerificationStatus('verifying');
    
    try {
      // Run both security and transaction history analysis
      const [securityResponse, historyResponse] = await Promise.all([
        fetch('/api/e0g/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        }),
        fetch('/api/bridge/analyze-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: walletAddress }),
        }),
      ]);

      const securityData = await securityResponse.json();
      const historyData = await historyResponse.json();

      const combinedResult: WalletAnalysisResult = {
        security: securityData,
        history: historyData,
      };

      setWalletAnalysisResult(combinedResult);

      // Determine if wallet should be blocked based on combined analysis
      const isHighRisk = securityData.threatLevel === 'HIGH';
      const hasLowCompliance = historyData.complianceScore < 60;
      
      if (isHighRisk || hasLowCompliance) {
        setWalletVerificationStatus('blocked');
        toast({
          title: 'Wallet Verification Failed',
          description: 'High-risk wallet detected. Investment blocked for security.',
          variant: 'destructive',
        });
        return false;
      } else {
        setWalletVerificationStatus('verified');
        toast({
          title: 'Wallet Verified',
          description: 'Wallet security check passed. You can proceed with investment.',
        });
        return true;
      }
    } catch (error) {
      setWalletVerificationStatus('idle');
      toast({
        title: 'Verification Error',
        description: 'Unable to verify wallet. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleInvest = async () => {
    if (shares <= 0 || shares > maxAvailableShares) {
      toast({
        title: "Invalid Investment",
        description: "Please select a valid number of shares.",
        variant: "destructive",
      });
      return;
    }

    // For Bitcoin payments, require wallet verification
    if (paymentMethod === 'BTC' && walletVerificationStatus !== 'verified') {
      if (!walletConnected) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet for Bitcoin payments.",
          variant: "destructive",
        });
        return;
      }

      // Mock wallet address for demo (in real implementation, get from connected wallet)
      const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";
      const verificationPassed = await performWalletVerification(walletAddress);
      
      if (!verificationPassed) {
        return; // Block investment if verification fails
      }
    }

    investMutation.mutate({
      propertyId: property.id,
      shares,
    });
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Invest in Property
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{property.address}</h3>
                  <p className="text-neutral-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {property.city}, {property.state} {property.zipcode}
                  </p>
                  <p className="text-neutral-500 text-sm flex items-center gap-1 mt-1">
                    <Users size={12} />
                    Property Owner: ID #{property.ownerId}
                  </p>
                </div>
                <Badge variant="secondary">
                  <Building size={12} className="mr-1" />
                  {property.propertyType}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    ${Number(property.propertyValue).toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-600">Property Value</div>
                </div>
                <div>
                  <BitcoinPriceDisplay 
                    usdPrice={sharePrice} 
                    showBoth={true}
                    className="text-center"
                  />
                  <div className="text-xs text-neutral-600 mt-1">Per Share</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {maxAvailableShares.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-600">Available Shares</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-neutral-600 mb-1">
                  <span>Funding Progress</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="shares">Number of Shares</Label>
              <div className="mt-2">
                <Slider
                  value={[shares]}
                  onValueChange={handleSliderChange}
                  max={maxAvailableShares}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>1 share</span>
                  <span>{maxAvailableShares.toLocaleString()} shares</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <Label>Payment Method</Label>
              <div className="flex bg-gray-100 rounded-lg p-1 mt-2">
                <button
                  onClick={() => setPaymentMethod('USD')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 flex-1 justify-center ${
                    paymentMethod === 'USD'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  USD (Credit Card)
                </button>
                <button
                  onClick={() => {
                    if (!isGoldMember) {
                      setShowGoldUpgrade(true);
                      return;
                    }
                    setPaymentMethod('BTC');
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 flex-1 justify-center relative ${
                    paymentMethod === 'BTC'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : isGoldMember
                      ? 'text-gray-500 hover:text-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                  } ${!isGoldMember ? 'opacity-50' : ''}`}
                  disabled={!isGoldMember}
                >
                  <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4" />
                  Bitcoin (BTC)
                  {!isGoldMember && (
                    <Crown className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </button>
              </div>
              {!isGoldMember && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  Bitcoin payment requires Gold membership
                </p>
              )}
            </div>

            {/* Payment Method Dropdown for USD */}
            {paymentMethod === 'USD' && (
              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                {paymentMethods.length > 0 ? (
                  <Select 
                    value={selectedPaymentMethodId} 
                    onValueChange={(value) => {
                      if (value === 'add_new') {
                        // Open settings page in new tab to add payment method
                        window.open('/settings', '_blank');
                        return;
                      }
                      setSelectedPaymentMethodId(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>**** **** **** {method.last4}</span>
                            <span className="text-xs text-gray-500">
                              {method.brand?.toUpperCase()} • {method.expiryMonth}/{method.expiryYear}
                            </span>
                            {method.isDefault && (
                              <Badge variant="secondary" className="ml-2">Default</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="add_new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <span>Add New Payment Method</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">No payment methods saved</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to settings to add payment method
                        window.open('/settings', '_blank');
                      }}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Cryptocurrency Wallet Connection */}
            {paymentMethod === 'BTC' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-900">Cryptocurrency Wallet Required</h4>
                    <p className="text-sm text-orange-700">Connect your crypto wallet to invest with Bitcoin</p>
                  </div>
                </div>
                
                {!walletConnected ? (
                  <Button
                    onClick={() => {
                      // Simulate wallet connection
                      setWalletConnected(true);
                      setShowWalletAnalysis(true);
                      toast({
                        title: "Wallet Connected",
                        description: "Please verify your wallet security before proceeding.",
                      });
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Connect Crypto Wallet
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Wallet Connected</span>
                    </div>
                    
                    {/* Enhanced Wallet Security Verification */}
                    {showWalletAnalysis && (
                      <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100">
                              Wallet Security Verification
                            </h5>
                            {walletVerificationStatus === 'verified' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                ✓ Verified
                              </Badge>
                            )}
                            {walletVerificationStatus === 'blocked' && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                ⚠ Blocked
                              </Badge>
                            )}
                          </div>

                          {walletVerificationStatus === 'idle' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => performWalletVerification("0x1234567890abcdef1234567890abcdef12345678")}
                              className="w-full"
                            >
                              Run Security Analysis
                            </Button>
                          )}

                          {walletVerificationStatus === 'verifying' && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={true}
                              className="w-full"
                            >
                              Analyzing Security...
                            </Button>
                          )}

                          {walletAnalysisResult && (
                            <div className="space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-medium text-xs text-gray-600 dark:text-gray-400">E0G Security</div>
                                  <Badge className={`mt-1 ${
                                    walletAnalysisResult.security.threatLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                                    walletAnalysisResult.security.threatLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {walletAnalysisResult.security.threatLevel}
                                  </Badge>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                                  <div className="font-medium text-xs text-gray-600 dark:text-gray-400">Compliance</div>
                                  <div className={`mt-1 font-bold ${
                                    walletAnalysisResult.history.complianceScore >= 80 ? 'text-green-600' :
                                    walletAnalysisResult.history.complianceScore >= 60 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {walletAnalysisResult.history.complianceScore}%
                                  </div>
                                </div>
                              </div>
                              
                              {walletVerificationStatus === 'blocked' && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-red-800 dark:text-red-200 text-xs">
                                  Investment blocked: High-risk wallet or low compliance score detected.
                                  <br />Please use a different wallet or contact support.
                                </div>
                              )}

                              {walletVerificationStatus === 'verified' && (
                                <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded text-green-800 dark:text-green-200 text-xs">
                                  Wallet verification complete. You can proceed with your investment.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shares-input">Shares</Label>
                <Input
                  id="shares-input"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(Math.min(parseInt(e.target.value) || 0, maxAvailableShares))}
                  min={1}
                  max={maxAvailableShares}
                />
              </div>
              <div>
                <Label htmlFor="amount-input">
                  Investment Amount ({paymentMethod === 'USD' ? '$' : '₿'})
                </Label>
                <Input
                  id="amount-input"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={paymentMethod === 'USD' ? "Enter USD amount" : "Enter BTC amount"}
                  step={paymentMethod === 'BTC' ? "0.00000001" : "1"}
                />
                <p className="text-neutral-400 text-sm mt-1">
                  Minimum Amount: ${parseFloat(property?.sharePrice || "0").toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calculator size={16} />
                Investment Summary
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Shares to Purchase:</span>
                  <span className="font-medium">{shares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Share:</span>
                  <span className="font-medium">${sharePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Investment:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg">${totalCost.toLocaleString()}</div>
                    {bitcoinPrice?.price && (
                      <div className="text-sm text-neutral-600 flex items-center gap-1">
                        <Bitcoin size={12} />
                        ₿{(totalCost / bitcoinPrice.price).toFixed(8)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Your Ownership:</span>
                  <span>{((shares / property.maxShares) * 100).toFixed(3)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Warning for High Risk Wallets */}
          {paymentMethod === 'BTC' && walletAnalysisResult?.security.threatLevel === 'HIGH' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">High Risk Wallet Detected</span>
              </div>
              <p className="text-sm text-red-600">
                Your wallet address has been flagged as high risk (Score: {walletAnalysisResult.security.riskScore}/100). 
                For security reasons, we cannot process investments from this wallet. Please use a different wallet or contact support.
              </p>
            </div>
          )}

          {/* Medium Risk Warning */}
          {paymentMethod === 'BTC' && walletAnalysisResult?.security.threatLevel === 'MEDIUM' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">Moderate Risk Detected</span>
              </div>
              <p className="text-sm text-yellow-600">
                Your wallet shows moderate risk (Score: {walletAnalysisResult.security.riskScore}/100). 
                Please ensure all transactions are legitimate before proceeding.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleInvest}
              disabled={
                investMutation.isPending || 
                shares <= 0 || 
                shares > maxAvailableShares ||
                (paymentMethod === 'BTC' && !walletConnected) ||
                (paymentMethod === 'BTC' && walletVerificationStatus === 'blocked') ||
                (paymentMethod === 'BTC' && walletConnected && walletVerificationStatus === 'idle')
              }
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              {investMutation.isPending ? (
                "Processing..."
              ) : paymentMethod === 'BTC' && !walletConnected ? (
                "Connect Wallet to Invest"
              ) : paymentMethod === 'BTC' && walletVerificationStatus === 'blocked' ? (
                "Wallet Blocked - Cannot Proceed"
              ) : paymentMethod === 'BTC' && walletConnected && walletVerificationStatus === 'idle' ? (
                "Verify Wallet Security First"
              ) : (
                <>
                  {paymentMethod === 'USD' ? (
                    <DollarSign size={16} className="mr-2" />
                  ) : (
                    <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4 mr-2" />
                  )}
                  Invest {paymentMethod === 'USD' ? `$${totalCost.toLocaleString()}` : `₿${(totalCost / (bitcoinPrice?.price || 107000)).toFixed(6)}`}
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Cancel
            </Button>
          </div>

          {/* Risk Disclaimer */}
          <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg">
            <strong>Investment Disclaimer:</strong> Real estate investments carry risks including loss of principal. 
            Past performance does not guarantee future results. Please invest responsibly and only invest what you can afford to lose.
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Gold Upgrade Modal */}
    <Dialog open={showGoldUpgrade} onOpenChange={setShowGoldUpgrade}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Gold
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bitcoin Payment Requires Gold Membership
            </h3>
            <p className="text-gray-600 text-sm">
              Unlock Bitcoin payment options and exclusive features with Gold membership
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Gold Membership Benefits
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Bitcoin payment options
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Advanced market heat maps
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Exclusive investment insights
              </li>
            </ul>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">$99.99/year</div>
            <div className="text-sm text-gray-500">Billed annually</div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowGoldUpgrade(false);
                setLocation('/settings?tab=membership');
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            <Button
              onClick={() => setShowGoldUpgrade(false)}
              variant="outline"
              className="px-6"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}