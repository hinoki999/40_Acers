import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Award, Users, TrendingUp, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import AIRecommendations from "@/components/AIRecommendations";
import CommunityLeaderboard from "@/components/CommunityLeaderboard";

export default function AIInsights() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("recommendations");

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties"],
    staleTime: 5 * 60 * 1000,
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Brain size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Insights</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized property recommendations, investment risk assessments, 
            and participate in community challenges with our advanced AI features.
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center p-4 border rounded-lg">
              <Brain className="mx-auto mb-2 text-blue-600" size={32} />
              <h3 className="font-semibold mb-1">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">AI analyzes your preferences to suggest optimal properties</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="mx-auto mb-2 text-green-600" size={32} />
              <h3 className="font-semibold mb-1">Risk Assessment</h3>
              <p className="text-sm text-gray-600">Comprehensive analysis of investment risks and opportunities</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="mx-auto mb-2 text-purple-600" size={32} />
              <h3 className="font-semibold mb-1">Ownership Verification</h3>
              <p className="text-sm text-gray-600">Fiat and blockchain-based proof of ownership</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="mx-auto mb-2 text-orange-600" size={32} />
              <h3 className="font-semibold mb-1">Community Challenges</h3>
              <p className="text-sm text-gray-600">Compete with other investors in challenges and leaderboards</p>
            </div>
          </div>
          <Button size="lg" onClick={() => window.location.href = "/api/login"} className="bg-[#8B4513] hover:bg-[#A0522D]">
            Sign In to Access AI Features
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_1750351977219.jpg" 
            alt="40 Acres Logo" 
            className="h-8 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Insights</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Leverage artificial intelligence to make smarter investment decisions, 
          assess risks, and engage with the community.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">Active</div>
            <div className="text-sm text-gray-600">AI Engine</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{properties.length}</div>
            <div className="text-sm text-gray-600">Properties Analyzed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield size={24} className="mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">Real-time</div>
            <div className="text-sm text-gray-600">Risk Analysis</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users size={24} className="mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">Live</div>
            <div className="text-sm text-gray-600">Community</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain size={16} />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users size={16} />
            Community & Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-8">
          <AIRecommendations />
        </TabsContent>

        <TabsContent value="community" className="mt-8">
          <CommunityLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}