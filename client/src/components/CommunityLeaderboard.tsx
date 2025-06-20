import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Crown,
  Star,
  Zap
} from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";

interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  totalInvestments: number;
  totalEarnings: number;
  communityRank: number;
  achievementsCount: number;
  location?: string;
  joinedAt: string;
  roi: number;
  portfolioValue: number;
}

interface Achievement {
  id: number;
  userId: string;
  type: string;
  title: string;
  description: string;
  earnedAt: string;
  isPublic: boolean;
}

export default function CommunityLeaderboard() {
  const [activeTab, setActiveTab] = useState("investors");

  const { data: topInvestors = [], isLoading: loadingInvestors } = useQuery({
    queryKey: ["/api/community/leaderboard/investors"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: topEarners = [], isLoading: loadingEarners } = useQuery({
    queryKey: ["/api/community/leaderboard/earners"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: recentAchievements = [], isLoading: loadingAchievements } = useQuery({
    queryKey: ["/api/community/achievements/recent"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-neutral-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800">🏆 #1</Badge>;
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800">🥈 #2</Badge>;
    if (rank === 3) return <Badge className="bg-amber-100 text-amber-800">🥉 #3</Badge>;
    if (rank <= 10) return <Badge className="bg-blue-100 text-blue-800">⭐ Top 10</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const getAchievementIcon = (type: string) => {
    const icons = {
      first_investment: <Target className="h-4 w-4 text-green-600" />,
      milestone: <Trophy className="h-4 w-4 text-yellow-600" />,
      top_earner: <DollarSign className="h-4 w-4 text-green-600" />,
      community_star: <Star className="h-4 w-4 text-purple-600" />,
      early_adopter: <Zap className="h-4 w-4 text-blue-600" />,
    };
    return icons[type as keyof typeof icons] || <Award className="h-4 w-4 text-neutral-600" />;
  };

  const LeaderboardCard = ({ user, rank, metric }: { user: LeaderboardUser; rank: number; metric: 'investment' | 'earnings' }) => (
    <Card className={`transition-all hover:shadow-lg ${rank <= 3 ? 'border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
            {getRankIcon(rank)}
          </div>
          
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImageUrl} />
            <AvatarFallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-neutral-900 truncate">
                {user.firstName} {user.lastName}
              </h3>
              {getRankBadge(rank)}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              {user.location && <span>{user.location}</span>}
              <span>•</span>
              <span>{user.achievementsCount} achievements</span>
            </div>
            
            <div className="mt-2">
              {metric === 'investment' ? (
                <div className="text-lg font-bold text-green-600">
                  ${user.totalInvestments.toLocaleString()}
                </div>
              ) : (
                <div className="text-lg font-bold text-blue-600">
                  ${user.totalEarnings.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-neutral-500">
                {metric === 'investment' ? 'Total Invested' : 'Total Earnings'} • {user.roi.toFixed(1)}% ROI
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">Community Champions</h2>
            <p className="text-purple-100">
              Celebrating our top performers and community contributors
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="investors">Top Investors</TabsTrigger>
          <TabsTrigger value="earners">Top Earners</TabsTrigger>
          <TabsTrigger value="achievements">Recent Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="investors" className="space-y-4">
          {loadingInvestors ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-32"></div>
                        <div className="h-3 bg-neutral-200 rounded w-24"></div>
                        <div className="h-5 bg-neutral-200 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topInvestors.map((user: LeaderboardUser, index: number) => (
                <LeaderboardCard 
                  key={user.id} 
                  user={user} 
                  rank={index + 1} 
                  metric="investment"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="earners" className="space-y-4">
          {loadingEarners ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                      <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-32"></div>
                        <div className="h-3 bg-neutral-200 rounded w-24"></div>
                        <div className="h-5 bg-neutral-200 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topEarners.map((user: LeaderboardUser, index: number) => (
                <LeaderboardCard 
                  key={user.id} 
                  user={user} 
                  rank={index + 1} 
                  metric="earnings"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {loadingAchievements ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-40"></div>
                        <div className="h-3 bg-neutral-200 rounded w-32"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((achievement: Achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {achievement.description}
                        </p>
                        <div className="text-xs text-neutral-500 mt-1">
                          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}