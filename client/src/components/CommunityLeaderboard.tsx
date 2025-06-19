import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Building, 
  Users, 
  Target,
  Star,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface LeaderboardEntry {
  id: number;
  userId: string;
  category: string;
  score: number;
  rank: number;
  achievements: string[];
  lastUpdated: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  rules: any;
  rewards: any;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const categories = [
  { id: "total_investment", name: "Investment Volume", icon: TrendingUp },
  { id: "properties_created", name: "Property Creation", icon: Building },
  { id: "community_engagement", name: "Community Activity", icon: Users },
];

export default function CommunityLeaderboard() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("total_investment");

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/leaderboard/${selectedCategory}`],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: userRank } = useQuery<LeaderboardEntry>({
    queryKey: [`/api/leaderboard/${selectedCategory}/my-rank`],
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={20} className="text-yellow-500" />;
      case 2: return <Medal size={20} className="text-gray-400" />;
      case 3: return <Medal size={20} className="text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const formatScore = (score: number, category: string) => {
    switch (category) {
      case "total_investment":
        return `$${score.toLocaleString()}`;
      case "properties_created":
        return `${score} properties`;
      case "community_engagement":
        return `${score} points`;
      default:
        return score.toString();
    }
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {challenges.slice(0, 2).map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <Badge variant="outline" className="bg-white">
                      {challenge.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Ends: {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline">
                      Join Challenge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy size={20} />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon size={16} />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {/* User's Rank */}
                {isAuthenticated && userRank && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{getUserInitials(userRank.userId)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Your Rank</div>
                          <div className="text-sm text-gray-600">
                            {formatScore(userRank.score, category.id)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                          {getRankIcon(userRank.rank || 0)}
                        </div>
                        {userRank.rank && userRank.rank <= 10 && (
                          <Badge variant="outline" className="mt-1">
                            Top 10
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Leaderboard Entries */}
                <div className="space-y-3">
                  {leaderboardLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Trophy size={48} className="mx-auto mb-3 text-gray-300" />
                      <p>No leaderboard data available yet</p>
                    </div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div 
                        key={entry.id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors hover:bg-gray-50 ${
                          entry.userId === user?.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{getUserInitials(entry.userId)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="font-medium">
                            {entry.userId === user?.id ? 'You' : `User ${entry.userId.slice(-4)}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatScore(entry.score, category.id)}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <TrendingUp size={12} />
                            {entry.score > 0 ? (
                              <ChevronUp size={12} className="text-green-500" />
                            ) : (
                              <ChevronDown size={12} className="text-red-500" />
                            )}
                          </div>
                          {entry.achievements.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-yellow-500" />
                              <span className="text-xs text-gray-500">
                                {entry.achievements.length} badges
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}