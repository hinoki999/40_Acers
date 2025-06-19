import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Filter,
  MapPin,
  Home,
  DollarSign,
  TrendingUp,
  Heart,
  X,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterOptions {
  location: string;
  propertyType: string;
  priceRange: string;
  sortBy: string;
  trending: boolean;
  showOnlyLiked: boolean;
}

interface PropertyFeedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onToggleView: () => void;
  isLoopView: boolean;
}

export default function PropertyFeedFilters({ 
  onFiltersChange, 
  onToggleView, 
  isLoopView 
}: PropertyFeedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    propertyType: "",
    priceRange: "",
    sortBy: "recent",
    trending: false,
    showOnlyLiked: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      location: "",
      propertyType: "",
      priceRange: "",
      sortBy: "recent",
      trending: false,
      showOnlyLiked: false
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = Object.values(filters).filter(value => 
    typeof value === 'string' ? value !== '' : value === true
  ).length - 1; // Subtract 1 for sortBy which always has a value

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={filters.trending ? "default" : "outline"}
              onClick={() => updateFilter('trending', !filters.trending)}
              className="gap-2"
            >
              <TrendingUp size={14} />
              Trending
            </Button>
            
            <Button
              size="sm"
              variant={filters.showOnlyLiked ? "default" : "outline"}
              onClick={() => updateFilter('showOnlyLiked', !filters.showOnlyLiked)}
              className="gap-2"
            >
              <Heart size={14} />
              Liked
            </Button>

            <Button
              size="sm"
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 bg-primary text-white text-xs px-1 py-0">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <Button
            size="sm"
            variant={isLoopView ? "default" : "outline"}
            onClick={onToggleView}
            className="gap-2"
          >
            {isLoopView ? "Grid View" : "Loop View"}
          </Button>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <X size={14} />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card className="mx-4 mb-4 p-4 border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={14} />
                Location
              </label>
              <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any location</SelectItem>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="texas">Texas</SelectItem>
                  <SelectItem value="florida">Florida</SelectItem>
                  <SelectItem value="new-york">New York</SelectItem>
                  <SelectItem value="illinois">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Home size={14} />
                Property Type
              </label>
              <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="mixed-use">Mixed Use</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={14} />
                Share Price
              </label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any price</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-250">$100 - $250</SelectItem>
                  <SelectItem value="250-500">$250 - $500</SelectItem>
                  <SelectItem value="500+">$500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="funding">Most Funded</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="location">By Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-neutral-600">Active filters:</span>
                {filters.location && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin size={12} />
                    {filters.location}
                    <button onClick={() => updateFilter('location', '')}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {filters.propertyType && (
                  <Badge variant="secondary" className="gap-1">
                    <Home size={12} />
                    {filters.propertyType}
                    <button onClick={() => updateFilter('propertyType', '')}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {filters.priceRange && (
                  <Badge variant="secondary" className="gap-1">
                    <DollarSign size={12} />
                    ${filters.priceRange}
                    <button onClick={() => updateFilter('priceRange', '')}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {filters.trending && (
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp size={12} />
                    Trending
                    <button onClick={() => updateFilter('trending', false)}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {filters.showOnlyLiked && (
                  <Badge variant="secondary" className="gap-1">
                    <Heart size={12} />
                    Liked
                    <button onClick={() => updateFilter('showOnlyLiked', false)}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}