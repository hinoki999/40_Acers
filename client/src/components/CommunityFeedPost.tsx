import { useState, useEffect, useRef } from "react";
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
  isTikTokStyle?: boolean;
  isActive?: boolean;
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
  className = "",
  isTikTokStyle = false,
  isActive = false
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

  const videoRef = useRef<HTMLDivElement>(null);

  // Add touch gestures and keyboard navigation for TikTok-style
  useEffect(() => {
    if (!isTikTokStyle || !videoRef.current) return;

    const element = videoRef.current;
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const diffY = startY - currentY;
      const parent = element.parentElement?.parentElement;
      
      if (Math.abs(diffY) > 50 && parent) {
        if (diffY > 0) {
          // Swipe up - next video
          parent.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        } else {
          // Swipe down - previous video
          parent.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const parent = element.parentElement?.parentElement;
      if (!parent) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        parent.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        parent.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTikTokStyle]);

  // TikTok-style full-screen layout
  if (isTikTokStyle) {
    return (
      <div ref={videoRef} className={`relative w-full h-full bg-black text-white ${className}`}>
        {/* Background Property Image */}
        <div className="absolute inset-0">
          <img
            src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1920"}
            alt={property.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=1920";
            }}
          />
          {/* Dark overlay for text readability with 35% black overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top Section - User Info */}
          <div className="flex-shrink-0 p-4 pt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarImage src={owner.profileImage} />
                  <AvatarFallback className="bg-black text-white">
                    {owner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{owner.name}</h4>
                    {owner.verified && (
                      <CheckCircle size={16} className="text-blue-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/80">
                    {property.city}, {property.state}
                  </div>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {property.propertyType}
              </Badge>
            </div>
          </div>

          {/* Middle Section - Spacer */}
          <div className="flex-1" />

          {/* Bottom Section - Property Details & Actions */}
          <div className="flex-shrink-0 p-4 pb-8">
            {/* Property Info */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {property.address}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {property.description || `Stunning ${property.propertyType.toLowerCase()} in ${property.city}`}
              </p>
              
              {/* Investment Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-white">
                    ${Number(property.propertyValue).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/80">Property Value</div>
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <BitcoinPriceDisplay 
                    usdPrice={Number(property.sharePrice)} 
                    showBoth={false}
                    className="text-center text-white"
                  />
                  <div className="text-xs text-white/80">Per Token</div>
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-green-400">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-xs text-white/80">Funded</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex flex-col items-center gap-1 p-2 h-auto bg-black/40 backdrop-blur-sm hover:bg-black/60 ${
                    stats.isLiked ? 'text-red-400' : 'text-white'
                  }`}
                >
                  <Heart size={20} className={stats.isLiked ? 'fill-current' : ''} />
                  <span className="text-xs">{stats.likes}</span>
                </Button>

                {/* Comment Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment?.(property.id)}
                  className="flex flex-col items-center gap-1 p-2 h-auto bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
                >
                  <MessageCircle size={20} />
                  <span className="text-xs">{stats.comments}</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(property.id)}
                  className="flex flex-col items-center gap-1 p-2 h-auto bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
                >
                  <Share2 size={20} />
                  <span className="text-xs">{stats.shares}</span>
                </Button>

                {/* Save Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className={`flex flex-col items-center gap-1 p-2 h-auto bg-black/40 backdrop-blur-sm hover:bg-black/60 ${
                    stats.isSaved ? 'text-blue-400' : 'text-white'
                  }`}
                >
                  <Bookmark size={20} className={stats.isSaved ? 'fill-current' : ''} />
                  <span className="text-xs">Save</span>
                </Button>
              </div>

              {/* Invest Button */}
              <Button
                onClick={() => onInvest(property.id)}
                className="bg-white text-black hover:bg-white/90 font-semibold px-6 py-3 rounded-full"
                size="lg"
              >
                <DollarSign size={18} className="mr-1" />
                Invest Now
              </Button>
            </div>
          </div>
        </div>

        {/* Side Action Bar (right side) */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          <div className="text-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 mb-2">
              <Eye size={20} className="text-white" />
            </div>
            <div className="text-white text-xs">{stats.views}</div>
          </div>
          {property.zoomMeetingUrl && (
            <div className="text-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 mb-2">
                <Video size={20} className="text-white" />
              </div>
              <div className="text-white text-xs">Tour</div>
            </div>
          )}
        </div>

        {/* Navigation Hints */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 animate-pulse">
            <div className="text-xs mb-1">Swipe up for next</div>
            <div className="flex flex-col items-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mb-1" />
              <div className="w-1 h-3 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular card layout for non-TikTok style
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