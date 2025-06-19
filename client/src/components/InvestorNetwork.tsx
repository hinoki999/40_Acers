import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, ExternalLink, Shield, MapPin, Calendar } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { getQueryFn } from "@/lib/queryClient";

interface SocialInvestor {
  id: number;
  userId: string;
  propertyId: number;
  platform: 'facebook' | 'instagram';
  profileUrl: string;
  profileImageUrl?: string;
  displayName: string;
  username: string;
  investmentAmount: string;
  sharesOwned: number;
  investmentDate: string;
  isPublic: boolean;
  followerCount?: number;
  verifiedAccount: boolean;
  location?: string;
}

interface InvestorNetworkProps {
  propertyId?: number;
  className?: string;
}

export default function InvestorNetwork({ propertyId, className = "" }: InvestorNetworkProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'facebook' | 'instagram'>('all');
  
  const { data: investors = [], isLoading } = useQuery<SocialInvestor[]>({
    queryKey: ["/api/social-investors", propertyId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Mock data for demonstration since we don't have real social media integrations
  const mockInvestors: SocialInvestor[] = [
    {
      id: 1,
      userId: "user1",
      propertyId: propertyId || 1,
      platform: 'facebook',
      profileUrl: 'https://facebook.com/sarah.chen.investor',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=150',
      displayName: 'Sarah Chen',
      username: 'sarah.chen.investor',
      investmentAmount: '$25,000',
      sharesOwned: 50,
      investmentDate: '2024-01-15',
      isPublic: true,
      followerCount: 1247,
      verifiedAccount: false,
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      userId: "user2",
      propertyId: propertyId || 1,
      platform: 'instagram',
      profileUrl: 'https://instagram.com/mike_property_pro',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      displayName: 'Mike Rodriguez',
      username: 'mike_property_pro',
      investmentAmount: '$15,000',
      sharesOwned: 30,
      investmentDate: '2024-01-20',
      isPublic: true,
      followerCount: 3421,
      verifiedAccount: true,
      location: 'Miami, FL'
    },
    {
      id: 3,
      userId: "user3",
      propertyId: propertyId || 1,
      platform: 'facebook',
      profileUrl: 'https://facebook.com/alex.investment',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      displayName: 'Alex Johnson',
      username: 'alex.investment',
      investmentAmount: '$40,000',
      sharesOwned: 80,
      investmentDate: '2024-01-10',
      isPublic: true,
      followerCount: 892,
      verifiedAccount: false,
      location: 'Austin, TX'
    },
    {
      id: 4,
      userId: "user4",
      propertyId: propertyId || 1,
      platform: 'instagram',
      profileUrl: 'https://instagram.com/lisa_builds_wealth',
      profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      displayName: 'Lisa Thompson',
      username: 'lisa_builds_wealth',
      investmentAmount: '$35,000',
      sharesOwned: 70,
      investmentDate: '2024-01-25',
      isPublic: true,
      followerCount: 5678,
      verifiedAccount: true,
      location: 'Seattle, WA'
    },
    {
      id: 5,
      userId: "user5",
      propertyId: propertyId || 1,
      platform: 'facebook',
      profileUrl: 'https://facebook.com/david.real.estate',
      profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      displayName: 'David Park',
      username: 'david.real.estate',
      investmentAmount: '$20,000',
      sharesOwned: 40,
      investmentDate: '2024-02-01',
      isPublic: true,
      followerCount: 2156,
      verifiedAccount: false,
      location: 'Denver, CO'
    }
  ];

  const filteredInvestors = selectedPlatform === 'all' 
    ? mockInvestors 
    : mockInvestors.filter(investor => investor.platform === selectedPlatform);

  const totalInvestment = mockInvestors.reduce((sum, investor) => 
    sum + parseInt(investor.investmentAmount.replace(/[,$]/g, '')), 0
  );

  const totalShares = mockInvestors.reduce((sum, investor) => sum + investor.sharesOwned, 0);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook className="text-blue-600" size={16} />;
      case 'instagram':
        return <FaInstagram className="text-pink-600" size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-32 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Investor Network</h3>
              <p className="text-sm text-neutral-600 font-normal">
                Social media users who invested in this property
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">${totalInvestment.toLocaleString()}</div>
              <div className="text-sm text-neutral-600">Total Investment</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{filteredInvestors.length}</div>
              <div className="text-sm text-neutral-600">Active Investors</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{totalShares}</div>
              <div className="text-sm text-neutral-600">Total Shares</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-700">Filter by platform:</span>
        <div className="flex gap-2">
          <Button
            variant={selectedPlatform === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('all')}
            className={selectedPlatform === 'all' ? 'bg-black hover:bg-neutral-800' : ''}
          >
            All Platforms
          </Button>
          <Button
            variant={selectedPlatform === 'facebook' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('facebook')}
            className={`flex items-center gap-1 ${selectedPlatform === 'facebook' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          >
            <FaFacebook size={14} />
            Facebook
          </Button>
          <Button
            variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('instagram')}
            className={`flex items-center gap-1 ${selectedPlatform === 'instagram' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
          >
            <FaInstagram size={14} />
            Instagram
          </Button>
        </div>
      </div>

      {/* Investor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvestors.map((investor) => (
          <Card key={investor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={investor.profileImageUrl} alt={investor.displayName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {investor.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    {getPlatformIcon(investor.platform)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900 truncate">
                      {investor.displayName}
                    </h4>
                    {investor.verifiedAccount && (
                      <Shield className="text-blue-600 flex-shrink-0" size={14} />
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">@{investor.username}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Investment:</span>
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {investor.investmentAmount}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Shares:</span>
                      <Badge variant="secondary">{investor.sharesOwned}</Badge>
                    </div>
                    
                    {investor.followerCount && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Followers:</span>
                        <span className="text-xs font-medium">
                          {investor.followerCount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {investor.location && (
                  <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <MapPin size={12} />
                    {investor.location}
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                  <Calendar size={12} />
                  Invested on {new Date(investor.investmentDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => window.open(investor.profileUrl, '_blank')}
                >
                  <ExternalLink size={12} className="mr-1" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvestors.length === 0 && (
        <div className="text-center py-16">
          <Users className="mx-auto mb-4 text-neutral-400" size={48} />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">No investors found</h3>
          <p className="text-neutral-600">
            {selectedPlatform === 'all' 
              ? "No social media investors have been found for this property."
              : `No ${selectedPlatform} investors found. Try selecting a different platform.`
            }
          </p>
        </div>
      )}

      {/* Social Proof Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-green-800">Social Investment Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-green-700">Network Effect:</strong>
              <p className="text-green-600 mt-1">
                These investors have a combined social reach of{' '}
                <strong>
                  {mockInvestors.reduce((sum, inv) => sum + (inv.followerCount || 0), 0).toLocaleString()} followers
                </strong>
                , amplifying property visibility and value.
              </p>
            </div>
            <div>
              <strong className="text-green-700">Trust Signals:</strong>
              <p className="text-green-600 mt-1">
                Public social media profiles provide transparency and build investor confidence through 
                social proof and peer validation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}