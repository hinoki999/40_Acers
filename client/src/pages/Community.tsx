import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PropertyFeed from "@/components/PropertyFeed";
import PropertyFeedFilters from "@/components/PropertyFeedFilters";
import CommunityLeaderboard from "@/components/CommunityLeaderboard";
import CommunityFeedPost from "@/components/CommunityFeedPost";
import InvestmentModal from "@/components/InvestmentModal";
import { Property } from "@shared/schema";
import { 
  TrendingUp, 
  Users, 
  Grid3X3, 
  Play,
  Flame,
  Clock,
  Heart,
  MessageCircle,
  Award,
  Search,
  MapPin,
  Calendar,
  Home,
  DollarSign,
  Filter,
  RefreshCw
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

interface FilterOptions {
  location: string;
  propertyType: string;
  priceRange: string;
  sortBy: string;
  trending: boolean;
  showOnlyLiked: boolean;
}

const mockOpenHouses = [
  {
    id: 1,
    propertyId: 6,
    address: "1909 E Ferry St",
    city: "Detroit",
    state: "MI",
    zipCode: "48207",
    date: "2025-06-28",
    time: "2:00 PM - 4:00 PM",
    propertyType: "Single Family",
    price: "$150,000",
    virtualTour: true,
    host: "Sarah Johnson"
  },
  {
    id: 2,
    propertyId: 7,
    address: "3335 Twenty Third St",
    city: "Detroit",
    state: "MI",
    zipCode: "48208",
    date: "2025-06-29",
    time: "1:00 PM - 3:00 PM",
    propertyType: "Multi-Family",
    price: "$220,000",
    virtualTour: false,
    host: "Michael Chen"
  },
  {
    id: 3,
    propertyId: 8,
    address: "23005 Gratiot Ave",
    city: "Eastpointe",
    state: "MI",
    zipCode: "48021",
    date: "2025-06-30",
    time: "11:00 AM - 1:00 PM",
    propertyType: "Commercial",
    price: "$480,000",
    virtualTour: true,
    host: "Jennifer Davis"
  }
];

const mockFeedPosts = [
  {
    id: 1,
    user: { name: "Alex Thompson", avatar: "AT" },
    timestamp: "2 hours ago",
    content: "Just invested in my 5th property on 40 Acres! The monthly returns are exceeding expectations. Detroit market is looking very promising.",
    likes: 24,
    comments: 8,
    shares: 3,
    propertyId: 6
  },
  {
    id: 2,
    user: { name: "Maria Rodriguez", avatar: "MR" },
    timestamp: "4 hours ago",
    content: "Attended the virtual open house for the Eastpointe property. Amazing potential for appreciation in that area. The host was very knowledgeable!",
    likes: 18,
    comments: 12,
    shares: 5,
    propertyId: 8
  },
  {
    id: 3,
    user: { name: "David Kim", avatar: "DK" },
    timestamp: "6 hours ago",
    content: "Portfolio update: Now diversified across 8 properties in 3 different cities. The fractional ownership model is game-changing for real estate investment.",
    likes: 31,
    comments: 15,
    shares: 9
  },
  {
    id: 4,
    user: { name: "Rachel Green", avatar: "RG" },
    timestamp: "8 hours ago",
    content: "Question: Has anyone invested in commercial properties through 40 Acres? Looking for insights on the risk/reward profile compared to residential.",
    likes: 12,
    comments: 22,
    shares: 2
  }
];

export default function Community() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInvestment, setShowInvestment] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [isLoopView, setIsLoopView] = useState(true);
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    propertyType: "",
    priceRange: "",
    sortBy: "recent",
    trending: false,
    showOnlyLiked: false
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const handleInvest = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    }
  };

  const handleShare = (propertyId: number) => {
    // Implementation for sharing properties
    console.log('Sharing property:', propertyId);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const toggleView = () => {
    setIsLoopView(!isLoopView);
  };

  // Filter and sort properties based on current filters
  const filteredProperties = properties.filter(property => {
    if (filters.location && !property.state.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.propertyType && property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
      return false;
    }
    if (filters.priceRange) {
      const price = Number(property.sharePrice);
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        if (price < Number(min) || price > Number(max)) return false;
      } else {
        if (price < Number(min)) return false;
      }
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return Number(a.sharePrice) - Number(b.sharePrice);
      case 'price-high':
        return Number(b.sharePrice) - Number(a.sharePrice);
      case 'funding':
        return (b.currentShares / b.maxShares) - (a.currentShares / a.maxShares);
      case 'popular':
        return b.currentShares - a.currentShares;
      case 'location':
        return a.city.localeCompare(b.city);
      default:
        return b.id - a.id; // Most recent first
    }
  });

  const trendingProperties = properties
    .filter(p => (p.currentShares / p.maxShares) > 0.5)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="sticky top-0 z-40 bg-white border-b border-neutral-200">
            <div className="px-6 py-4">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <Play size={16} />
                  <span className="hidden sm:inline">Loop Feed</span>
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <Flame size={16} />
                  <span className="hidden sm:inline">Trending</span>
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3X3 size={16} />
                  <span className="hidden sm:inline">Grid View</span>
                </TabsTrigger>
                <TabsTrigger value="openhouses" className="flex items-center gap-2">
                  <Home size={16} />
                  <span className="hidden sm:inline">Open Houses</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Modern Timeline Feed */}
          <TabsContent value="feed" className="mt-0">
            <div className="max-w-2xl mx-auto p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Community Timeline</h2>
                <p className="text-neutral-600">Latest updates from investors and property owners</p>
              </div>
              
              <div className="space-y-6">
                {mockFeedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-[#A52A2A] text-white rounded-full flex items-center justify-center font-semibold">
                          {post.user.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-neutral-900">{post.user.name}</h4>
                            <span className="text-sm text-neutral-500">{post.timestamp}</span>
                          </div>
                          <p className="text-neutral-700 mb-4">{post.content}</p>
                          <div className="flex items-center space-x-6">
                            <button className="flex items-center space-x-2 text-neutral-500 hover:text-[#A52A2A] transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-neutral-500 hover:text-[#A52A2A] transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-neutral-500 hover:text-[#A52A2A] transition-colors">
                              <RefreshCw className="h-4 w-4" />
                              <span className="text-sm">{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-0">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Trending Properties This Week
                </h2>
                <p className="text-neutral-600">
                  Most popular and highly-funded properties in the community
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="text-green-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-neutral-900">
                          {trendingProperties.length}
                        </div>
                        <div className="text-sm text-neutral-600">Hot Properties</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-neutral-900">
                          {properties.reduce((sum, p) => sum + p.currentShares, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-600">Total Investments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Heart className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-neutral-900">
                          {Math.round(
                            (properties.reduce((sum, p) => sum + (p.currentShares / p.maxShares), 0) / properties.length) * 100
                          )}%
                        </div>
                        <div className="text-sm text-neutral-600">Avg. Funding</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trending Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onInvest={handleInvest}
                    onShare={handleShare}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Grid View Tab */}
          <TabsContent value="grid" className="mt-0">
            <PropertyFeedFilters
              onFiltersChange={handleFiltersChange}
              onToggleView={toggleView}
              isLoopView={isLoopView}
            />
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onInvest={handleInvest}
                    onShare={handleShare}
                  />
                ))}
              </div>
              
              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-neutral-400 mb-4">
                    <Grid3X3 size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No Properties Match Your Filters
                  </h3>
                  <p className="text-neutral-600">
                    Try adjusting your search criteria to see more results
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Open Houses Tab */}
          <TabsContent value="openhouses" className="mt-0">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Upcoming Open Houses</h2>
                <p className="text-neutral-600">Schedule virtual or in-person property tours</p>
              </div>
              
              {/* Search by Zip Code */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <Input
                    placeholder="Search by zip code..."
                    value={zipCodeSearch}
                    onChange={(e) => setZipCodeSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpenHouses.map((house) => (
                  <Card key={house.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {house.virtualTour ? "Virtual Tour" : "In-Person"}
                        </Badge>
                        <div className="flex items-center text-sm text-neutral-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {house.zipCode}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{house.address}</CardTitle>
                      <p className="text-neutral-600">{house.city}, {house.state}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-neutral-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {house.date} • {house.time}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-neutral-600">Property Type</p>
                            <p className="font-semibold">{house.propertyType}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-600">Price</p>
                            <p className="font-semibold text-[#A52A2A]">{house.price}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-neutral-600 mb-2">Hosted by {house.host}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-[#A52A2A] hover:bg-[#8B1A1A]">
                              {house.virtualTour ? "Join Virtual Tour" : "RSVP"}
                            </Button>
                            <Button size="sm" variant="outline" className="hover:bg-[#A52A2A] hover:text-white">
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredOpenHouses.length === 0 && (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Open Houses Found</h3>
                  <p className="text-neutral-600">
                    {zipCodeSearch ? `No open houses in zip code ${zipCodeSearch}` : "No upcoming open houses scheduled"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={showInvestment}
        onClose={() => {
          setShowInvestment(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
      />
      
      {/* Footer - Only show on non-feed tabs */}
      {activeTab !== "feed" && <Footer />}
    </div>
  );
}