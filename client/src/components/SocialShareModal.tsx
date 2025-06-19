import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";
import { Share2, Users, Eye, Copy, ExternalLink, TrendingUp } from "lucide-react";
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
  const shareText = `🏡 New investment opportunity! ${property.address}, ${property.city}, ${property.state} - Starting at $${property.sharePrice} per share. Build wealth through fractional real estate investing! #RealEstateInvesting #PropertyInvestment #40Acres`;

  const totalViews = shareStats.linkedinViews + shareStats.twitterViews + shareStats.facebookViews + shareStats.directViews;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Property link copied to clipboard",
    });
  };

  const handleSocialShare = (platform: string) => {
    let url = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      // Simulate view increase
      setTimeout(() => {
        setShareStats(prev => ({
          ...prev,
          [`${platform}Views`]: prev[`${platform}Views` as keyof typeof prev] + Math.floor(Math.random() * 10 + 1)
        }));
      }, 2000);
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
                  <p className="text-sm text-neutral-600">{property.city}, {property.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">${property.sharePrice}/share</Badge>
                    <Badge className="bg-green-600">{property.propertyType}</Badge>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleSocialShare("linkedin")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FaLinkedin size={18} />
                Share on LinkedIn
              </Button>
              <Button
                onClick={() => handleSocialShare("twitter")}
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500"
              >
                <FaTwitter size={18} />
                Share on Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800"
              >
                <FaFacebook size={18} />
                Share on Facebook
              </Button>
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
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Sharing Tips</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Tag relevant friends and network connections</li>
                <li>• Share during peak hours (9-11 AM, 2-4 PM)</li>
                <li>• Add personal commentary about the investment opportunity</li>
                <li>• Use hashtags: #RealEstateInvesting #PropertyInvestment #40Acres</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}