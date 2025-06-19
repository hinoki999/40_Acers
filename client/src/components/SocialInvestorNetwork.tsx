import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, MessageCircle, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SocialInvestor } from "@shared/schema";

interface SocialInvestorNetworkProps {
  propertyId?: number;
  className?: string;
}

export default function SocialInvestorNetwork({ propertyId, className = "" }: SocialInvestorNetworkProps) {
  const { data: investors = [], isLoading } = useQuery<SocialInvestor[]>({
    queryKey: propertyId ? ['/api/social-investors', propertyId] : ['/api/social-investors'],
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Investor Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Investor Network
          <Badge variant="secondary" className="ml-auto">
            {investors.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {investors.slice(0, 5).map((investor) => (
            <div key={investor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={investor.profileImageUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {investor.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{investor.displayName}</p>
                  <Badge variant="outline" className="text-xs">
                    {investor.platform}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    ${Number(investor.investmentAmount).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {investor.sharesOwned}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {investors.length > 5 && (
            <Button variant="ghost" size="sm" className="w-full">
              <Plus size={16} className="mr-2" />
              View All {investors.length} Investors
            </Button>
          )}
          
          {investors.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Users size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No investors yet</p>
              <p className="text-xs">Be the first to invest!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}