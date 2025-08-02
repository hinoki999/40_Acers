import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LayoutGrid, 
  List, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Building, 
  DollarSign,
  Search,
  Eye,
  Users,
  Calendar,
  Star
} from "lucide-react";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import MarketplaceFilters, { type MarketplaceFilters as FilterType } from "@/components/MarketplaceFilters";
import InvestmentModal from "@/components/InvestmentModal";

export default function Marketplace() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInvestment, setShowInvestment] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    district: "",
    propertyType: "",
    investmentLevel: "",
    priceRange: [1000, 1000000],
    dateRange: "",
    sortBy: "recent",
    showOnlyVerified: false,
    showOnlyActive: true,
    minFundingPercentage: 0
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  // Filter and sort properties based on marketplace filters
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(property => 
        property.address.toLowerCase().includes(searchLower) ||
        property.city.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      );
    }

    // District filter (using city as district)
    if (filters.district) {
      filtered = filtered.filter(property => property.city === filters.district);
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    // Investment level filter
    if (filters.investmentLevel) {
      switch (filters.investmentLevel) {
        case 'entry':
          filtered = filtered.filter(property => {
            const price = Number(property.sharePrice);
            return price >= 1000 && price <= 10000;
          });
          break;
        case 'moderate':
          filtered = filtered.filter(property => {
            const price = Number(property.sharePrice);
            return price >= 10000 && price <= 50000;
          });
          break;
        case 'premium':
          filtered = filtered.filter(property => {
            const price = Number(property.sharePrice);
            return price >= 50000 && price <= 100000;
          });
          break;
        case 'exclusive':
          filtered = filtered.filter(property => {
            const price = Number(property.sharePrice);
            return price >= 100000;
          });
          break;
      }
    }

    // Price range filter
    filtered = filtered.filter(property => {
      const price = Number(property.sharePrice);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(property => 
        property.createdAt && new Date(property.createdAt) >= filterDate
      );
    }

    // Verification filter
    if (filters.showOnlyVerified) {
      filtered = filtered.filter(property => property.verificationStatus === 'verified');
    }

    // Active status filter
    if (filters.showOnlyActive) {
      filtered = filtered.filter(property => property.status === 'active');
    }

    // Minimum funding percentage filter
    if (filters.minFundingPercentage > 0) {
      filtered = filtered.filter(property => {
        const fundingPercentage = (property.currentShares / property.maxShares) * 100;
        return fundingPercentage >= filters.minFundingPercentage;
      });
    }

    // Sort properties
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => Number(a.sharePrice) - Number(b.sharePrice));
        break;
      case 'price_high':
        filtered.sort((a, b) => Number(b.sharePrice) - Number(a.sharePrice));
        break;
      case 'funding':
        filtered.sort((a, b) => {
          const aFunding = (a.currentShares / a.maxShares) * 100;
          const bFunding = (b.currentShares / b.maxShares) * 100;
          return bFunding - aFunding;
        });
        break;
      case 'verified':
        filtered.sort((a, b) => {
          if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1;
          if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1;
          return 0;
        });
        break;
      case 'trending':
        // Sort by funding progress and recent activity
        filtered.sort((a, b) => {
          const aScore = (a.currentShares / a.maxShares) * 100;
          const bScore = (b.currentShares / b.maxShares) * 100;
          return bScore - aScore;
        });
        break;
      default: // recent
        filtered.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }

    return filtered;
  }, [properties, filters]);

  const handleInvest = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    }
  };

  const handleShare = (propertyId: number) => {
    console.log('Sharing property:', propertyId);
  };

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      district: "",
      propertyType: "",
      investmentLevel: "",
      priceRange: [1000, 1000000],
      dateRange: "",
      sortBy: "recent",
      showOnlyVerified: false,
      showOnlyActive: true,
      minFundingPercentage: 0
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return value[0] !== 1000 || value[1] !== 1000000;
    if (key === 'showOnlyActive') return value !== true;
    if (key === 'showOnlyVerified') return value === true;
    if (key === 'minFundingPercentage') return value > 0;
    if (key === 'sortBy') return value !== 'recent';
    return Boolean(value);
  }).length;

  const marketplaceStats = useMemo(() => {
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const verifiedProperties = properties.filter(p => p.verificationStatus === 'verified').length;
    const totalValue = properties.reduce((sum, p) => sum + Number(p.propertyValue), 0);
    
    return {
      totalProperties,
      activeProperties,
      verifiedProperties,
      totalValue
    };
  }, [properties]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">40 Acres Marketplace</h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-2">
              Discover, filter, and invest in verified real estate opportunities
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              )}
            </Button>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">
                {marketplaceStats.totalProperties}
              </div>
              <div className="text-xs text-neutral-600">Total Properties</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">
                {marketplaceStats.activeProperties}
              </div>
              <div className="text-xs text-neutral-600">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">
                {marketplaceStats.verifiedProperties}
              </div>
              <div className="text-xs text-neutral-600">Verified Properties</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">
                ${(marketplaceStats.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-neutral-600">Total Value</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <MarketplaceFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-neutral-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
      </div>

      {/* Property Grid/List */}
      {filteredProperties.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-6"
        }>
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onInvest={handleInvest}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Building className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No Properties Found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Investment Modal */}
      {selectedProperty && (
        <InvestmentModal
          isOpen={showInvestment}
          onClose={() => setShowInvestment(false)}
          property={selectedProperty}
        />
      )}
    </div>
  );
}