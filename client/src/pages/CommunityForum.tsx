import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, ThumbsUp, Reply, Users, TrendingUp, Search, Plus, Filter, Star, Clock } from "lucide-react";

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  category: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
}

interface ForumReply {
  id: number;
  postId: number;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export default function CommunityForum() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 1,
      title: "Best strategies for first-time real estate investors?",
      content: "I'm new to real estate investing and looking for advice on getting started with fractional ownership. What should I look for in properties?",
      author: "Sarah Chen",
      authorInitials: "SC",
      timestamp: "2 hours ago",
      category: "Getting Started",
      likes: 24,
      replies: 8,
      isLiked: false,
      isPinned: true,
      tags: ["beginner", "strategy", "advice"]
    },
    {
      id: 2,
      title: "Market analysis: Multi-family properties vs single-family",
      content: "I've been comparing returns between multi-family and single-family properties. Here's my analysis of the current market trends...",
      author: "Michael Rodriguez",
      authorInitials: "MR",
      timestamp: "4 hours ago",
      category: "Market Analysis",
      likes: 31,
      replies: 12,
      isLiked: true,
      isPinned: false,
      tags: ["analysis", "market-trends", "comparison"]
    },
    {
      id: 3,
      title: "Tax implications of fractional real estate ownership",
      content: "Can someone explain the tax benefits and considerations when investing in tokenized real estate? I'm particularly interested in depreciation...",
      author: "Jennifer Thompson",
      authorInitials: "JT",
      timestamp: "6 hours ago",
      category: "Legal & Tax",
      likes: 19,
      replies: 6,
      isLiked: false,
      isPinned: false,
      tags: ["taxes", "legal", "depreciation"]
    },
    {
      id: 4,
      title: "Property in Austin performing well - 12% annual return",
      content: "Just wanted to share that the Austin townhouse property I invested in 6 months ago is performing exceptionally well. Consistent rental income and appreciation!",
      author: "David Park",
      authorInitials: "DP",
      timestamp: "1 day ago",
      category: "Success Stories",
      likes: 42,
      replies: 15,
      isLiked: false,
      isPinned: false,
      tags: ["success", "austin", "returns"]
    }
  ]);

  const [replies] = useState<ForumReply[]>([
    {
      id: 1,
      postId: 1,
      content: "Start with properties in stable markets and diversify across different locations. Don't put all your money in one property!",
      author: "Alex Johnson",
      authorInitials: "AJ",
      timestamp: "1 hour ago",
      likes: 8,
      isLiked: false
    },
    {
      id: 2,
      postId: 1,
      content: "Research the property management company thoroughly. Good management is crucial for consistent returns.",
      author: "Lisa Wang",
      authorInitials: "LW",
      timestamp: "30 minutes ago",
      likes: 12,
      isLiked: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General Discussion",
    tags: ""
  });

  const { toast } = useToast();

  const categories = ["All", "Getting Started", "Market Analysis", "Legal & Tax", "Success Stories", "Property Reviews", "General Discussion"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLikePost = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleNewPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const post: ForumPost = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: "You",
      authorInitials: "YU",
      timestamp: "Just now",
      category: newPost.category,
      likes: 0,
      replies: 0,
      isLiked: false,
      isPinned: false,
      tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: "", content: "", category: "General Discussion", tags: "" });
    setShowNewPost(false);
    
    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Investment Community Forum</h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Connect with fellow investors, share insights, and learn from experienced real estate professionals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-4 text-purple-300" size={32} />
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-purple-100">Active Members</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="mx-auto mb-4 text-blue-300" size={32} />
                  <div className="text-2xl font-bold">1,423</div>
                  <div className="text-purple-100">Discussion Posts</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-4 text-green-300" size={32} />
                  <div className="text-2xl font-bold">$2.1M</div>
                  <div className="text-purple-100">Community Investments</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowNewPost(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  New Discussion
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* New Post Modal */}
          {showNewPost && (
            <Card className="mb-8 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus size={20} />
                  Create New Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="What's your discussion about?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or insights..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    placeholder="investing, strategy, beginner"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleNewPost} className="bg-purple-600 hover:bg-purple-700">
                    Post Discussion
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Forum Posts */}
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <Card key={post.id} className={`hover:shadow-lg transition-shadow ${post.isPinned ? 'border-2 border-yellow-300 bg-yellow-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && <Star className="text-yellow-500" size={16} />}
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                          <Clock size={14} />
                          {post.timestamp}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{post.title}</h3>
                      <p className="text-neutral-600 mb-4">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1 ${post.isLiked ? 'text-purple-600' : 'text-neutral-600'}`}
                          >
                            <ThumbsUp size={16} className={post.isLiked ? 'fill-current' : ''} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-neutral-600">
                            <Reply size={16} />
                            {post.replies} replies
                          </Button>
                        </div>
                        
                        <div className="text-sm text-neutral-600">
                          by <span className="font-medium">{post.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="mx-auto mb-4 text-neutral-400" size={48} />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No discussions found</h3>
              <p className="text-neutral-600 mb-6">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filters"
                  : "Be the first to start a discussion!"
                }
              </p>
              <Button 
                onClick={() => setShowNewPost(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Discussion
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}