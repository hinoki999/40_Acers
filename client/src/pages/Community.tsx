import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  Search,
  MapPin,
  Calendar,
  Home,
  DollarSign,
  RefreshCw
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

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
    content: "Thanks to 40 Acres, I was able to start my real estate investment journey with just $100. Now I own shares in 3 different properties!",
    likes: 18,
    comments: 12,
    shares: 5,
    propertyId: null
  },
  {
    id: 3,
    user: { name: "David Kim", avatar: "DK" },
    timestamp: "6 hours ago",
    content: "The transparency on this platform is incredible. I can track my investments in real-time and see exactly how my money is working for me.",
    likes: 31,
    comments: 15,
    shares: 8,
    propertyId: null
  },
  {
    id: 4,
    user: { name: "Sarah Johnson", avatar: "SJ" },
    timestamp: "8 hours ago",
    content: "Just received my first dividend payment! $47 from my Detroit property investment. Small steps but it's working! 🏡💰",
    likes: 42,
    comments: 23,
    shares: 12,
    propertyId: 6
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("feed");
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const handleInvest = (property: Property) => {
    setSelectedProperty(property);
    setIsInvestmentModalOpen(true);
  };

  const filteredOpenHouses = mockOpenHouses.filter(house => {
    if (zipCodeSearch) {
      return house.zipCode.includes(zipCodeSearch);
    }
    return true;
  });

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

          {/* Social Media Timeline Feed */}
          <TabsContent value="feed" className="mt-0">
            <div className="bg-gray-50 min-h-screen">
              {/* Header */}
              <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Community Timeline</h1>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Timeline Feed */}
              <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="space-y-4">
                  {/* Community Activity Posts */}
                  {mockFeedPosts.map((post) => (
                    <Card key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        {/* Post Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {post.user.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                              <Badge variant="secondary" className="text-xs">Investor</Badge>
                            </div>
                            <p className="text-sm text-gray-500">{post.timestamp}</p>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-900 mb-4 leading-relaxed">{post.content}</p>

                        {/* Property Card if associated */}
                        {post.propertyId && properties.find(p => p.id === post.propertyId) && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                            {(() => {
                              const property = properties.find(p => p.id === post.propertyId);
                              return property ? (
                                <div className="flex items-start gap-3">
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                    <Home className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">{property.address}</h4>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3" />
                                      {property.city}, {property.state}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm">
                                        <span className="font-semibold text-green-600">${Number(property.propertyValue).toLocaleString()}</span>
                                        <span className="text-gray-500 ml-2">{property.propertyType}</span>
                                      </div>
                                      <Button 
                                        size="sm" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                        onClick={() => handleInvest(property)}
                                      >
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        Invest Now
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm">{post.shares}</span>
                            </button>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Property Showcase Posts */}
                  {properties.slice(0, 5).map((property) => (
                    <Card key={`property-${property.id}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        {/* System Post Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">40 Acres Platform</h3>
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">New Listing</Badge>
                            </div>
                            <p className="text-sm text-gray-500">Just now</p>
                          </div>
                        </div>

                        {/* Property Showcase */}
                        <div className="mb-4">
                          <p className="text-gray-900 mb-4">🏡 New investment opportunity now available! This {property.propertyType.toLowerCase()} property offers excellent rental income potential in a growing market.</p>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Home className="w-10 h-10 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 mb-1 text-lg">{property.address}</h4>
                                <p className="text-gray-600 flex items-center gap-1 mb-3">
                                  <MapPin className="w-4 h-4" />
                                  {property.city}, {property.state} {property.zipcode}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">${Number(property.propertyValue).toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Property Value</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">${Number(property.sharePrice).toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Price per Share</div>
                                  </div>
                                </div>

                                {/* Investment Progress */}
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Funding Progress</span>
                                    <span>{Math.round((property.currentShares / property.maxShares) * 100)}% Complete</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${(property.currentShares / property.maxShares) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <Button 
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5"
                                  onClick={() => handleInvest(property)}
                                >
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Invest Now - Starting at $10
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{Math.floor(Math.random() * 50) + 10}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{Math.floor(Math.random() * 20) + 5}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-sm">{Math.floor(Math.random() * 15) + 2}</span>
                            </button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center py-8">
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Load More Posts
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Trending Properties */}
          <TabsContent value="trending">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Trending Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.filter(p => (p.currentShares / p.maxShares) > 0.3).map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onInvest={() => handleInvest(property)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Grid View */}
          <TabsContent value="grid">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">All Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onInvest={() => handleInvest(property)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Open Houses */}
          <TabsContent value="openhouses">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Open Houses</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by zip code..."
                      value={zipCodeSearch}
                      onChange={(e) => setZipCodeSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpenHouses.map((house) => (
                  <Card key={house.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{house.address}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {house.city}, {house.state} {house.zipCode}
                          </p>
                        </div>
                        <Badge variant="secondary">{house.propertyType}</Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{house.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{house.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Hosted by {house.host}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#A52A2A]">{house.price}</span>
                        <div className="flex gap-2">
                          {house.virtualTour && (
                            <Badge className="bg-blue-100 text-blue-800">Virtual Tour</Badge>
                          )}
                          <Button size="sm" className="bg-[#A52A2A] hover:bg-[#8B1A1B]">
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
}