import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Users, Calculator, DollarSign, Bitcoin, MapPin, Building, CreditCard, ChevronDown, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleInvest = () => {
    if (shares <= 0 || shares > maxAvailableShares) {
      toast({
        title: "Invalid Investment",
        description: "Please select a valid number of shares.",
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({
      propertyId: property.id,
      shares,
    });
  };

  return (
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
                  onClick={() => setPaymentMethod('BTC')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 flex-1 justify-center ${
                    paymentMethod === 'BTC'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4" />
                  Bitcoin (BTC)
                </button>
              </div>
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
                      toast({
                        title: "Wallet Connected",
                        description: "Your cryptocurrency wallet has been connected successfully.",
                      });
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Connect Crypto Wallet
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Wallet Connected</span>
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleInvest}
              disabled={
                investMutation.isPending || 
                shares <= 0 || 
                shares > maxAvailableShares ||
                (paymentMethod === 'BTC' && !walletConnected)
              }
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              {investMutation.isPending ? (
                "Processing..."
              ) : paymentMethod === 'BTC' && !walletConnected ? (
                "Connect Wallet to Invest"
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
  );
}