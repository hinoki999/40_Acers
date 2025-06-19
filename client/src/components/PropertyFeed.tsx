import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Star, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Users,
  Calendar,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Eye,
  UserPlus,
  Home
} from "lucide-react";
import { Property } from "@shared/schema";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";

interface PropertyFeedProps {
  properties: Property[];
  onInvest: (propertyId: number) => void;
  onShare?: (propertyId: number) => void;
}

interface PropertyInteraction {
  propertyId: number;
  liked: boolean;
  saved: boolean;
  comments: number;
  shares: number;
  views: number;
  rating: number;
}

interface PropertyOwner {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  totalProperties: number;
  followers: number;
  following: boolean;
}

// Mock data for demonstration
const mockOwners: Record<number, PropertyOwner> = {
  5: {
    id: "owner1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    verified: true,
    totalProperties: 12,
    followers: 1500,
    following: false
  }
};

const mockInteractions: Record<number, PropertyInteraction> = {
  5: {
    propertyId: 5,
    liked: false,
    saved: false,
    comments: 24,
    shares: 8,
    views: 1247,
    rating: 4.8
  }
};

export default function PropertyFeed({ properties, onInvest, onShare }: PropertyFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interactions, setInteractions] = useState<Record<number, PropertyInteraction>>(mockInteractions);
  const [owners] = useState<Record<number, PropertyOwner>>(mockOwners);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProperty = properties[currentIndex];
  const currentInteraction = interactions[currentProperty?.id] || {
    propertyId: currentProperty?.id,
    liked: false,
    saved: false,
    comments: 0,
    shares: 0,
    views: 0,
    rating: 0
  };
  const currentOwner = owners[currentProperty?.id];

  const progressPercentage = currentProperty ? (currentProperty.currentShares / currentProperty.maxShares) * 100 : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleLike = () => {
    setInteractions(prev => ({
      ...prev,
      [currentProperty.id]: {
        ...prev[currentProperty.id],
        liked: !prev[currentProperty.id]?.liked
      }
    }));
  };

  const handleSave = () => {
    setInteractions(prev => ({
      ...prev,
      [currentProperty.id]: {
        ...prev[currentProperty.id],
        saved: !prev[currentProperty.id]?.saved
      }
    }));
  };

  const handleShare = () => {
    setInteractions(prev => ({
      ...prev,
      [currentProperty.id]: {
        ...prev[currentProperty.id],
        shares: (prev[currentProperty.id]?.shares || 0) + 1
      }
    }));
    onShare?.(currentProperty.id);
  };

  const handleFollow = () => {
    // Implementation for following property owners
  };

  const requestWalkthrough = (propertyId: number) => {
    setShowWalkthrough(propertyId);
    // Here you would implement the actual walkthrough request logic
    setTimeout(() => setShowWalkthrough(null), 3000);
  };

  if (!currentProperty) return null;

  return (
    <div 
      ref={containerRef}
      className="relative h-screen bg-black overflow-hidden touch-pan-y"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Main Content */}
      <div className="relative w-full h-full">
        {/* Background Media */}
        <div className="absolute inset-0">
          {currentProperty.zoomMeetingUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={currentProperty.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"}
            >
              <source src={currentProperty.zoomMeetingUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={currentProperty.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200"}
              alt={currentProperty.address}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200";
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col gap-4">
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={goToPrevious}
            >
              <ChevronUp size={20} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={goToNext}
            >
              <ChevronDown size={20} />
            </Button>
          </div>
        </div>

        {/* Media Controls */}
        {currentProperty.zoomMeetingUrl && (
          <div className="absolute bottom-20 left-4 z-20 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>
        )}

        {/* Property Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex justify-between items-end">
            {/* Left Side - Property Details */}
            <div className="flex-1 mr-4">
              {/* Owner Info */}
              {currentOwner && (
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage 
                      src={currentOwner.avatar} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentOwner.name)}&background=random`;
                      }}
                    />
                    <AvatarFallback>{currentOwner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{currentOwner.name}</span>
                      {currentOwner.verified && (
                        <Badge className="bg-blue-500 text-white px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="text-white/70 text-sm">
                      {currentOwner.totalProperties} properties • {currentOwner.followers} followers
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={currentOwner.following ? "secondary" : "default"}
                    className="text-xs px-3"
                    onClick={handleFollow}
                  >
                    {currentOwner.following ? "Following" : "Follow"}
                  </Button>
                </div>
              )}

              {/* Property Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <MapPin size={16} />
                  <span className="font-medium">{currentProperty.address}</span>
                </div>
                <div className="text-white/90 text-sm">
                  {currentProperty.city}, {currentProperty.state}
                </div>
                
                {/* Property Type & Stats */}
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-primary text-white">
                    <Home size={12} className="mr-1" />
                    {currentProperty.propertyType}
                  </Badge>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Eye size={12} />
                    {currentInteraction.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Star size={12} />
                    {currentInteraction.rating}
                  </div>
                </div>

                {/* Property Value */}
                <div className="bg-green-500/20 rounded-lg p-3 backdrop-blur-sm mb-3 border border-green-400/30">
                  <div className="flex justify-between items-center">
                    <div className="text-green-300 text-sm font-medium">Property Value</div>
                    <div className="text-green-200 text-lg font-bold">
                      ${Number(currentProperty.propertyValue).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-green-300/80 text-xs mt-1">
                    {currentProperty.squareFootage.toLocaleString()} sq ft
                  </div>
                </div>

                {/* Investment Info */}
                <div className="bg-black/40 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white text-sm">Share Price</div>
                    <BitcoinPriceDisplay 
                      usdPrice={Number(currentProperty.sharePrice)} 
                      className="text-white text-sm font-bold"
                      showBoth={true}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-white/80">Progress</span>
                    <span className="text-white">{currentProperty.currentShares}/{currentProperty.maxShares}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <div className="text-green-400 text-sm font-medium">
                    {Math.round(progressPercentage)}% funded
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Like */}
              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`w-12 h-12 rounded-full ${
                    currentInteraction.liked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={handleLike}
                >
                  <Heart size={20} fill={currentInteraction.liked ? "currentColor" : "none"} />
                </Button>
                <div className="text-white text-xs mt-1">
                  {currentInteraction.liked ? "Liked" : "Like"}
                </div>
              </div>

              {/* Comment */}
              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <MessageCircle size={20} />
                </Button>
                <div className="text-white text-xs mt-1">{currentInteraction.comments}</div>
              </div>

              {/* Share */}
              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={handleShare}
                >
                  <Share2 size={20} />
                </Button>
                <div className="text-white text-xs mt-1">{currentInteraction.shares}</div>
              </div>

              {/* Save */}
              <div className="text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`w-12 h-12 rounded-full ${
                    currentInteraction.saved 
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={handleSave}
                >
                  <Bookmark size={20} fill={currentInteraction.saved ? "currentColor" : "none"} />
                </Button>
                <div className="text-white text-xs mt-1">
                  {currentInteraction.saved ? "Saved" : "Save"}
                </div>
              </div>

              {/* Social Investors */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm font-medium">Recent Investors</span>
                  <span className="text-white/70 text-xs">4 joined</span>
                </div>
                <SocialInvestorNetwork 
                  propertyId={currentProperty.id} 
                  maxDisplay={5}
                  compact={true}
                  showTitle={false}
                />
              </div>

              {/* Invest Button */}
              <Button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                onClick={() => onInvest(currentProperty.id)}
              >
                <TrendingUp size={16} className="mr-2" />
                Invest Now
              </Button>

              {/* Walkthrough Request */}
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs px-3 py-2"
                onClick={() => requestWalkthrough(currentProperty.id)}
                disabled={showWalkthrough === currentProperty.id}
              >
                {showWalkthrough === currentProperty.id ? "Requested!" : "Request Tour"}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex gap-1">
            {properties.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-10">
          <div className="text-white/60 text-xs text-center">
            <ChevronUp size={16} className="mx-auto mb-1" />
            <div>Swipe up</div>
            <div className="my-2">or</div>
            <div>Swipe down</div>
            <ChevronDown size={16} className="mx-auto mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}