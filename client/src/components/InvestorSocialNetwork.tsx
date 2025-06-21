import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp, 
  DollarSign,
  Eye,
  UserPlus,
  Search,
  Filter,
  Star,
  Award,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface InvestorProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  investmentStyle: string;
  totalInvested: number;
  propertiesOwned: number;
  avgROI: number;
  joinedDate: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  portfolioValue: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentGoals: string[];
  achievements: string[];
}

interface InvestmentPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  propertyAddress?: string;
  investmentAmount?: number;
  expectedROI?: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
}

interface NetworkStats {
  totalInvestors: number;
  totalInvested: string;
  avgPortfolioSize: number;
  topPerformers: InvestorProfile[];
  trendingInvestments: string[];
}

interface InvestorSocialNetworkProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export default function InvestorSocialNetwork({ 
  isOpen, 
  onClose, 
  currentUserId 
}: InvestorSocialNetworkProps) {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: networkStats } = useQuery({
    queryKey: ['/api/social/stats'],
    enabled: isOpen,
  });

  const { data: investmentFeed } = useQuery({
    queryKey: ['/api/social/feed', selectedFilter],
    enabled: isOpen && activeTab === 'feed',
  });

  const { data: investorProfiles } = useQuery({
    queryKey: ['/api/social/investors', searchTerm],
    enabled: isOpen && activeTab === 'network',
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/feed'] });
      setPostContent('');
      toast({
        title: "Post Created",
        description: "Your investment post has been shared with the community",
      });
    },
  });

  const followUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/social/follow/${userId}`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/investors'] });
      toast({
        title: "Following User",
        description: "You're now following this investor",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/feed'] });
    },
  });

  // Mock data for demonstration
  const mockFeed: InvestmentPost[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Chen',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      content: 'Just closed on my 3rd property investment through 40 Acres! This Detroit townhouse has amazing potential with the neighborhood revitalization happening. Expected 12% ROI based on current rental market trends.',
      propertyAddress: '1909 E Ferry Street, Detroit',
      investmentAmount: 5000,
      expectedROI: '12%',
      images: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400'],
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      tags: ['Detroit', 'Townhouse', 'HighROI']
    },
    {
      id: '2',
      userId: '3',
      userName: 'Michael Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      content: 'Portfolio update: Hit my goal of $50k invested across 8 properties! Diversification is key - spreading across different markets and property types. The monthly dividends are starting to add up nicely.',
      timestamp: '4 hours ago',
      likes: 45,
      comments: 12,
      shares: 7,
      isLiked: true,
      tags: ['Portfolio', 'Milestone', 'Diversification']
    },
    {
      id: '3',
      userId: '4',
      userName: 'Ashley Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      content: 'First-time investor here! Just made my initial $500 investment. Excited to learn from this amazing community. Any tips for a beginner?',
      timestamp: '1 day ago',
      likes: 32,
      comments: 15,
      shares: 2,
      isLiked: false,
      tags: ['FirstTime', 'Beginner', 'Community']
    }
  ];

  const mockInvestors: InvestorProfile[] = [
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      location: 'San Francisco, CA',
      investmentStyle: 'Growth-focused',
      totalInvested: 45000,
      propertiesOwned: 12,
      avgROI: 11.2,
      joinedDate: 'Jan 2024',
      isFollowing: false,
      followerCount: 234,
      followingCount: 89,
      portfolioValue: 52000,
      riskTolerance: 'Moderate',
      investmentGoals: ['Long-term wealth', 'Passive income'],
      achievements: ['Top Performer Q1', 'Portfolio Milestone']
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: 'Austin, TX',
      investmentStyle: 'Diversified',
      totalInvested: 75000,
      propertiesOwned: 18,
      avgROI: 9.8,
      joinedDate: 'Nov 2023',
      isFollowing: true,
      followerCount: 456,
      followingCount: 124,
      portfolioValue: 82000,
      riskTolerance: 'Aggressive',
      investmentGoals: ['Early retirement', 'Real estate empire'],
      achievements: ['Community Leader', 'Investment Expert']
    }
  ];

  const mockStats: NetworkStats = {
    totalInvestors: 1247,
    totalInvested: '$12.4M',
    avgPortfolioSize: 8.3,
    topPerformers: mockInvestors.slice(0, 3),
    trendingInvestments: ['Detroit Properties', 'Multi-family', 'High ROI']
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    
    createPostMutation.mutate({
      content: postContent,
      tags: []
    });
  };

  const handleFollowUser = (userId: string) => {
    followUserMutation.mutate(userId);
  };

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Investor Social Network
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {/* Create Post */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your investment insights with the community..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        Tag Property
                      </Button>
                    </div>
                    <Button onClick={handleCreatePost} disabled={!postContent.trim()}>
                      Share Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Filters */}
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-500" />
              {['all', 'following', 'trending', 'investments'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {mockFeed.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback>{post.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{post.userName}</span>
                          <span className="text-gray-500 text-sm">{post.timestamp}</span>
                        </div>
                        <p className="text-gray-800 mb-3">{post.content}</p>
                        
                        {post.propertyAddress && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{post.propertyAddress}</span>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>Investment: ${post.investmentAmount?.toLocaleString()}</span>
                              <span>Expected ROI: {post.expectedROI}</span>
                            </div>
                          </div>
                        )}

                        {post.images && (
                          <div className="mb-3">
                            <img 
                              src={post.images[0]} 
                              alt="Property" 
                              className="w-full max-w-md h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex gap-1 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 text-gray-500">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1 hover:text-red-500 ${
                              post.isLiked ? 'text-red-500' : ''
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-green-500">
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search investors by name, location, or investment style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockStats.totalInvestors}</div>
                  <div className="text-sm text-gray-600">Total Investors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{mockStats.totalInvested}</div>
                  <div className="text-sm text-gray-600">Total Invested</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockStats.avgPortfolioSize}</div>
                  <div className="text-sm text-gray-600">Avg Portfolio</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">94%</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </CardContent>
              </Card>
            </div>

            {/* Investor Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockInvestors.map((investor) => (
                <Card key={investor.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={investor.avatar} />
                          <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{investor.name}</h3>
                          <p className="text-sm text-gray-600">{investor.location}</p>
                          <p className="text-sm text-blue-600">{investor.investmentStyle}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={investor.isFollowing ? "secondary" : "default"}
                        onClick={() => handleFollowUser(investor.id)}
                      >
                        {investor.isFollowing ? (
                          <>Following</>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Total Invested:</span>
                        <div className="font-semibold">${investor.totalInvested.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Properties:</span>
                        <div className="font-semibold">{investor.propertiesOwned}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg ROI:</span>
                        <div className="font-semibold text-green-600">{investor.avgROI}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Portfolio Value:</span>
                        <div className="font-semibold">${investor.portfolioValue.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {investor.achievements.map((achievement) => (
                          <Badge key={achievement} className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{investor.followerCount} followers</span>
                        <span>Joined {investor.joinedDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Performers */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Performers This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockStats.topPerformers.map((investor, index) => (
                      <div key={investor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={investor.avatar} />
                          <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{investor.name}</div>
                          <div className="text-sm text-gray-600">{investor.avgROI}% avg ROI</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">${investor.totalInvested.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{investor.propertiesOwned} properties</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Community Growth</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Investments</span>
                      <span className="text-blue-600">+18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg Portfolio ROI</span>
                      <span className="text-purple-600">9.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Investment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Single Family Homes</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Townhouses</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-sm">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Condominiums</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Conservative</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>
                        <span className="text-sm">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Moderate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '50%'}}></div>
                        </div>
                        <span className="text-sm">50%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Aggressive</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                        <span className="text-sm">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}