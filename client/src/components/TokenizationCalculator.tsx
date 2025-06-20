import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Home, Calculator, Shield, Crown, Users } from "lucide-react";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

interface TokenizationCalculatorProps {
  propertyValue: number;
  squareFootage: number;
  className?: string;
}

export default function TokenizationCalculator({ 
  propertyValue, 
  squareFootage, 
  className = "" 
}: TokenizationCalculatorProps) {
  // Core Formula: Token Price = Property Valuation ÷ Sq Ft
  const baseTokenPrice = squareFootage > 0 ? propertyValue / squareFootage : 0;
  
  // Max Tokenized Value = 49% of Total Property Value (legal compliance)
  const maxTokenizedValue = propertyValue * 0.49;
  
  // Dynamic Token Supply Strategy
  const useScarcityModel = propertyValue < 500000;
  const maxTokenSupply = useScarcityModel ? 10000 : 100000;
  
  // Token Supply = Max Tokenized Value ÷ Token Price
  const actualTokenSupply = Math.min(
    Math.floor(maxTokenizedValue / baseTokenPrice),
    maxTokenSupply
  );
  
  // Final token price with platform fee (5%)
  const tokenPriceWithFee = baseTokenPrice * 1.05;
  
  // Minimum purchase rule
  const minPurchaseTokens = tokenPriceWithFee < 100 ? 5 : 1;

  // Calculate investor tier thresholds
  const founderTierThreshold = Math.floor(actualTokenSupply * 0.10); // First 10%
  const communityTierThreshold = Math.floor(actualTokenSupply * 0.40); // Next 30%
  
  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator size={20} />
          40 Acres Tokenomics
        </CardTitle>
        <div className="text-sm text-neutral-600">
          {useScarcityModel ? "Scarcity Model" : "Access Model"} • Legal 49% Compliance
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-green-600" />
              <span className="text-sm font-medium text-neutral-700">Max Tokenized Value</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              ${maxTokenizedValue.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">49% of ${propertyValue.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Home size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-neutral-700">Token Supply</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {actualTokenSupply.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">
              {useScarcityModel ? "Scarcity Cap: 10K" : "Access Cap: 100K"}
            </div>
          </div>
        </div>

        {/* Token Pricing */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <DollarSign size={16} />
            Token Pricing Structure
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                ${baseTokenPrice.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-600">Base Price</div>
              <Badge variant="outline" className="mt-1 text-xs">
                Value ÷ Sq Ft
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                ${tokenPriceWithFee.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-600">Final Price</div>
              <Badge variant="outline" className="mt-1 text-xs">
                +5% Platform Fee
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {minPurchaseTokens}
              </div>
              <div className="text-xs text-neutral-600">Min Purchase</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {minPurchaseTokens === 5 ? "<$100 rule" : "Standard"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Investor Tiers */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Crown size={16} />
            Investor Tier Structure
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-amber-500">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-amber-600" />
                <span className="font-medium text-amber-700">Founder Tier</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{founderTierThreshold.toLocaleString()} tokens</div>
                <div className="text-xs text-neutral-600">First 10% • NFT + Lifetime Yield</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-blue-500">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-600" />
                <span className="font-medium text-blue-700">Community Tier</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{(communityTierThreshold - founderTierThreshold).toLocaleString()} tokens</div>
                <div className="text-xs text-neutral-600">Next 30% • Voting + Reports</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-green-500">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="font-medium text-green-700">DAO Member</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{(actualTokenSupply - communityTierThreshold).toLocaleString()} tokens</div>
                <div className="text-xs text-neutral-600">Remaining 60% • Basic Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Protection */}
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
          <h5 className="font-medium text-red-800 mb-2 flex items-center gap-2">
            <Shield size={14} />
            Investor Protections
          </h5>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• <strong>Lock-up Period:</strong> 6-12 months minimum hold</li>
            <li>• <strong>Soft Cap:</strong> 60% tokens sold before fund release</li>
            <li>• <strong>Escrow:</strong> Multisig wallet protection</li>
            <li>• <strong>Refund Protocol:</strong> Full refund if soft cap not met</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}