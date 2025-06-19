import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PieChart, Calculator, DollarSign, TrendingUp } from "lucide-react";

interface Property {
  id: number;
  address: string;
  propertyValue: string;
  sharePrice: string;
  maxShares: number;
  currentShares: number;
}

interface OwnershipCalculatorProps {
  property: Property;
  className?: string;
}

export default function OwnershipCalculator({ property, className = "" }: OwnershipCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("1000");
  const [shareCount, setShareCount] = useState<string>("1");
  
  const sharePrice = parseFloat(property.sharePrice);
  const propertyValue = parseFloat(property.propertyValue);
  const maxShares = property.maxShares;
  const availableShares = maxShares - property.currentShares;
  
  // Calculate based on investment amount
  const calculatedShares = Math.floor(parseFloat(investmentAmount || "0") / sharePrice);
  const actualInvestment = calculatedShares * sharePrice;
  const ownershipPercentage = (calculatedShares / maxShares) * 100;
  const propertyValueShare = (propertyValue * ownershipPercentage) / 100;
  
  // Calculate based on share count
  const shareBasedInvestment = parseInt(shareCount || "1") * sharePrice;
  const shareBasedOwnership = (parseInt(shareCount || "1") / maxShares) * 100;
  const shareBasedPropertyValue = (propertyValue * shareBasedOwnership) / 100;
  
  const handleInvestmentChange = (value: string) => {
    setInvestmentAmount(value);
    const shares = Math.floor(parseFloat(value || "0") / sharePrice);
    setShareCount(Math.min(shares, availableShares).toString());
  };
  
  const handleShareChange = (value: string) => {
    const shares = Math.min(parseInt(value || "1"), availableShares);
    setShareCount(shares.toString());
    setInvestmentAmount((shares * sharePrice).toString());
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
          Ownership Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="investment-amount">Investment Amount ($)</Label>
            <Input
              id="investment-amount"
              type="number"
              min="0"
              step="100"
              value={investmentAmount}
              onChange={(e) => handleInvestmentChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="share-count">Number of Shares</Label>
            <Input
              id="share-count"
              type="number"
              min="1"
              max={availableShares}
              value={shareCount}
              onChange={(e) => handleShareChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Ownership Results */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Your Ownership Details
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {ownershipPercentage.toFixed(3)}%
              </div>
              <div className="text-sm text-blue-700">Ownership</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                ${propertyValueShare.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Property Value Share</div>
            </div>
          </div>

          {/* Ownership Visualization */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-blue-700 mb-1">
              <span>Your Ownership</span>
              <span>{ownershipPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(ownershipPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">
              ${actualInvestment.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Total Investment</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-700">
              ${(actualInvestment * 0.08).toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">Est. Annual Return (8%)</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-lg font-bold text-orange-700">
              {calculatedShares}
            </div>
            <div className="text-xs text-orange-600">Shares Purchased</div>
          </div>
        </div>

        {/* Quick Investment Options */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Investment Options</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1000, 5000, 10000, 25000].map((amount) => {
              const shares = Math.floor(amount / sharePrice);
              const ownership = (shares / maxShares) * 100;
              return (
                <button
                  key={amount}
                  onClick={() => handleInvestmentChange(amount.toString())}
                  className="p-2 text-center bg-white border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  disabled={shares > availableShares}
                >
                  <div className="text-sm font-medium">${(amount / 1000)}k</div>
                  <div className="text-xs text-gray-600">{ownership.toFixed(2)}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium">Available Shares</div>
            <div className="text-xs text-gray-600">
              {availableShares.toLocaleString()} of {maxShares.toLocaleString()} shares
            </div>
          </div>
          <Badge 
            variant={availableShares > 100 ? "default" : availableShares > 10 ? "secondary" : "destructive"}
          >
            {availableShares > 100 ? "High" : availableShares > 10 ? "Limited" : "Low"} Availability
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}