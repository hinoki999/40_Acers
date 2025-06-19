import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, MapPin, DollarSign, RefreshCw, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

interface PropertyRecommendation {
  property: {
    id: number;
    address: string;
    city: string;
    state: string;
    propertyType: string;
    propertyValue: string;
    squareFootage: number;
    sharePrice: string;
    maxShares: number;
    currentShares: number;
  };
  score: number;
  reasoning: string;
  investmentPotential: "High" | "Medium" | "Low";
  expectedRoi: string;
}

export default function AIRecommendations() {
  const { isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: recommendations = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/ai/recommendations", refreshKey],
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Brain size={48} className="mx-auto text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-gray-600">Sign in to get personalized property recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain size={24} className="text-blue-600" />
          <CardTitle>AI Property Recommendations</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Recommendations</h3>
            <p className="text-gray-600 mb-4">There was an issue fetching AI recommendations</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Brain size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
            <p className="text-gray-600">Check back later for personalized property suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec: PropertyRecommendation, index: number) => (
              <div key={rec.property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        #{index + 1} RECOMMENDED
                      </span>
                      <Badge 
                        variant="outline" 
                        className={getPotentialColor(rec.investmentPotential)}
                      >
                        {rec.investmentPotential} Potential
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {rec.property.address}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin size={14} className="mr-1" />
                      {rec.property.city}, {rec.property.state} • {rec.property.propertyType}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {rec.score}/100
                    </div>
                    <div className="text-xs text-gray-500">AI Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <BitcoinPriceDisplay 
                      usdPrice={Number(rec.property.sharePrice)} 
                      className="text-center font-bold"
                    />
                    <div className="text-xs text-gray-600 mt-1">Per Token</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-lg">
                      {((rec.property.maxShares - rec.property.currentShares) / rec.property.maxShares * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Available</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-lg text-green-600">
                      {rec.expectedRoi}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Expected ROI</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Funding Progress</span>
                    <span>{rec.property.currentShares.toLocaleString()} / {rec.property.maxShares.toLocaleString()} tokens</span>
                  </div>
                  <Progress 
                    value={(rec.property.currentShares / rec.property.maxShares) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-1">
                    <TrendingUp size={14} />
                    AI Analysis
                  </h4>
                  <p className="text-blue-800 text-sm">{rec.reasoning}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {rec.property.squareFootage.toLocaleString()} sq ft • 
                    ${(Number(rec.property.propertyValue) / rec.property.squareFootage).toFixed(0)}/sq ft
                  </div>
                  <Button size="sm" className="bg-[#8B4513] hover:bg-[#A0522D]">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}