import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, Heart, MessageCircle, Share2, Star } from "lucide-react";

interface SocialInvestorNetworkProps {
  propertyId: number;
  compact?: boolean;
  showTitle?: boolean;
}

interface SocialInvestor {
  id: number;
  userId: string;
  propertyId: number;
  investmentAmount: string;
  sharesPurchased: number;
  socialHandle: string;
  profileImageUrl: string;
  investmentDate: string;
  publicMessage: string;
  influenceScore: number;
  tier: string;
  isVerified: boolean;
}

export default function SocialInvestorNetwork({ 
  propertyId, 
  compact = false, 
  showTitle = true 
}: SocialInvestorNetworkProps) {
  const [showAll, setShowAll] = useState(false);

  const { data: investors = [] } = useQuery<SocialInvestor[]>({
    queryKey: [`/api/social-investors/${propertyId}`],
  });

  const displayInvestors = compact ? investors.slice(0, 3) : (showAll ? investors : investors.slice(0, 6));

  if (investors.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-blue-600">Be the first to invest in this property!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Users size={16} />
              Social Investors ({investors.length})
            </h4>
            {investors.length > 6 && !compact && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600"
              >
                {showAll ? 'Show Less' : 'View All'}
              </Button>
            )}
          </div>
        )}

        <div className={`space-y-3 ${compact ? 'space-y-2' : ''}`}>
          {displayInvestors.map((investor) => (
            <div
              key={investor.id}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-r from-neutral-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all ${
                compact ? 'p-2' : ''
              }`}
            >
              <Avatar className={compact ? "w-8 h-8" : "w-10 h-10"}>
                <AvatarImage src={investor.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                  {investor.socialHandle.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-neutral-900 ${compact ? 'text-sm' : ''}`}>
                    @{investor.socialHandle}
                  </span>
                  {investor.isVerified && (
                    <Badge variant="secondary" className="px-1 py-0 text-xs">
                      ✓
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      investor.tier === 'Gold' ? 'border-yellow-400 text-yellow-600' :
                      investor.tier === 'Silver' ? 'border-gray-400 text-gray-600' :
                      'border-orange-400 text-orange-600'
                    }`}
                  >
                    {investor.tier}
                  </Badge>
                </div>
                
                <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} text-neutral-600`}>
                  <TrendingUp size={12} />
                  <span>${Number(investor.investmentAmount).toLocaleString()}</span>
                  <span>•</span>
                  <span>{investor.sharesPurchased} shares</span>
                  {investor.influenceScore > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-500" />
                        <span>{investor.influenceScore}</span>
                      </div>
                    </>
                  )}
                </div>

                {investor.publicMessage && !compact && (
                  <p className="text-xs text-neutral-600 mt-1 italic truncate">
                    "{investor.publicMessage}"
                  </p>
                )}
              </div>

              {!compact && (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MessageCircle size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {compact && investors.length > 3 && (
          <div className="text-center mt-3">
            <Button variant="outline" size="sm" className="text-xs">
              +{investors.length - 3} more investors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}