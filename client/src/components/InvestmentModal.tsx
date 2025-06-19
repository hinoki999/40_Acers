import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Property } from "@shared/schema";
import { TrendingUp, DollarSign, Wallet, Calculator, Star } from "lucide-react";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export default function InvestmentModal({ isOpen, onClose, property }: InvestmentModalProps) {
  const [shares, setShares] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInvest = () => {
    if (property && shares > 0) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Investment Successful!",
      description: "Your investment has been processed successfully.",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
    queryClient.invalidateQueries({ queryKey: ["/api/payments/history"] });
    onClose();
    setShares(1);
    setShowPayment(false);
  };

  if (!property) return null;

  const maxAvailableShares = property.maxShares - property.currentShares;
  const sharePrice = Number(property.sharePrice);
  const totalInvestment = shares * sharePrice;
  const progressPercentage = (property.currentShares / property.maxShares) * 100;
  const totalPropertyValue = sharePrice * property.maxShares;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-neutral-900">
                Invest in Property
              </DialogTitle>
              <p className="text-neutral-600">Choose your investment amount</p>
            </div>
          </div>
        </DialogHeader>

        {/* Property Overview */}
        <div className="bg-gradient-to-r from-neutral-50 to-blue-50 rounded-lg p-6 mb-6 border border-neutral-100">
          <div className="flex gap-4">
            <img
              src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
              alt={property.address}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">
                {property.address}
              </h3>
              <p className="text-neutral-600 text-sm mb-2">
                {property.city}, {property.state} {property.zipcode}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="text-accent" size={14} />
                  {property.propertyType}
                </span>
                <span className="text-neutral-600">
                  {Math.round(progressPercentage)}% Funded
                </span>
              </div>
            </div>
            <div className="text-right">
              <BitcoinPriceDisplay 
                usdPrice={sharePrice} 
                showBoth={true}
                className="text-primary"
              />
              <div className="text-xs text-neutral-600">per token</div>
            </div>
          </div>
        </div>

        {/* Investment Calculator */}
        <div className="space-y-6">
          <div>
            <Label className="flex items-center gap-2 mb-4">
              <Calculator size={16} />
              Number of Tokens
            </Label>
            
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={[shares]}
                  onValueChange={(value) => setShares(value[0])}
                  max={Math.min(maxAvailableShares, 1000)}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <Input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Math.min(maxAvailableShares, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={maxAvailableShares}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShares(Math.min(10, maxAvailableShares))}
                    disabled={maxAvailableShares < 10}
                  >
                    10
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShares(Math.min(100, maxAvailableShares))}
                    disabled={maxAvailableShares < 100}
                  >
                    100
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShares(maxAvailableShares)}
                  >
                    Max
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 mt-2">
              Available tokens: {maxAvailableShares.toLocaleString()}
            </p>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Wallet size={16} />
              Investment Summary
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tokens:</span>
                  <span className="font-medium">{shares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Price per Token:</span>
                  <BitcoinPriceDisplay 
                    usdPrice={sharePrice} 
                    showBoth={true}
                    className="font-medium text-sm"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                  <span>Total Investment:</span>
                  <BitcoinPriceDisplay 
                    usdPrice={totalInvestment} 
                    showBoth={true}
                    className="font-bold text-lg"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Property Value:</span>
                  <BitcoinPriceDisplay 
                    usdPrice={totalPropertyValue} 
                    showBoth={true}
                    className="font-medium text-sm"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Your Ownership:</span>
                  <span className="font-medium">{((shares / property.maxShares) * 100).toFixed(2)}%</span>
                </div>
                {property.squareFootage && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Your Sq Footage:</span>
                    <span className="font-medium">{Math.round((shares * 10)).toLocaleString()} sq ft</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-secondary border-t pt-2">
                  <span>Potential Returns:</span>
                  <span>~${(totalInvestment * 0.08).toFixed(0)}/year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              disabled={shares <= 0 || shares > maxAvailableShares}
              className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90"
            >
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                Proceed to Payment
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <StripePaymentModal
      isOpen={showPayment}
      onClose={() => setShowPayment(false)}
      property={property}
      investmentAmount={totalInvestment}
      shares={shares}
      onSuccess={handlePaymentSuccess}
    />
  </>
  );
}