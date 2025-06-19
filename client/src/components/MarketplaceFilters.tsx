import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Building, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Filter,
  X,
  Search
} from "lucide-react";

export interface MarketplaceFilters {
  search: string;
  district: string;
  propertyType: string;
  investmentLevel: string;
  priceRange: [number, number];
  dateRange: string;
  sortBy: string;
  showOnlyVerified: boolean;
  showOnlyActive: boolean;
  minFundingPercentage: number;
}

interface MarketplaceFiltersProps {
  filters: MarketplaceFilters;
  onFiltersChange: (filters: MarketplaceFilters) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function MarketplaceFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount
}: MarketplaceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const districts = [
    "Downtown", "Westside", "East Village", "Midtown", "SoHo", 
    "Brooklyn Heights", "Beverly Hills", "Santa Monica", "Venice", "Hollywood"
  ];

  const propertyTypes = [
    "Townhouse", "Single Family", "Condo", "Duplex", "Apartment", 
    "Commercial", "Mixed Use", "Loft", "Villa"
  ];

  const investmentLevels = [
    { value: "entry", label: "Entry Level ($1K - $10K)", min: 1000, max: 10000 },
    { value: "moderate", label: "Moderate ($10K - $50K)", min: 10000, max: 50000 },
    { value: "premium", label: "Premium ($50K - $100K)", min: 50000, max: 100000 },
    { value: "exclusive", label: "Exclusive ($100K+)", min: 100000, max: 1000000 }
  ];

  const updateFilter = <K extends keyof MarketplaceFilters>(
    key: K, 
    value: MarketplaceFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Marketplace Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X size={16} className="mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search properties by address, city, or description..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-sm font-medium">District</Label>
            <Select value={filters.district} onValueChange={(value) => updateFilter('district', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any District</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Property Type</Label>
            <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Investment Level</Label>
            <Select value={filters.investmentLevel} onValueChange={(value) => updateFilter('investmentLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Level</SelectItem>
                {investmentLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="funding">Funding Progress</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="verified">Verified First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                min={1000}
                max={1000000}
                step={5000}
                className="w-full"
              />
            </div>

            {/* Listing Date */}
            <div>
              <Label className="text-sm font-medium">Listing Date</Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Funding Percentage */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Minimum Funding: {filters.minFundingPercentage}%
              </Label>
              <Slider
                value={[filters.minFundingPercentage]}
                onValueChange={(value) => updateFilter('minFundingPercentage', value[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Only Verified Properties</Label>
                <Switch
                  checked={filters.showOnlyVerified}
                  onCheckedChange={(checked) => updateFilter('showOnlyVerified', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Only Active Listings</Label>
                <Switch
                  checked={filters.showOnlyActive}
                  onCheckedChange={(checked) => updateFilter('showOnlyActive', checked)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t">
            <Label className="text-sm font-medium mb-2 block">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  <Search size={12} />
                  "{filters.search}"
                  <button onClick={() => updateFilter('search', '')}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filters.district && (
                <Badge variant="outline" className="gap-1">
                  <MapPin size={12} />
                  {filters.district}
                  <button onClick={() => updateFilter('district', '')}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filters.propertyType && (
                <Badge variant="outline" className="gap-1">
                  <Building size={12} />
                  {filters.propertyType}
                  <button onClick={() => updateFilter('propertyType', '')}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filters.investmentLevel && (
                <Badge variant="outline" className="gap-1">
                  <DollarSign size={12} />
                  {investmentLevels.find(l => l.value === filters.investmentLevel)?.label.split(' ')[0]} Level
                  <button onClick={() => updateFilter('investmentLevel', '')}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filters.showOnlyVerified && (
                <Badge variant="outline" className="gap-1">
                  ✓ Verified Only
                  <button onClick={() => updateFilter('showOnlyVerified', false)}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {filters.showOnlyActive && (
                <Badge variant="outline" className="gap-1">
                  Active Only
                  <button onClick={() => updateFilter('showOnlyActive', false)}>
                    <X size={12} />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}