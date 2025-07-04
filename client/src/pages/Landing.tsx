import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, TrendingUp, Users, Smartphone, Download, Zap } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import InvestmentModal from "@/components/InvestmentModal";
import SocialShareModal from "@/components/SocialShareModal";
import InvestorNetwork from "@/components/InvestorNetwork";
import CurrencyToggle from "@/components/CurrencyToggle";
import { Property } from "@shared/schema";
import logoImage from "@/assets/40-acres-logo.png";
import { useAuth } from "@/hooks/useAuth";

interface LandingProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function Landing({ onShowLogin, onShowRegister }: LandingProps) {
  const { isAuthenticated } = useAuth();
  const [showInvestment, setShowInvestment] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'BTC'>('USD');

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const handleInvest = (propertyId: number) => {
    // Always require login for invest buttons on homepage
    onShowRegister();
  };

  const handleShare = (propertyId: number) => {
    const property = (properties as Property[]).find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowSocialShare(true);
    }
  };

  const handleShowLogin = () => {
    onShowLogin();
  };

  const handleShowRegister = () => {
    onShowRegister();
  };

  return (
    <div className="min-h-screen-mobile">
      {/* Hero Section */}
      <section className="py-10 md:py-20 bg-black relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: "url('/attached_assets/eleg_home_1750483966934.jpeg')"
          }}
        ></div>
        <div className="absolute inset-0 opacity-50 text-[#ffffff] bg-[#000000]"></div>
        <div className="container-mobile relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-white order-2 lg:order-1 relative z-20">
              <div className="text-left mb-6 md:mb-8">
                <h1 className="font-bold text-2xl md:text-4xl lg:text-[48px] text-left leading-tight text-white drop-shadow-lg">
                  Peer to Peer<br/>Investment Marketplace
                </h1>
              </div>
              <p className="text-base md:text-xl text-white mb-6 md:mb-8 leading-relaxed text-left drop-shadow-lg">
                Build wealth through fractional real estate investing. Own shares in rental properties and earn passive income without the hassle of management.
              </p>

            </div>
            <div className="relative order-1 lg:order-2">
              <Card className="p-4 md:p-8 shadow-2xl card-mobile">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-neutral-900">Passive Income</h3>
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <DollarSign className="text-white" />
                  </div>
                </div>
                <p className="text-neutral-600 mb-6">
                  Receive weekly income from rental properties, hassle-free. No management worries, just returns
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Withdraw Funds</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">$2,500</div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-0"></div>
                  </div>
                  <Button disabled className="w-full bg-gray-400 text-white cursor-not-allowed">
                    Withdraw
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Property Listings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-neutral-900">Featured Properties</h2>
            </div>
            <p className="text-xl text-neutral-600">
              Discover profitable rental properties and start building your portfolio
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">No Properties Yet</h3>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Be the first to list an investment property and start building wealth with the community!
              </p>
              <Button
                onClick={handleShowLogin}
                className="bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90"
                size="lg"
              >
                List Your Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onInvest={() => handleInvest(property.id)}
                  onShare={() => handleShare(property.id)}
                  isAuthenticated={isAuthenticated}
                  onShowRegister={onShowRegister}
                />
              ))}
            </div>
            )}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-12 md:py-20 bg-neutral-50">
        <div className="container-mobile">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-3 md:mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg md:text-xl text-neutral-600">
              Professional investment platform built for modern investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center card-mobile p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Shield className="text-white" size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3 md:mb-4">Secure Platform</h3>
              <p className="text-neutral-600 text-sm md:text-base">
                Bank-level security with full regulatory compliance and investor protection
              </p>
            </div>

            <div className="text-center card-mobile p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3 md:mb-4">Passive Income</h3>
              <p className="text-neutral-600 text-sm md:text-base">
                Earn rental income without property management responsibilities
              </p>
            </div>

            <div className="text-center card-mobile p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3 md:mb-4">Community Driven</h3>
              <p className="text-neutral-600 text-sm md:text-base">
                Join thousands of investors building wealth through real estate
              </p>
            </div>

            <div className="text-center card-mobile p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Zap className="text-white" size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-3 md:mb-4">Next Generation Technology</h3>
              <p className="text-neutral-600 text-sm md:text-base">
                Enabled from release to scale - the platform grows with users
              </p>
            </div>
          </div>
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
      <Footer />
    </div>
  );
}
