import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MapPin, 
  DollarSign,
  Users,
  TrendingUp,
  Building,
  Eye,
  Clock,
  CheckCircle,
  Video
} from "lucide-react";
import { Property } from "@shared/schema";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

interface CommunityFeedPostProps {
  property: Property;
  onInvest: (propertyId: number) => void;
  onShare: (propertyId: number) => void;
  onLike?: (propertyId: number) => void;
  onComment?: (propertyId: number) => void;
  onSave?: (propertyId: number) => void;
  className?: string;
}

interface PostStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function CommunityFeedPost({ 
  property, 
  onInvest, 
  onShare, 
  onLike, 
  onComment, 
  onSave,
  className = ""
}: CommunityFeedPostProps) {
  const [stats, setStats] = useState<PostStats>({
    likes: Math.floor(Math.random() * 50) + 10,
    comments: Math.floor(Math.random() * 20) + 5,
    shares: Math.floor(Math.random() * 15) + 3,
    views: Math.floor(Math.random() * 500) + 100,
    isLiked: false,
    isSaved: false
  });

  const progressPercentage = (property.currentShares / property.maxShares) * 100;
  const timeAgo = property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently';

  const handleLike = () => {
    setStats(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
    onLike?.(property.id);
  };

  const handleSave = () => {
    setStats(prev => ({
      ...prev,
      isSaved: !prev.isSaved
    }));
    onSave?.(property.id);
  };

  const getOwnerInfo = () => {
    // Mock owner data - in real app, this would come from property owner details
    return {
      name: "Sarah Johnson",
      profileImage: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff",
      verified: true,
      propertyCount: 3
    };
  };

  const owner = getOwnerInfo();

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Post Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={owner.profileImage} />
              <AvatarFallback>{owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-neutral-900">{owner.name}</h4>
                {owner.verified && (
                  <CheckCircle size={16} className="text-blue-600" />
                )}
                <Badge variant="secondary" className="text-xs">
                  Property Owner
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock size={12} />
                Listed {timeAgo}
                <span>•</span>
                <Building size={12} />
                {owner.propertyCount} properties
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {property.status}
            </Badge>
            {property.zoomMeetingUrl && (
              <Badge className="bg-blue-100 text-blue-800">
                <Video size={12} className="mr-1" />
                Virtual Tour
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Property Description */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            {property.address}
          </h3>
          <p className="text-neutral-600 flex items-center gap-1 mb-3">
            <MapPin size={14} />
            {property.city}, {property.state} {property.zipcode}
          </p>
          {property.description && (
            <p className="text-neutral-700 text-sm leading-relaxed mb-3">
              {property.description}
            </p>
          )}
        </div>

        {/* Property Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img
            src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
            alt={property.address}
            className="w-full h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
            }}
          />
          
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-neutral-900 shadow-md">
              {property.propertyType}
            </Badge>
          </div>

          {/* Funding Progress Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {Math.round(progressPercentage)}% Funded
              </span>
              <span>{property.maxShares - property.currentShares} shares left</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gradient-to-r from-neutral-50 to-blue-50 rounded-lg border">
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-900">
              ${Number(property.propertyValue).toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600">Property Value</div>
          </div>
          <div className="text-center">
            <BitcoinPriceDisplay 
              usdPrice={Number(property.sharePrice)} 
              showBoth={false}
              className="text-center"
            />
            <div className="text-xs text-neutral-600 mt-1">Per Token</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {property.squareFootage.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600">Sq Ft</div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between py-3 border-t border-b border-neutral-100">
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {stats.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {stats.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {stats.comments}
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={14} />
              {stats.shares}
            </span>
          </div>
          <div className="text-sm text-neutral-600">
            <span className="flex items-center gap-1">
              <TrendingUp size={14} />
              Trending
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${stats.isLiked ? 'text-red-600' : 'text-neutral-600'}`}
            >
              <Heart size={16} className={stats.isLiked ? 'fill-current' : ''} />
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(property.id)}
              className="flex items-center gap-2 text-neutral-600"
            >
              <MessageCircle size={16} />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(property.id)}
              className="flex items-center gap-2 text-neutral-600"
            >
              <Share2 size={16} />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`flex items-center gap-2 ${stats.isSaved ? 'text-blue-600' : 'text-neutral-600'}`}
            >
              <Bookmark size={16} className={stats.isSaved ? 'fill-current' : ''} />
              Save
            </Button>
          </div>
          
          <Button
            onClick={() => onInvest(property.id)}
            className="bg-[#000000] text-white hover:bg-[#A0522D] transition-all duration-300"
            size="sm"
          >
            <DollarSign size={16} className="mr-1" />
            Invest Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}