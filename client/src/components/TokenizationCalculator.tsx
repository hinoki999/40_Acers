import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Home, Calculator } from "lucide-react";

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
  // Calculate tokens: Each 10 sq ft = 1 token
  const totalTokens = Math.floor(squareFootage / 10);
  const tokenPrice = totalTokens > 0 ? propertyValue / totalTokens : 0;
  const pricePerSqFt = squareFootage > 0 ? propertyValue / squareFootage : 0;

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator size={20} />
          Tokenization Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Home size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-neutral-700">Property Size</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {squareFootage.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-500">square feet</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-sm font-medium text-neutral-700">Property Value</span>
            </div>
            <BitcoinPriceDisplay 
              usdPrice={propertyValue} 
              showBoth={true}
              className="text-green-600"
            />
            <div className="text-xs text-neutral-500">total value</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Token Economics
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-600">Total Tokens</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {squareFootage} ÷ 10
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                ${tokenPrice.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-600">Per Token</div>
              <Badge variant="outline" className="mt-1 text-xs">
                Value ÷ Tokens
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                ${pricePerSqFt.toFixed(0)}
              </div>
              <div className="text-xs text-neutral-600">Per Sq Ft</div>
              <Badge variant="outline" className="mt-1 text-xs">
                Market Rate
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <h5 className="font-medium text-yellow-800 mb-2">Tokenization Formula</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Token Quantity:</strong> Square footage ÷ 10</li>
            <li>• <strong>Token Price:</strong> Property value ÷ Token quantity</li>
            <li>• <strong>Minimum Investment:</strong> 1 token = ${tokenPrice.toFixed(2)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}