import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Share2,
  DollarSign,
  Building,
  MapPin,
  UserPlus,
  Bell,
  FileText,
  Star,
  Heart,
  ExternalLink
} from "lucide-react";
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Property } from "@shared/schema";

interface PropertyCommunityHubProps {
  property: Property;
  isOwner?: boolean;
}

export default function PropertyCommunityHub({ property, isOwner = false }: PropertyCommunityHubProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock community data - would come from API in production
  const communityStats = {
    totalMembers: 127,
    activeInvestors: 24,
    pendingInvestors: 8,
    socialShares: 342,
    weeklyGrowth: 12
  };

  const recentActivity = [
    {
      id: 1,
      type: "investment",
      user: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      action: "invested $2,500",
      time: "2 hours ago",
      platform: "linkedin"
    },
    {
      id: 2,
      type: "join",
      user: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      action: "joined the community",
      time: "5 hours ago",
      platform: "facebook"
    },
    {
      id: 3,
      type: "share",
      user: "Lisa K.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      action: "shared on Twitter",
      time: "1 day ago",
      platform: "twitter"
    }
  ];

  const investors = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      investment: 2500,
      shares: 12,
      joinDate: "2024-01-15",
      platform: "linkedin",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      investment: 1200,
      shares: 6,
      joinDate: "2024-01-18",
      platform: "facebook",
      verified: true
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      investment: 800,
      shares: 4,
      joinDate: "2024-01-20",
      platform: "twitter",
      verified: false
    }
  ];

  const fundingProgress = (property.currentShares / property.maxShares) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Community Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Building className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{property.address} Community</h1>
              <p className="text-blue-100 flex items-center gap-2">
                <MapPin size={16} />
                {property.city}, {property.state}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{communityStats.totalMembers}</div>
            <div className="text-blue-100">Community Members</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{communityStats.activeInvestors}</div>
            <div className="text-blue-100 text-sm">Active Investors</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">${(property.currentShares * Number(property.sharePrice)).toLocaleString()}</div>
            <div className="text-blue-100 text-sm">Total Invested</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{fundingProgress.toFixed(1)}%</div>
            <div className="text-blue-100 text-sm">Funded</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{communityStats.socialShares}</div>
            <div className="text-blue-100 text-sm">Social Shares</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="social">Social Hub</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Funding Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Funding Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Current Progress</span>
                    <span className="font-bold text-lg">{fundingProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={fundingProgress} className="h-4" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">{property.currentShares}</div>
                      <div className="text-neutral-600">Shares Sold</div>
                    </div>
                    <div>
                      <div className="font-semibold">{property.maxShares - property.currentShares}</div>
                      <div className="text-neutral-600">Remaining</div>
                    </div>
                    <div>
                      <div className="font-semibold">${property.sharePrice}</div>
                      <div className="text-neutral-600">Price/Share</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Community Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+{communityStats.weeklyGrowth}</div>
                    <div className="text-sm text-neutral-600">New members this week</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>LinkedIn</span>
                      <span className="font-semibold">47 members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Facebook</span>
                      <span className="font-semibold">35 members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Twitter</span>
                      <span className="font-semibold">28 members</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Instagram</span>
                      <span className="font-semibold">17 members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Recent Community Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user}</span>
                        {activity.platform === 'linkedin' && <FaLinkedin className="text-blue-600" size={12} />}
                        {activity.platform === 'facebook' && <FaFacebook className="text-blue-700" size={12} />}
                        {activity.platform === 'twitter' && <FaTwitter className="text-blue-400" size={12} />}
                      </div>
                      <div className="text-sm text-neutral-600">{activity.action}</div>
                    </div>
                    <div className="text-xs text-neutral-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investors" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Community Investors</h2>
            {isOwner && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus size={16} className="mr-2" />
                Invite Investors
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor) => (
              <Card key={investor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={investor.avatar} />
                      <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{investor.name}</h3>
                        {investor.verified && <Star className="text-yellow-500" size={14} />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        {investor.platform === 'linkedin' && <FaLinkedin className="text-blue-600" size={12} />}
                        {investor.platform === 'facebook' && <FaFacebook className="text-blue-700" size={12} />}
                        {investor.platform === 'twitter' && <FaTwitter className="text-blue-400" size={12} />}
                        <span>via {investor.platform}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Investment</span>
                      <span className="font-semibold text-green-600">${investor.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Shares Owned</span>
                      <span className="font-semibold">{investor.shares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Joined</span>
                      <span className="text-sm">{new Date(investor.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare size={14} className="mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Social Media Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 size={20} />
                  Social Media Recruitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <FaLinkedin size={16} />
                    Share on LinkedIn
                  </Button>
                  <Button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800">
                    <FaFacebook size={16} />
                    Share on Facebook
                  </Button>
                  <Button className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500">
                    <FaTwitter size={16} />
                    Share on Twitter
                  </Button>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <FaInstagram size={16} />
                    Share on Instagram
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Community Building Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Share property updates and milestones</li>
                    <li>• Highlight investor success stories</li>
                    <li>• Post neighborhood development news</li>
                    <li>• Engage with potential investors' comments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">342</div>
                      <div className="text-sm text-green-700">Total Shares</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1.2k</div>
                      <div className="text-sm text-blue-700">Reach</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>LinkedIn Engagement</span>
                      <span className="font-semibold">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Facebook Engagement</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Twitter Engagement</span>
                      <span className="font-semibold">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Property Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-blue-600" size={20} />
                    <div>
                      <h3 className="font-semibold">Legal Documents</h3>
                      <p className="text-sm text-neutral-600">Property deed, title, LLC formation</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink size={14} className="mr-2" />
                    View Documents
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="text-green-600" size={20} />
                    <div>
                      <h3 className="font-semibold">Financial Reports</h3>
                      <p className="text-sm text-neutral-600">Income statements, rental reports</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink size={14} className="mr-2" />
                    View Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}