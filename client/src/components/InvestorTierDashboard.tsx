import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Users, TrendingUp, Shield, Gift, Vote, FileText, Trophy } from "lucide-react";

interface InvestorTierDashboardProps {
  userTokens: number;
  propertyId: number;
  propertyValue: number;
  totalTokenSupply: number;
  currentFunding: number;
  className?: string;
}

export default function InvestorTierDashboard({
  userTokens,
  propertyId,
  propertyValue,
  totalTokenSupply,
  currentFunding,
  className = ""
}: InvestorTierDashboardProps) {
  // Calculate tier thresholds
  const founderTierThreshold = Math.floor(totalTokenSupply * 0.10);
  const communityTierThreshold = Math.floor(totalTokenSupply * 0.40);
  
  // Determine user's current tier
  const getUserTier = () => {
    if (userTokens <= founderTierThreshold) return "founder";
    if (userTokens <= communityTierThreshold) return "community";
    return "dao";
  };

  const currentTier = getUserTier();
  const ownershipPercentage = (userTokens / totalTokenSupply) * 100;
  const fundingProgress = (currentFunding / totalTokenSupply) * 100;

  const tierConfig = {
    founder: {
      name: "Founder",
      icon: Crown,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      iconColor: "text-amber-600",
      perks: [
        "NFT Certificate",
        "Lifetime Yield Bonus",
        "Free Event Access",
        "Priority Support",
        "Exclusive Updates"
      ]
    },
    community: {
      name: "Community",
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      perks: [
        "Monthly Reports",
        "Voting Rights",
        "Merch Discounts",
        "Community Access",
        "Investment Analytics"
      ]
    },
    dao: {
      name: "DAO Member",
      icon: TrendingUp,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      iconColor: "text-green-600",
      perks: [
        "View-only Rights",
        "Basic Access",
        "Upgrade Options",
        "Standard Reports",
        "Community Forum"
      ]
    }
  };

  const config = tierConfig[currentTier];
  const TierIcon = config.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Tier Status */}
      <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <TierIcon size={24} className={config.iconColor} />
            <div>
              <div className={`text-xl font-bold ${config.textColor}`}>
                {config.name} Tier
              </div>
              <div className="text-sm text-neutral-600">
                Property #{propertyId} • {userTokens.toLocaleString()} tokens owned
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-neutral-900">
                {ownershipPercentage.toFixed(2)}%
              </div>
              <div className="text-sm text-neutral-600">Ownership Share</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-neutral-900">
                ${((propertyValue * ownershipPercentage) / 100).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">Portfolio Value</div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span>{fundingProgress.toFixed(1)}% Complete</span>
            </div>
            <Progress value={fundingProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift size={20} />
            Your Tier Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {config.perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{perk}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy size={20} />
            Tier Structure Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Founder Tier */}
            <div className={`p-4 rounded-lg border-2 ${currentTier === 'founder' ? 'border-amber-300 bg-amber-50' : 'border-neutral-200 bg-neutral-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-amber-600" />
                  <span className="font-semibold text-amber-700">Founder Tier</span>
                  {currentTier === 'founder' && (
                    <Badge className="bg-amber-600 text-white">Current</Badge>
                  )}
                </div>
                <span className="text-sm text-neutral-600">
                  First {founderTierThreshold.toLocaleString()} tokens (10%)
                </span>
              </div>
              <div className="text-sm text-neutral-700">
                Premium benefits including NFT certificate, lifetime yield bonus, and exclusive access
              </div>
            </div>

            {/* Community Tier */}
            <div className={`p-4 rounded-lg border-2 ${currentTier === 'community' ? 'border-blue-300 bg-blue-50' : 'border-neutral-200 bg-neutral-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  <span className="font-semibold text-blue-700">Community Tier</span>
                  {currentTier === 'community' && (
                    <Badge className="bg-blue-600 text-white">Current</Badge>
                  )}
                </div>
                <span className="text-sm text-neutral-600">
                  Next {(communityTierThreshold - founderTierThreshold).toLocaleString()} tokens (30%)
                </span>
              </div>
              <div className="text-sm text-neutral-700">
                Active participation with voting rights, detailed reports, and community benefits
              </div>
            </div>

            {/* DAO Member */}
            <div className={`p-4 rounded-lg border-2 ${currentTier === 'dao' ? 'border-green-300 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" />
                  <span className="font-semibold text-green-700">DAO Member</span>
                  {currentTier === 'dao' && (
                    <Badge className="bg-green-600 text-white">Current</Badge>
                  )}
                </div>
                <span className="text-sm text-neutral-600">
                  Remaining {(totalTokenSupply - communityTierThreshold).toLocaleString()} tokens (60%)
                </span>
              </div>
              <div className="text-sm text-neutral-700">
                Standard access with upgrade options and basic participation rights
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Protection Notice */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield size={20} />
            Investor Protections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span><strong>Lock-up Period:</strong> 6-12 months</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span><strong>Soft Cap:</strong> 60% funding required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span><strong>Escrow:</strong> Multisig protection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span><strong>Refund:</strong> Full refund if soft cap not met</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}