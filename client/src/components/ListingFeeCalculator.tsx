import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, Info } from "lucide-react";

interface FeeCalculation {
  propertyValue: number;
  feePercentage: number;
  calculatedFee: number;
  currency: string;
}

interface ListingFeeCalculatorProps {
  onFeeCalculated?: (fee: FeeCalculation) => void;
  initialValue?: number;
  showPayButton?: boolean;
  onPayNow?: () => void;
}

export default function ListingFeeCalculator({ 
  onFeeCalculated, 
  initialValue = 0,
  showPayButton = false,
  onPayNow 
}: ListingFeeCalculatorProps) {
  const [propertyValue, setPropertyValue] = useState(initialValue.toString());
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (initialValue > 0) {
      calculateFee(initialValue);
    }
  }, [initialValue]);

  const calculateFee = async (value: number) => {
    if (value <= 0) {
      setFeeCalculation(null);
      return;
    }

    setIsCalculating(true);
    try {
      const response = await fetch(`/api/listing-fee-calculator?propertyValue=${value}`);
      if (!response.ok) {
        throw new Error('Failed to calculate fee');
      }
      
      const data: FeeCalculation = await response.json();
      setFeeCalculation(data);
      
      if (onFeeCalculated) {
        onFeeCalculated(data);
      }
    } catch (error) {
      console.error('Fee calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleValueChange = (value: string) => {
    setPropertyValue(value);
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue)) {
      calculateFee(numValue);
    } else {
      setFeeCalculation(null);
    }
  };

  const formatValue = (value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue)) {
      return numValue.toLocaleString();
    }
    return value;
  };

  const getFeeColor = () => {
    if (!feeCalculation) return "bg-neutral-600";
    if (feeCalculation.feePercentage >= 2.5) return "bg-red-600";
    if (feeCalculation.feePercentage >= 2.0) return "bg-orange-600";
    if (feeCalculation.feePercentage >= 1.5) return "bg-yellow-600";
    return "bg-green-600";
  };

  const getFeeDescription = () => {
    if (!feeCalculation) return "";
    if (feeCalculation.feePercentage >= 2.5) return "Entry tier - Properties under $100K";
    if (feeCalculation.feePercentage >= 2.0) return "Standard tier - Properties $100K-$500K";
    if (feeCalculation.feePercentage >= 1.5) return "Premium tier - Properties $500K-$1M";
    return "Elite tier - Properties over $1M";
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-blue-600" size={20} />
          Listing Fee Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Property Value</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <Input
              type="text"
              placeholder="Enter property value..."
              value={propertyValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {feeCalculation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-blue-600 mb-1">Fee Rate</div>
                  <div className="text-lg font-bold text-blue-700">
                    {feeCalculation.feePercentage}%
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-green-600 mb-1">Listing Fee</div>
                  <div className="text-lg font-bold text-green-700">
                    ${feeCalculation.calculatedFee.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getFeeColor()}>
                  {feeCalculation.feePercentage}% Fee Tier
                </Badge>
                <Info size={16} className="text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-600">
                {getFeeDescription()}
              </p>
            </div>

            <div className="space-y-2 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Property Value:</span>
                <span className="font-medium">${feeCalculation.propertyValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Rate:</span>
                <span className="font-medium">{feeCalculation.feePercentage}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total Listing Fee:</span>
                <span className="font-bold text-green-600">
                  ${feeCalculation.calculatedFee.toLocaleString()}
                </span>
              </div>
            </div>

            {showPayButton && onPayNow && (
              <Button 
                onClick={onPayNow} 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <TrendingUp className="mr-2" size={16} />
                Pay Listing Fee Now
              </Button>
            )}
          </div>
        )}

        {isCalculating && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-neutral-600 mt-2">Calculating fee...</p>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h4 className="font-semibold text-yellow-800 text-sm mb-2">Fee Structure:</h4>
          <div className="space-y-1 text-xs text-yellow-700">
            <div className="flex justify-between">
              <span>Under $100K:</span>
              <span>2.5%</span>
            </div>
            <div className="flex justify-between">
              <span>$100K - $500K:</span>
              <span>2.0%</span>
            </div>
            <div className="flex justify-between">
              <span>$500K - $1M:</span>
              <span>1.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Over $1M:</span>
              <span>1.0%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}