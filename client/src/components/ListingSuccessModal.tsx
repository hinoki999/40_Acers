import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Share2, 
  Eye, 
  Copy,
  ExternalLink,
  MapPin,
  Building,
  DollarSign,
  Clock
} from "lucide-react";
import { Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ListingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onViewInCommunity?: () => void;
  onViewInMarketplace?: () => void;
  onShare?: () => void;
}

export default function ListingSuccessModal({
  isOpen,
  onClose,
  property,
  onViewInCommunity,
  onViewInMarketplace,
  onShare
}: ListingSuccessModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const propertyUrl = `${window.location.origin}/properties/${property.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Property link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const text = `Check out this new property investment opportunity: ${property.address} in ${property.city}, ${property.state}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(propertyUrl);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const stats = {
    estimatedViews: Math.floor(Math.random() * 500) + 200,
    targetInvestors: Math.floor(property.maxShares / 10),
    timeToMarket: "Immediate",
    visibility: "Global"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            Property Listed Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              🎉 Congratulations! Your property is now live
            </h3>
            <p className="text-green-700 mb-4">
              Your property has been successfully posted to both the Community Feed and 40 Acres Marketplace
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-600 text-white">
                <TrendingUp size={12} className="mr-1" />
                Live on Community Feed
              </Badge>
              <Badge className="bg-blue-600 text-white">
                <Building size={12} className="mr-1" />
                Active in Marketplace
              </Badge>
            </div>
          </div>

          {/* Property Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                  alt={property.address}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">
                    {property.address}
                  </h4>
                  <p className="text-neutral-600 flex items-center gap-1 mb-2">
                    <MapPin size={14} />
                    {property.city}, {property.state} {property.zipcode}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Property Value:</span>
                      <div className="font-bold text-green-600">
                        ${Number(property.propertyValue).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-600">Token Price:</span>
                      <div className="font-bold text-blue-600">
                        ${property.sharePrice}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-600">Total Tokens:</span>
                      <div className="font-bold text-purple-600">
                        {property.maxShares.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instant Visibility Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-neutral-900">
                  {stats.estimatedViews}+
                </div>
                <div className="text-xs text-neutral-600">Estimated Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-neutral-900">
                  {stats.targetInvestors}
                </div>
                <div className="text-xs text-neutral-600">Target Investors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-neutral-900">
                  {stats.timeToMarket}
                </div>
                <div className="text-xs text-neutral-600">Time to Market</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-neutral-900">
                  {stats.visibility}
                </div>
                <div className="text-xs text-neutral-600">Visibility</div>
              </CardContent>
            </Card>
          </div>

          {/* Auto-populated Tags */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Auto-Generated Tags & Categories</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{property.propertyType}</Badge>
                <Badge variant="outline">{property.city}</Badge>
                <Badge variant="outline">{property.state}</Badge>
                <Badge variant="outline">
                  ${Math.floor(Number(property.propertyValue) / property.squareFootage)}/sq ft
                </Badge>
                <Badge variant="outline">
                  {property.squareFootage.toLocaleString()} sq ft
                </Badge>
                <Badge variant="outline">Investment Ready</Badge>
                <Badge variant="outline">Tokenized</Badge>
                {Number(property.sharePrice) < 100 && (
                  <Badge variant="outline">Entry Level</Badge>
                )}
                {property.zoomMeetingUrl && (
                  <Badge variant="outline">Virtual Tour</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Share Your Listing */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Share Your Listing</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                  <input 
                    type="text" 
                    value={propertyUrl} 
                    readOnly 
                    className="flex-1 bg-transparent text-sm text-neutral-700"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1"
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareOnSocial('twitter')}
                    className="flex items-center gap-1"
                  >
                    Share on Twitter
                    <ExternalLink size={12} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareOnSocial('facebook')}
                    className="flex items-center gap-1"
                  >
                    Share on Facebook
                    <ExternalLink size={12} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareOnSocial('linkedin')}
                    className="flex items-center gap-1"
                  >
                    Share on LinkedIn
                    <ExternalLink size={12} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onViewInCommunity}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
            >
              <Users size={16} className="mr-2" />
              View in Community Feed
            </Button>
            <Button
              onClick={onViewInMarketplace}
              variant="outline"
              className="flex-1"
            >
              <Building size={16} className="mr-2" />
              View in Marketplace
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="flex-1"
            >
              <Share2 size={16} className="mr-2" />
              Share Property
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}