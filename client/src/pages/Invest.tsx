import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, MapPin, DollarSign, HelpCircle, Crown } from "lucide-react";
import InvestmentModal from "@/components/InvestmentModal";
import SocialShareModal from "@/components/SocialShareModal";
import CurrencyToggle from "@/components/CurrencyToggle";
import InvestorTour from "@/components/InvestorTour";
import AuthModals from "@/components/AuthModals";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Footer";

export default function Invest() {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [location, setLocation] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInvestment, setShowInvestment] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showInvestorTour, setShowInvestorTour] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'BTC'>('USD');
  const [isGoldMember, setIsGoldMember] = useState(false);
  const [showGoldUpgrade, setShowGoldUpgrade] = useState(false);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const handleInvest = (propertyId: number) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    const property = (properties as Property[]).find((p: Property) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    }
  };

  const handleShare = (propertyId: number) => {
    const property = (properties as Property[]).find((p: Property) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowSocialShare(true);
    }
  };

  const filteredProperties = (properties as Property[]).filter((property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === "all" || property.propertyType === propertyType;
    
    const matchesLocation = location === "all" || property.state === location;
    
    const price = Number(property.sharePrice);
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "low" && price < 100) ||
                        (priceRange === "medium" && price >= 100 && price < 500) ||
                        (priceRange === "high" && price >= 500);
    
    return matchesSearch && matchesType && matchesLocation && matchesPrice;
  });

  const totalInvestmentValue = (properties as Property[]).reduce((sum, property) => {
    return sum + (Number(property.propertyValue) || 0);
  }, 0);

  const totalProperties = (properties as Property[]).length;
  const avgFundingProgress = totalProperties > 0 ? (properties as Property[]).reduce((sum, property) => {
    return sum + ((property.currentShares / property.maxShares) * 100);
  }, 0) / totalProperties : 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-12 sm:py-16 safe-area-inset">
        <div className="container-mobile max-w-7xl mx-auto">
          <div className="text-center space-mobile">
            <h1 className="heading-responsive font-bold mb-4">Investment Opportunities</h1>
            <p className="text-responsive text-white mb-6 sm:mb-8 max-w-3xl mx-auto">
              Discover fractional real estate investments and build your portfolio with verified properties
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setShowInvestorTour(true)}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-6 py-3 bg-[#000000]"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                New to Investing? Take the Tour
              </Button>
              {!isGoldMember && (
                <Button 
                  onClick={() => setShowGoldUpgrade(true)}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold px-6 py-3 shadow-lg"
                >
                  <Crown className="h-5 w-5 mr-2 text-black" />
                  Upgrade to Gold
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <DollarSign className="mx-auto mb-4 text-yellow-300" size={32} />
                  <div className="text-2xl font-bold text-white">${totalInvestmentValue.toLocaleString()}</div>
                  <div className="text-white">Total Investment Value</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-4 text-green-300" size={32} />
                  <div className="text-2xl font-bold text-white">{totalProperties}</div>
                  <div className="text-white">Available Properties</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto mb-4 text-blue-300" size={32} />
                  <div className="text-2xl font-bold text-white">{avgFundingProgress.toFixed(0)}%</div>
                  <div className="text-white">Avg. Funding Progress</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 sm:py-8 bg-white shadow-sm">
        <div className="container-mobile max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Mobile-first search section */}
            <div className="w-full">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <Input
                  placeholder="Search by location or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 sm:h-10"
                />
              </div>
            </div>
            
            {/* Mobile filters section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
              </div>
              
              <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 order-1 sm:order-2">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full sm:w-40 h-12 sm:h-10 hover:bg-[#A52A2A] hover:text-white transition-colors">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="hover:bg-[#A52A2A] hover:text-white">All Types</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Condo">Condominium</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-40 h-12 sm:h-10 hover:bg-[#A52A2A] hover:text-white transition-colors">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="hover:bg-[#A52A2A] hover:text-white">All Prices</SelectItem>
                  <SelectItem value="low">Less than $5,000</SelectItem>
                  <SelectItem value="medium">$5,001-$100,000</SelectItem>
                  <SelectItem value="high">$101,000-$500,000</SelectItem>
                  <SelectItem value="premium">$1M+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full sm:w-40 h-12 sm:h-10 hover:bg-[#A52A2A] hover:text-white transition-colors">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="hover:bg-[#A52A2A] hover:text-white">All Locations</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>
          </div>
          
          {filteredProperties.length !== (properties as Property[]).length && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <Badge variant="secondary" className="w-fit">
                {filteredProperties.length} of {(properties as Property[]).length} properties
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-fit h-10"
                onClick={() => {
                  setSearchTerm("");
                  setPropertyType("all");
                  setPriceRange("all");
                  setLocation("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8 sm:py-12">
        <div className="container-mobile max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-56 bg-gradient-to-r from-neutral-200 to-neutral-300"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                      <div className="h-20 bg-neutral-200 rounded"></div>
                      <div className="h-10 bg-neutral-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                {searchTerm || propertyType !== "all" || priceRange !== "all" || location !== "all" 
                  ? "No Properties Found" 
                  : "No Properties Available"
                }
              </h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                {searchTerm || propertyType !== "all" || priceRange !== "all" || location !== "all"
                  ? "Try adjusting your search criteria or filters to find more properties."
                  : "Check back soon for new investment opportunities!"
                }
              </p>
              {searchTerm || propertyType !== "all" || priceRange !== "all" || location !== "all" ? (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setPropertyType("all");
                    setPriceRange("all");
                    setLocation("all");
                  }}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90"
                  size="lg"
                >
                  Clear All Filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onInvest={() => handleInvest(property.id)}
                  onShare={() => handleShare(property.id)}
                  isGoldMember={isGoldMember}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <InvestmentModal
        isOpen={showInvestment}
        onClose={() => {
          setShowInvestment(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
      />
      <SocialShareModal
        isOpen={showSocialShare}
        onClose={() => {
          setShowSocialShare(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
      />
      <InvestorTour
        isOpen={showInvestorTour}
        onClose={() => setShowInvestorTour(false)}
        onComplete={() => setShowInvestorTour(false)}
        onStartInvesting={() => {
          setShowInvestorTour(false);
        }}
      />

      {/* Gold Member Upgrade Dialog */}
      {showGoldUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Gold Member</h3>
              <p className="text-gray-600 mb-4">
                Access exclusive properties with blockchain protection of ownership and advanced Web3 features.
              </p>
              <div className="text-3xl font-bold text-yellow-600 mb-4">$99/month</div>
              <div className="space-y-2 mb-6">
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold shadow-lg"
                  onClick={() => {
                    setIsGoldMember(true);
                    setShowGoldUpgrade(false);
                  }}
                >
                  Upgrade Now
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-black text-black hover:bg-gray-200 hover:text-black"
                  onClick={() => setShowGoldUpgrade(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Footer />
    </div>
  );
}