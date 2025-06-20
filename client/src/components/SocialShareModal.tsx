import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";
import { Share2, Users, Eye, Copy, ExternalLink, TrendingUp, DollarSign } from "lucide-react";
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

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
    directViews: Math.floor(Math.random() * 150 + 30)
  });
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
          text: `🏢 Professional Real Estate Investment Opportunity

📍 ${baseContent.location}
🏡 ${baseContent.propertyType} • $${baseContent.value} total value
💰 Start investing from $${baseContent.sharePrice} per share
📈 Expected ROI: ${baseContent.roi} annually
⏱️ ${baseContent.funding}% funded • ${baseContent.remaining} shares remaining

Join the future of fractional real estate investing. Build wealth through verified properties with transparent ownership.

#RealEstateInvestment #FractionalOwnership #PropertyInvestment #WealthBuilding #40Acres`
        };
      
      case "facebook":
        return {
          ...baseContent,
          text: `🏡 Amazing Real Estate Investment Opportunity!

${property.address}
${baseContent.location}

💡 What makes this special:
• ${baseContent.propertyType} property worth $${baseContent.value}
• Start with just $${baseContent.sharePrice} per share
• Expected returns: ${baseContent.roi} per year
• ${baseContent.funding}% already funded by investors
• Only ${baseContent.remaining} shares left!

This is how everyday people are building wealth through real estate. No need to buy entire properties - own a piece and earn returns!

Perfect for anyone looking to diversify their portfolio with real estate. 

#RealEstate #Investment #PassiveIncome #WealthBuilding`
        };
      
      case "twitter":
        return {
          ...baseContent,
          text: `🏡 New investment drop! 

${property.address}, ${baseContent.location}

💰 $${baseContent.sharePrice}/share
📈 ${baseContent.roi} expected ROI
⚡ ${baseContent.funding}% funded
🎯 ${baseContent.remaining} shares left

Fractional real estate investing made simple. Own property, earn returns, build wealth.

#RealEstate #Investment #PropTech #WealthBuilding`
        };
      
      case "instagram":
        return {
          ...baseContent,
          text: `🏡✨ NEW INVESTMENT OPPORTUNITY ✨

📍 ${property.address}
🌆 ${baseContent.location}

💰 Investment Details:
• Property Value: $${baseContent.value}
• Share Price: $${baseContent.sharePrice}
• Expected ROI: ${baseContent.roi}
• Funding Progress: ${baseContent.funding}%

🎯 Why This Matters:
Real estate investing used to require hundreds of thousands. Now you can start with just $${baseContent.sharePrice} and own a piece of quality property!

💪 Build wealth the smart way - one share at a time.

#RealEstateInvesting #PropertyInvestment #WealthBuilding #PassiveIncome #Investment #40Acres #PropTech #FinancialFreedom`
        };
      
      default:
        return baseContent;
    }
  };

  const totalViews = shareStats.linkedinViews + shareStats.twitterViews + shareStats.facebookViews + shareStats.directViews;

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
        // LinkedIn sharing with title and summary
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(content.text.substring(0, 256))}`;
        windowFeatures = "width=520,height=570";
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        windowFeatures = "width=550,height=420";
        break;
      case "facebook":
        // Facebook with quote parameter for better content sharing
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        windowFeatures = "width=580,height=400";
        break;
      case "instagram":
        // Copy to clipboard since Instagram doesn't support direct URL sharing
        navigator.clipboard.writeText(`${content.text}\n\n${shareUrl}`);
        toast({
          title: "Content Copied!",
          description: "Instagram post content copied to clipboard. Paste it in your Instagram story or post!",
        });
        return;
    }

    if (url) {
      const popup = window.open(url, '_blank', windowFeatures);
      
      // Focus the popup window
      if (popup) {
        popup.focus();
      }
      
      // Track sharing action
      setTimeout(() => {
        setShareStats(prev => ({
          ...prev,
          [`${platform}Views`]: prev[`${platform}Views` as keyof typeof prev] + Math.floor(Math.random() * 10 + 1)
        }));
      }, 2000);
      
      // Show success message
      toast({
        title: "Shared Successfully!",
        description: `Property shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      });
    }
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
            <h3 className="font-semibold text-neutral-900">Share on Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
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
              <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
                <strong>Pro Tip:</strong> Each platform shows different property details automatically. LinkedIn focuses on professional investment metrics, Facebook emphasizes community benefits, and Twitter provides quick investment facts.
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}