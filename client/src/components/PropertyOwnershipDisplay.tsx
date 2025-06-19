import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Calculator, TrendingUp, DollarSign } from "lucide-react";

interface Property {
  id: number;
  address: string;
  propertyValue: string;
  sharePrice: string;
  maxShares: number;
  currentShares: number;
}

interface PropertyOwnershipDisplayProps {
  property: Property;
  investmentAmount?: number;
  shareCount?: number;
  compact?: boolean;
}

export default function PropertyOwnershipDisplay({ 
  property, 
  investmentAmount = 1000, 
  shareCount,
  compact = false 
}: PropertyOwnershipDisplayProps) {
  const [selectedAmount, setSelectedAmount] = useState(investmentAmount);
  
  const sharePrice = parseFloat(property.sharePrice);
  const propertyValue = parseFloat(property.propertyValue);
  const maxShares = property.maxShares;
  const availableShares = maxShares - property.currentShares;
  
  // Calculate shares based on investment amount or use provided share count
  const calculatedShares = shareCount || Math.floor(selectedAmount / sharePrice);
  const actualInvestment = calculatedShares * sharePrice;
  const ownershipPercentage = (calculatedShares / maxShares) * 100;
  const propertyValueShare = (propertyValue * ownershipPercentage) / 100;
  const estimatedAnnualReturn = actualInvestment * 0.08; // 8% return estimate
  
  const quickAmounts = [1000, 5000, 10000, 25000];

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">Quick Ownership Preview</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Investment:</span>
            <div className="font-semibold text-green-700">${actualInvestment.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Ownership:</span>
            <div className="font-semibold text-blue-900">{ownershipPercentage.toFixed(3)}%</div>
          </div>
          <div>
            <span className="text-gray-600">Property Share:</span>
            <div className="font-semibold text-purple-700">${propertyValueShare.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Annual Return:</span>
            <div className="font-semibold text-orange-700">${estimatedAnnualReturn.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Ownership Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Investment Buttons */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Investment Options</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickAmounts.map((amount) => {
              const shares = Math.floor(amount / sharePrice);
              const ownership = (shares / maxShares) * 100;
              const isSelected = selectedAmount === amount;
              
              return (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`p-2 text-center border rounded-md transition-colors ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50 text-blue-900" 
                      : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  disabled={shares > availableShares}
                >
                  <div className="text-sm font-medium">${(amount / 1000)}k</div>
                  <div className="text-xs text-gray-600">{ownership.toFixed(2)}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ownership Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">
                {ownershipPercentage.toFixed(3)}%
              </div>
              <div className="text-sm text-blue-700">Property Ownership</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                ${propertyValueShare.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Property Value Share</div>
            </div>
          </div>

          {/* Ownership Visualization */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-blue-700 mb-1">
              <span>Your Ownership</span>
              <span>{ownershipPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={ownershipPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-white/70 rounded">
              <div className="font-semibold text-green-700">${actualInvestment.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Investment</div>
            </div>
            <div className="text-center p-2 bg-white/70 rounded">
              <div className="font-semibold text-purple-700">${estimatedAnnualReturn.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Annual Return</div>
            </div>
            <div className="text-center p-2 bg-white/70 rounded">
              <div className="font-semibold text-orange-700">{calculatedShares}</div>
              <div className="text-xs text-gray-600">Shares</div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Property Value</div>
            <div className="font-semibold">${propertyValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Share Price</div>
            <div className="font-semibold">${sharePrice.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Shares</div>
            <div className="font-semibold">{maxShares.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Available</div>
            <div className="font-semibold">{availableShares.toLocaleString()}</div>
            <Badge 
              variant={availableShares > 100 ? "default" : availableShares > 10 ? "secondary" : "destructive"}
              className="text-xs mt-1"
            >
              {availableShares > 100 ? "High" : availableShares > 10 ? "Limited" : "Low"} Availability
            </Badge>
          </div>
        </div>

        {/* Returns Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Estimated Returns</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 border rounded">
              <div className="font-semibold text-green-600">${(estimatedAnnualReturn / 12).toFixed(0)}</div>
              <div className="text-gray-600">Monthly</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="font-semibold text-green-600">${(estimatedAnnualReturn / 4).toFixed(0)}</div>
              <div className="text-gray-600">Quarterly</div>
            </div>
            <div className="text-center p-2 border rounded">
              <div className="font-semibold text-green-600">${estimatedAnnualReturn.toFixed(0)}</div>
              <div className="text-gray-600">Annual</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            *Based on 8% annual return estimate. Returns not guaranteed.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}