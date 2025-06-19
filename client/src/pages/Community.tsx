import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyFeed from "@/components/PropertyFeed";
import PropertyFeedFilters from "@/components/PropertyFeedFilters";
import CommunityLeaderboard from "@/components/CommunityLeaderboard";
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
  Award
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import InvestmentModal from "@/components/InvestmentModal";

interface FilterOptions {
  location: string;
  propertyType: string;
  priceRange: string;
  sortBy: string;
  trending: boolean;
  showOnlyLiked: boolean;
}

export default function Community() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInvestment, setShowInvestment] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [isLoopView, setIsLoopView] = useState(true);
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
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Award size={16} />
                  <span className="hidden sm:inline">Leaderboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Loop Feed Tab */}
          <TabsContent value="feed" className="mt-0">
            {filteredProperties.length > 0 ? (
              <PropertyFeed
                properties={filteredProperties}
                onInvest={handleInvest}
                onShare={handleShare}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-2xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No Properties Available
                  </h3>
                  <p className="text-neutral-600">
                    Check back later for new investment opportunities
                  </p>
                </div>
              </div>
            )}
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

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-0">
            <div className="p-6">
              <CommunityLeaderboard />
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
    </div>
  );
}