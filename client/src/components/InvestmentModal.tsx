import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Users, Calculator, DollarSign, Bitcoin, MapPin, Building } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate ownership details with 49% minimum rule
  const sharePriceValue = property ? parseFloat(property.sharePrice) : 0;
  const ownershipPercentage = property ? (shares / property.maxShares) * 100 : 0;
  const propertyValue = property ? parseFloat(property.propertyValue) : 0;
  const propertyValueShare = (propertyValue * ownershipPercentage) / 100;
  const totalInvestment = shares * sharePriceValue;
  
  // 49% ownership requirements
  const minSharesFor49Percent = property ? Math.ceil(property.maxShares * 0.49) : 0;
  const minInvestmentFor49Percent = minSharesFor49Percent * sharePriceValue;
  const meetsMinimumOwnership = ownershipPercentage >= 49;

  const { data: bitcoinPrice } = useQuery<{ price: number | null }>({
    queryKey: ['/api/bitcoin-price'],
  });

  const investMutation = useMutation({
    mutationFn: async (data: { propertyId: number; shares: number }) => {
      return apiRequest('/api/invest', 'POST', data);
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
                <Label htmlFor="amount-input">Investment Amount ($)</Label>
                <Input
                  id="amount-input"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Enter amount"
                />
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
              disabled={investMutation.isPending || shares <= 0 || shares > maxAvailableShares}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              {investMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  <TrendingUp size={16} className="mr-2" />
                  Invest ${totalCost.toLocaleString()}
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