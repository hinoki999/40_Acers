import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  MapPin, 
  Building, 
  Coins, 
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

interface RiskFactor {
  score: number;
  analysis: string;
}

interface RiskAssessmentData {
  overallRisk: "Low" | "Medium" | "High";
  riskScore: number;
  factors: {
    location: RiskFactor;
    market: RiskFactor;
    property: RiskFactor;
    tokenization: RiskFactor;
  };
  recommendations: string[];
  investmentAdvice: string;
}

interface RiskAssessmentProps {
  property: Property;
  onInvest?: () => void;
}

export default function RiskAssessment({ property, onInvest }: RiskAssessmentProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { data: assessment, isLoading, error } = useQuery<RiskAssessmentData>({
    queryKey: [`/api/ai/risk-assessment/${property.id}`],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "High": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low": return <CheckCircle size={16} className="text-green-600" />;
      case "Medium": return <AlertCircle size={16} className="text-yellow-600" />;
      case "High": return <XCircle size={16} className="text-red-600" />;
      default: return <Shield size={16} className="text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600";
    if (score <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !assessment) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <AlertTriangle size={48} className="mx-auto text-red-400" />
            <h3 className="text-lg font-semibold text-red-900">Risk Assessment Unavailable</h3>
            <p className="text-red-700">Unable to analyze investment risk at this time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={20} />
            Investment Risk Analysis
          </div>
          <Badge 
            variant="outline" 
            className={`${getRiskColor(assessment.overallRisk)} flex items-center gap-1`}
          >
            {getRiskIcon(assessment.overallRisk)}
            {assessment.overallRisk} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-4xl font-bold ${getScoreColor(assessment.riskScore)} mb-2`}>
            {assessment.riskScore}/100
          </div>
          <div className="text-gray-600 text-sm">Risk Score (lower is better)</div>
          <Progress 
            value={assessment.riskScore} 
            className="mt-3 h-3"
          />
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin size={16} />
              Location Risk
            </h4>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className={`font-bold ${getScoreColor(assessment.factors.location.score)}`}>
                  {assessment.factors.location.score}/100
                </span>
              </div>
              <Progress value={assessment.factors.location.score} className="h-2 mb-2" />
              <p className="text-xs text-gray-700">{assessment.factors.location.analysis}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart3 size={16} />
              Market Risk
            </h4>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className={`font-bold ${getScoreColor(assessment.factors.market.score)}`}>
                  {assessment.factors.market.score}/100
                </span>
              </div>
              <Progress value={assessment.factors.market.score} className="h-2 mb-2" />
              <p className="text-xs text-gray-700">{assessment.factors.market.analysis}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Building size={16} />
              Property Risk
            </h4>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className={`font-bold ${getScoreColor(assessment.factors.property.score)}`}>
                  {assessment.factors.property.score}/100
                </span>
              </div>
              <Progress value={assessment.factors.property.score} className="h-2 mb-2" />
              <p className="text-xs text-gray-700">{assessment.factors.property.analysis}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Coins size={16} />
              Tokenization Risk
            </h4>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className={`font-bold ${getScoreColor(assessment.factors.tokenization.score)}`}>
                  {assessment.factors.tokenization.score}/100
                </span>
              </div>
              <Progress value={assessment.factors.tokenization.score} className="h-2 mb-2" />
              <p className="text-xs text-gray-700">{assessment.factors.tokenization.analysis}</p>
            </div>
          </div>
        </div>

        {/* Investment Advice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <TrendingDown size={16} />
            Investment Advice
          </h4>
          <p className="text-blue-800 text-sm">{assessment.investmentAdvice}</p>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <Button 
            variant="ghost" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-start"
          >
            <AlertTriangle size={16} className="mr-2" />
            {showDetails ? 'Hide' : 'Show'} Risk Recommendations ({assessment.recommendations.length})
          </Button>
          
          {showDetails && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
              {assessment.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {onInvest && (
          <Button 
            onClick={onInvest}
            className="w-full" 
            variant={assessment.overallRisk === "High" ? "destructive" : "default"}
          >
            {assessment.overallRisk === "High" ? "Invest with Caution" : "Proceed with Investment"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}