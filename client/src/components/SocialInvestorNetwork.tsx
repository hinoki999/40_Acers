import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Eye, TrendingUp, Star, ExternalLink } from "lucide-react";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

interface SocialInvestor {
  id: number;
  userId: string;
  propertyId: number;
  displayName: string;
  profileImage?: string;
  bio?: string;
  instagramHandle?: string;
  facebookProfile?: string;
  linkedinProfile?: string;
  twitterHandle?: string;
  investmentAmount: string;
  sharesOwned: number;
  investorTier: string;
  totalInvestments: number;
  followers: number;
  following: number;
  verified: boolean;
  investmentDate: Date;
}

interface SocialInvestorNetworkProps {
  propertyId: number;
  maxDisplay?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export default function SocialInvestorNetwork({ 
  propertyId, 
  maxDisplay = 6, 
  showTitle = true, 
  compact = false 
}: SocialInvestorNetworkProps) {
  const [showAll, setShowAll] = useState(false);

  // Mock data - in real app, this would come from API
  const mockInvestors: SocialInvestor[] = [
    {
      id: 1,
      userId: "user1",
      propertyId,
      displayName: "Sarah Johnson",
      profileImage: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff",
      bio: "Real estate enthusiast & tech entrepreneur",
      instagramHandle: "sarahjohnson_re",
      linkedinProfile: "sarah-johnson-realtor",
      facebookProfile: "sarah.johnson.realtor",
      twitterHandle: "sarahj_invest",
      investmentAmount: "5000",
      sharesOwned: 50,
      investorTier: "gold",
      totalInvestments: 12,
      followers: 2340,
      following: 890,
      verified: true,
      investmentDate: new Date("2024-01-15")
    },
    {
      id: 2,
      userId: "user2",
      propertyId,
      displayName: "Mike Chen",
      profileImage: "https://ui-avatars.com/api/?name=Mike+Chen&background=7C4DFF&color=fff",
      bio: "Investment advisor & property flipper",
      instagramHandle: "mikechenflips",
      linkedinProfile: "mike-chen-investments",
      facebookProfile: "mike.chen.properties",
      investmentAmount: "3500",
      sharesOwned: 35,
      investorTier: "silver",
      totalInvestments: 8,
      followers: 1250,
      following: 420,
      verified: true,
      investmentDate: new Date("2024-01-20")
    },
    {
      id: 3,
      userId: "user3",
      propertyId,
      displayName: "Emma Rodriguez",
      profileImage: "https://ui-avatars.com/api/?name=Emma+Rodriguez&background=FF6B6B&color=fff",
      bio: "First-time investor building wealth",
      instagramHandle: "emma_builds_wealth",
      linkedinProfile: "emma-rodriguez-finance",
      investmentAmount: "1200",
      sharesOwned: 12,
      investorTier: "bronze",
      totalInvestments: 3,
      followers: 580,
      following: 290,
      verified: false,
      investmentDate: new Date("2024-02-01")
    },
    {
      id: 4,
      userId: "user4",
      propertyId,
      displayName: "David Kim",
      profileImage: "https://ui-avatars.com/api/?name=David+Kim&background=4ECDC4&color=fff",
      bio: "Tech CEO & angel investor",
      instagramHandle: "davidkim_ceo",
      linkedinProfile: "david-kim-tech-ceo",
      facebookProfile: "david.kim.tech",
      twitterHandle: "davidkim_invest",
      investmentAmount: "10000",
      sharesOwned: 100,
      investorTier: "platinum",
      totalInvestments: 25,
      followers: 5420,
      following: 1200,
      verified: true,
      investmentDate: new Date("2024-01-10")
    }
  ];

  const displayedInvestors = showAll ? mockInvestors : mockInvestors.slice(0, maxDisplay);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "bg-purple-100 text-purple-800 border-purple-200";
      case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "silver": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <FaInstagram className="w-4 h-4" />;
      case "facebook": return <FaFacebook className="w-4 h-4" />;
      case "linkedin": return <FaLinkedin className="w-4 h-4" />;
      case "twitter": return <FaTwitter className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getSocialUrl = (investor: SocialInvestor, platform: string) => {
    switch (platform) {
      case "instagram": return investor.instagramHandle ? `https://instagram.com/${investor.instagramHandle}` : null;
      case "facebook": return investor.facebookProfile ? `https://facebook.com/${investor.facebookProfile}` : null;
      case "linkedin": return investor.linkedinProfile ? `https://linkedin.com/in/${investor.linkedinProfile}` : null;
      case "twitter": return investor.twitterHandle ? `https://twitter.com/${investor.twitterHandle}` : null;
      default: return null;
    }
  };

  if (compact) {
    return (
      <div className="flex -space-x-2 overflow-hidden">
        {displayedInvestors.map((investor, index) => (
          <TooltipProvider key={investor.id}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                  <AvatarImage src={investor.profileImage} />
                  <AvatarFallback>{investor.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" className="p-3">
                <div className="text-center">
                  <p className="font-semibold">{investor.displayName}</p>
                  <p className="text-sm text-gray-600">${Number(investor.investmentAmount).toLocaleString()} invested</p>
                  <Badge className={`mt-1 ${getTierColor(investor.investorTier)}`}>
                    {investor.investorTier}
                  </Badge>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {mockInvestors.length > maxDisplay && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 border-white text-sm font-medium text-gray-600">
            +{mockInvestors.length - maxDisplay}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Social Investor Network
            <Badge variant="secondary">{mockInvestors.length} investors</Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid gap-4">
          {displayedInvestors.map((investor) => (
            <div key={investor.id} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
              <Avatar className="w-12 h-12">
                <AvatarImage src={investor.profileImage} />
                <AvatarFallback>{investor.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{investor.displayName}</h4>
                  {investor.verified && (
                    <Badge className="bg-blue-100 text-blue-800 px-1 py-0 text-xs">
                      ✓
                    </Badge>
                  )}
                  <Badge className={`${getTierColor(investor.investorTier)} text-xs`}>
                    {investor.investorTier}
                  </Badge>
                </div>
                
                {investor.bio && (
                  <p className="text-sm text-gray-600 mb-2">{investor.bio}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    ${Number(investor.investmentAmount).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {investor.totalInvestments} investments
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {investor.followers.toLocaleString()} followers
                  </span>
                </div>

                {/* Social Media Links */}
                <div className="flex gap-2">
                  {['instagram', 'facebook', 'linkedin', 'twitter'].map((platform) => {
                    const url = getSocialUrl(investor, platform);
                    if (!url) return null;
                    
                    return (
                      <Button
                        key={platform}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => window.open(url, '_blank')}
                      >
                        {getSocialIcon(platform)}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {investor.sharesOwned} shares
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(investor.investmentDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {mockInvestors.length > maxDisplay && !showAll && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="w-full"
            >
              Show {mockInvestors.length - maxDisplay} more investors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}