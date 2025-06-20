import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Award, 
  MapPin,
  Clock,
  Users,
  ThumbsUp,
  Send,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getQueryFn, apiRequest } from "@/lib/queryClient";

interface CommunityPost {
  id: number;
  authorId: string;
  author: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    communityRank: number;
    location?: string;
  };
  type: string;
  title: string;
  content: string;
  propertyId?: number;
  property?: {
    address: string;
    city: string;
    state: string;
    thumbnailUrl?: string;
  };
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isLiked?: boolean;
}

interface SocialFeedProps {
  userId?: string;
  filterType?: string;
}

export default function SocialFeed({ userId, filterType = "all" }: SocialFeedProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/community/feed", filterType, userId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/community/stats"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => 
      apiRequest(`/api/community/posts/${postId}/like`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/feed"] });
    },
  });

  const sharePostMutation = useMutation({
    mutationFn: async (postId: number) => 
      apiRequest(`/api/community/posts/${postId}/share`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/feed"] });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; type: string }) => 
      apiRequest("/api/community/posts", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }),
    onSuccess: () => {
      setNewPostContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/community/feed"] });
    },
  });

  const handleLike = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  const handleShare = (postId: number) => {
    sharePostMutation.mutate(postId);
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPostMutation.mutate({
        content: newPostContent,
        type: "general"
      });
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "milestone":
        return <Award className="h-4 w-4 text-yellow-600" />;
      case "property_update":
        return <MapPin className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-neutral-600" />;
    }
  };

  const getPostTypeBadge = (type: string) => {
    const badges = {
      investment: { label: "Investment", color: "bg-green-100 text-green-800" },
      milestone: { label: "Milestone", color: "bg-yellow-100 text-yellow-800" },
      property_update: { label: "Property Update", color: "bg-blue-100 text-blue-800" },
      tip: { label: "Investment Tip", color: "bg-purple-100 text-purple-800" },
    };
    
    const badge = badges[type as keyof typeof badges] || { label: "Update", color: "bg-neutral-100 text-neutral-800" };
    return <Badge className={`${badge.color} text-xs`}>{badge.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-32"></div>
                  <div className="h-3 bg-neutral-200 rounded w-24"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-32 bg-neutral-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      {userStats && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Community Impact</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userStats.totalMembers}</div>
                <div className="text-sm text-blue-700">Active Investors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">${userStats.totalInvested?.toLocaleString()}</div>
                <div className="text-sm text-green-700">Community Invested</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userStats.propertiesFunded}</div>
                <div className="text-sm text-purple-700">Properties Funded</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Share your investment insights or ask the community..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="outline">💡 Investment Tip</Badge>
                <Badge variant="outline">📈 Market Update</Badge>
                <Badge variant="outline">❓ Question</Badge>
              </div>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || createPostMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post: CommunityPost) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.profileImageUrl} />
                    <AvatarFallback>
                      {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">
                        {post.author.firstName} {post.author.lastName}
                      </h4>
                      {post.author.communityRank <= 10 && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Top {post.author.communityRank}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                      <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      {post.author.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{post.author.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPostTypeBadge(post.type)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  {getPostTypeIcon(post.type)}
                  <span>{post.title}</span>
                </h3>
                <p className={`text-neutral-700 ${expandedPost === post.id ? '' : 'line-clamp-3'}`}>
                  {post.content}
                </p>
                {post.content.length > 200 && (
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="text-blue-600 text-sm hover:underline mt-2"
                  >
                    {expandedPost === post.id ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* Property Card if applicable */}
              {post.property && (
                <Card className="bg-neutral-50 border-neutral-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"}
                        alt={post.property.address}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{post.property.address}</h4>
                        <p className="text-neutral-600 text-xs">
                          {post.property.city}, {post.property.state}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              {/* Interaction Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-600' : 'text-neutral-600'}`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likesCount}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-neutral-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentsCount}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 text-neutral-600"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{post.sharesCount}</span>
                  </Button>
                </div>
                
                <div className="text-xs text-neutral-500">
                  {post.likesCount > 0 && `${post.likesCount} likes`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {posts.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}