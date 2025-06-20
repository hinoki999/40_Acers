import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";
import { Share2, Users, Eye, Copy, ExternalLink, TrendingUp, DollarSign, UserCheck } from "lucide-react";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export default function SocialShareModal({ isOpen, onClose, property }: SocialShareModalProps) {
  const [shareStats, setShareStats] = useState({
    linkedinViews: Math.floor(Math.random() * 500 + 100),
    twitterViews: Math.floor(Math.random() * 300 + 50),
    facebookViews: Math.floor(Math.random() * 200 + 25),
    instagramViews: Math.floor(Math.random() * 180 + 20),
    directViews: Math.floor(Math.random() * 150 + 30)
  });
  
  // Mock friend investors data - in production this would come from API
  const [friendInvestors, setFriendInvestors] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      platform: "linkedin",
      investmentAmount: 2500,
      sharesOwned: 12,
      investedDate: "2024-01-15",
      mutualConnections: 8
    },
    {
      id: 2,
      name: "Mike Chen", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      platform: "facebook",
      investmentAmount: 1200,
      sharesOwned: 6,
      investedDate: "2024-01-18",
      mutualConnections: 12
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", 
      platform: "twitter",
      investmentAmount: 800,
      sharesOwned: 4,
      investedDate: "2024-01-20",
      mutualConnections: 5
    },
    {
      id: 4,
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      platform: "instagram", 
      investmentAmount: 1500,
      sharesOwned: 7,
      investedDate: "2024-01-22",
      mutualConnections: 15
    }
  ]);
  
  const { toast } = useToast();

  if (!property) return null;

  const shareUrl = `${window.location.origin}/property/${property.id}`;
  
  // Calculate investment metrics
  const totalPropertyValue = Number(property.propertyValue) || (Number(property.sharePrice) * property.maxShares);
  const fundingProgress = ((property.currentShares / property.maxShares) * 100).toFixed(1);
  const remainingShares = property.maxShares - property.currentShares;
  const minInvestment = Number(property.sharePrice);
  const potentialROI = property.expectedROI || "8-12%";
  
  // Platform-specific content
  const getShareContent = (platform: string) => {
    const baseContent = {
      title: `Investment Opportunity: ${property.address}`,
      location: `${property.city}, ${property.state} ${property.zipcode}`,
      propertyType: property.propertyType,
      value: totalPropertyValue.toLocaleString(),
      sharePrice: property.sharePrice,
      funding: fundingProgress,
      remaining: remainingShares.toLocaleString(),
      roi: potentialROI
    };

    switch (platform) {
      case "linkedin":
        return {
          ...baseContent,
          text: `🏢 40 ACRES: Professional Real Estate Investment Opportunity

📍 ${baseContent.location}
🏡 ${baseContent.propertyType} • $${baseContent.value} total value
💰 Start investing from $${baseContent.sharePrice} per share
📈 Expected ROI: ${baseContent.roi} annually
⏱️ ${baseContent.funding}% funded • ${baseContent.remaining} shares remaining

40 Acres is democratizing real estate investing through fractional ownership. Build wealth through verified properties with blockchain-powered transparent ownership.

🚀 Why 40 Acres?
✅ SEC-compliant fractional ownership
✅ Professional property management
✅ Transparent blockchain records
✅ Start with minimal capital

#40Acres #RealEstateInvestment #FractionalOwnership #PropertyInvestment #WealthBuilding #PropTech`
        };
      
      case "facebook":
        return {
          ...baseContent,
          text: `🏡 40 ACRES: Amazing Real Estate Investment Opportunity!

${property.address}
${baseContent.location}

💡 What makes 40 Acres special:
• ${baseContent.propertyType} property worth $${baseContent.value}
• Start with just $${baseContent.sharePrice} per share through 40 Acres platform
• Expected returns: ${baseContent.roi} per year
• ${baseContent.funding}% already funded by smart investors
• Only ${baseContent.remaining} shares left!

40 Acres is changing how everyday people build wealth through real estate. No need to buy entire properties - own a piece through our platform and earn returns!

🌟 40 Acres Benefits:
✨ Fractional ownership made simple
✨ Professional property management
✨ Blockchain transparency
✨ Community-driven investing

Perfect for anyone looking to diversify with real estate through 40 Acres! 

#40Acres #RealEstate #Investment #PassiveIncome #WealthBuilding #PropTech`
        };
      
      case "twitter":
        return {
          ...baseContent,
          text: `🏡 40 ACRES: New investment drop! 

${property.address}, ${baseContent.location}

💰 $${baseContent.sharePrice}/share via @40Acres
📈 ${baseContent.roi} expected ROI
⚡ ${baseContent.funding}% funded
🎯 ${baseContent.remaining} shares left

40 Acres makes fractional real estate investing simple. Own property, earn returns, build wealth. 🚀

#40Acres #RealEstate #Investment #PropTech #WealthBuilding #FractionalOwnership`
        };
      
      case "instagram":
        return {
          ...baseContent,
          text: `🏡✨ 40 ACRES: NEW INVESTMENT OPPORTUNITY ✨

📍 ${property.address}
🌆 ${baseContent.location}

💰 40 Acres Investment Details:
• Property Value: $${baseContent.value}
• Share Price: $${baseContent.sharePrice}
• Expected ROI: ${baseContent.roi}
• Funding Progress: ${baseContent.funding}%

🎯 Why 40 Acres Matters:
Real estate investing used to require hundreds of thousands. Now with 40 Acres, you can start with just $${baseContent.sharePrice} and own a piece of quality property!

🚀 40 Acres Features:
✅ Fractional ownership platform
✅ Blockchain transparency  
✅ Professional management
✅ Community-driven investing

💪 Build wealth the smart way with 40 Acres - one share at a time.

#40Acres #RealEstateInvesting #PropertyInvestment #WealthBuilding #PassiveIncome #Investment #PropTech #FinancialFreedom #FractionalOwnership`
        };
      
      default:
        return baseContent;
    }
  };

  const totalViews = shareStats.linkedinViews + shareStats.twitterViews + shareStats.facebookViews + shareStats.instagramViews + shareStats.directViews;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Property link copied to clipboard",
    });
  };

  const handleSocialShare = (platform: string) => {
    const content = getShareContent(platform);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(content.text);
    const encodedTitle = encodeURIComponent(content.title);
    
    let url = "";
    let windowFeatures = "width=600,height=500,scrollbars=yes,resizable=yes";

    switch (platform) {
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(content.text.substring(0, 256))}`;
        windowFeatures = "width=520,height=570";
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        windowFeatures = "width=550,height=420";
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        windowFeatures = "width=580,height=400";
        break;
      case "instagram":
        navigator.clipboard.writeText(`${content.text}\n\n${shareUrl}`);
        toast({
          title: "Content Copied!",
          description: "Instagram post content copied to clipboard. Paste it in your Instagram story or post!",
        });
        return;
    }

    if (url) {
      const popup = window.open(url, '_blank', windowFeatures);
      
      if (popup) {
        popup.focus();
      }
      
      setTimeout(() => {
        setShareStats(prev => ({
          ...prev,
          [`${platform}Views`]: prev[`${platform}Views` as keyof typeof prev] + Math.floor(Math.random() * 10 + 1)
        }));
      }, 2000);
      
      toast({
        title: "Shared Successfully!",
        description: `Property shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      });
    }
  };

  const handleShareToAll = () => {
    const platforms = ['linkedin', 'facebook', 'twitter'];
    let popupCount = 0;
    
    platforms.forEach((platform, index) => {
      setTimeout(() => {
        const content = getShareContent(platform);
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(content.text);
        const encodedTitle = encodeURIComponent(content.title);
        
        let url = "";
        let windowFeatures = "";
        
        // Calculate popup positions to avoid overlap
        const offsetX = (index % 3) * 50;
        const offsetY = Math.floor(index / 3) * 50;
        
        switch (platform) {
          case "linkedin":
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(content.text.substring(0, 256))}`;
            windowFeatures = `width=520,height=570,left=${100 + offsetX},top=${100 + offsetY}`;
            break;
          case "facebook":
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
            windowFeatures = `width=580,height=400,left=${200 + offsetX},top=${200 + offsetY}`;
            break;
          case "twitter":
            url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            windowFeatures = `width=550,height=420,left=${300 + offsetX},top=${300 + offsetY}`;
            break;
        }
        
        if (url) {
          const popup = window.open(url, `${platform}_share`, windowFeatures);
          if (popup) {
            popup.focus();
            popupCount++;
          }
        }
      }, index * 500); // Stagger popup opening by 500ms
    });
    
    // Handle Instagram separately (copy to clipboard)
    const instagramContent = getShareContent('instagram');
    navigator.clipboard.writeText(`${instagramContent.text}\n\n${shareUrl}`);
    
    // Update stats for all platforms
    setTimeout(() => {
      setShareStats(prev => ({
        linkedinViews: prev.linkedinViews + Math.floor(Math.random() * 15 + 5),
        facebookViews: prev.facebookViews + Math.floor(Math.random() * 12 + 3),
        twitterViews: prev.twitterViews + Math.floor(Math.random() * 10 + 2),
        instagramViews: prev.instagramViews + Math.floor(Math.random() * 8 + 2),
        directViews: prev.directViews + Math.floor(Math.random() * 8 + 1)
      }));
    }, 3000);
    
    toast({
      title: "40 Acres Property Shared!",
      description: "Property shared to LinkedIn, Facebook, and Twitter. Instagram content copied to clipboard!",
      duration: 5000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Share2 className="text-white" size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Share Property</DialogTitle>
              <p className="text-sm text-neutral-600">Spread the word and track your impact</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Preview */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {property.thumbnailUrl ? (
                  <img
                    src={property.thumbnailUrl}
                    alt={property.address}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{property.address}</h3>
                  <p className="text-sm text-neutral-600">{property.city}, {property.state} {property.zipcode}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Badge variant="secondary">${property.sharePrice}/share</Badge>
                    <Badge className="bg-green-600">{property.propertyType}</Badge>
                    <Badge className="bg-purple-600">{fundingProgress}% funded</Badge>
                    <Badge className="bg-orange-600">{remainingShares} left</Badge>
                  </div>
                </div>
              </div>
              
              {/* Investment Summary */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm text-neutral-900 mb-2">Investment Highlights</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-600">Property Value:</span>
                    <div className="font-semibold">${totalPropertyValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-neutral-600">Expected ROI:</span>
                    <div className="font-semibold text-green-600">{potentialROI}</div>
                  </div>
                  <div>
                    <span className="text-neutral-600">Min Investment:</span>
                    <div className="font-semibold">${minInvestment}</div>
                  </div>
                  <div>
                    <span className="text-neutral-600">Shares Available:</span>
                    <div className="font-semibold">{remainingShares.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friends Who Invested */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck size={20} />
                Friends & Network Who Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friendInvestors.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-neutral-900">{friend.name}</h4>
                          {friend.platform === 'linkedin' && <FaLinkedin className="text-blue-600" size={14} />}
                          {friend.platform === 'facebook' && <FaFacebook className="text-blue-700" size={14} />}
                          {friend.platform === 'twitter' && <FaTwitter className="text-blue-400" size={14} />}
                          {friend.platform === 'instagram' && <FaInstagram className="text-purple-600" size={14} />}
                        </div>
                        <p className="text-xs text-neutral-600">
                          {friend.mutualConnections} mutual connections • Invested {new Date(friend.investedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">${friend.investmentAmount.toLocaleString()}</div>
                      <div className="text-xs text-neutral-600">{friend.sharesOwned} shares</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Total Network Investment:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${friendInvestors.reduce((sum, friend) => sum + friend.investmentAmount, 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Your network owns {friendInvestors.reduce((sum, friend) => sum + friend.sharesOwned, 0)} shares in this property
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Share Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                Social Media Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FaLinkedin className="text-blue-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-600">{shareStats.linkedinViews}</div>
                  <div className="text-xs text-neutral-600">LinkedIn Views</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FaTwitter className="text-blue-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-400">{shareStats.twitterViews}</div>
                  <div className="text-xs text-neutral-600">Twitter Views</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FaFacebook className="text-blue-700 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-blue-700">{shareStats.facebookViews}</div>
                  <div className="text-xs text-neutral-600">Facebook Views</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <ExternalLink className="text-green-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-green-600">{shareStats.directViews}</div>
                  <div className="text-xs text-neutral-600">Direct Views</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Total Reach:</span>
                  <span className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Your sharing has generated significant interest in this property!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Share Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">Share on Social Media</h3>
              <Button
                onClick={handleShareToAll}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 shadow-lg transition-smooth"
              >
                <Share2 size={16} className="mr-2" />
                Share to All Platforms
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => handleSocialShare("linkedin")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-smooth"
              >
                <FaLinkedin size={18} />
                LinkedIn
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 transition-smooth"
              >
                <FaFacebook size={18} />
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare("twitter")}
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 transition-smooth"
              >
                <FaTwitter size={18} />
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare("instagram")}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-smooth"
              >
                <FaInstagram size={18} />
                Instagram
              </Button>
            </div>
            
            {/* Platform-specific previews */}
            <div className="mt-4 space-y-3">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Preview LinkedIn Post Content
                </summary>
                <div className="mt-2 p-3 bg-neutral-50 rounded-lg text-xs font-mono text-neutral-600 whitespace-pre-line">
                  {getShareContent("linkedin").text}
                </div>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Preview Facebook Post Content
                </summary>
                <div className="mt-2 p-3 bg-neutral-50 rounded-lg text-xs font-mono text-neutral-600 whitespace-pre-line">
                  {getShareContent("facebook").text}
                </div>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Preview Twitter Post Content
                </summary>
                <div className="mt-2 p-3 bg-neutral-50 rounded-lg text-xs font-mono text-neutral-600 whitespace-pre-line">
                  {getShareContent("twitter").text}
                </div>
              </details>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900">Direct Link</h3>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-neutral-100 rounded-lg text-sm text-neutral-700 font-mono">
                {shareUrl}
              </div>
              <Button onClick={handleCopyLink} variant="outline">
                <Copy size={16} />
              </Button>
            </div>
          </div>

          {/* Sharing Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <DollarSign size={18} />
                Maximize Your Impact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h5 className="font-medium mb-2">Best Times to Share:</h5>
                  <ul className="space-y-1">
                    <li>• LinkedIn: 9-11 AM, 2-4 PM (weekdays)</li>
                    <li>• Facebook: 1-4 PM (weekdays)</li>
                    <li>• Twitter: 9 AM, 1-3 PM</li>
                    <li>• Instagram: 6-9 AM, 7-9 PM</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Engagement Tips:</h5>
                  <ul className="space-y-1">
                    <li>• Tag relevant investors and friends</li>
                    <li>• Add personal investment insights</li>
                    <li>• Share your investment strategy</li>
                    <li>• Encourage questions and discussions</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">40</span>
                  </div>
                  <strong className="text-orange-800">40 Acres Branding:</strong>
                </div>
                <p className="text-xs text-orange-700">
                  All shared content includes 40 Acres branding and platform-specific messaging. Use "Share to All Platforms" for maximum reach with one click - opens LinkedIn, Facebook, and Twitter simultaneously, plus copies Instagram content to clipboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}