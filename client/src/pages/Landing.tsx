import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, TrendingUp, Users } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import AuthModals from "@/components/AuthModals";
import InvestmentModal from "@/components/InvestmentModal";
import SocialShareModal from "@/components/SocialShareModal";
import InvestorNetwork from "@/components/InvestorNetwork";
import CurrencyToggle from "@/components/CurrencyToggle";
import { Property } from "@shared/schema";
import logoImage from "@/assets/40-acres-logo.png";

interface LandingProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function Landing({ onShowLogin, onShowRegister }: LandingProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showInvestment, setShowInvestment] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'BTC'>('USD');

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const handleInvest = (propertyId: number) => {
    const property = (properties as Property[]).find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    } else {
      setShowLogin(true);
    }
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
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    onShowRegister();
    setShowRegister(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="text-center mb-8">
                <img 
                  src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750355342962.png" 
                  alt="40 Acres Logo" 
                  className="h-144 w-auto object-contain mx-auto mb-2"
                />
                <h1 className="font-bold text-[48px] text-center leading-tight">
                  Peer to Peer<br/>Investment Marketplace
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Build wealth through fractional real estate investing. Own shares in rental properties and earn passive income without the hassle of management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleShowRegister}
                  className="px-8 py-4 bg-[#b34034] text-white font-semibold hover:bg-[#A0522D]"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  onClick={handleShowLogin}
                  variant="outline"
                  className="px-8 py-4 border-2 border-white font-semibold hover:bg-white hover:text-primary bg-[#ffffff] text-[#000000]"
                  size="lg"
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-2xl">
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
                    <span className="text-neutral-900 font-semibold">Max Amount $2000.00</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">$0.00</div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full w-0"></div>
                  </div>
                  <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
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
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl font-bold text-neutral-900">Featured Properties</h2>
              <CurrencyToggle 
                currentCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>
            <p className="text-xl text-neutral-600">
              Discover profitable rental properties and start building your portfolio
            </p>
          </div>

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
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={handleShowLogin}
              variant="outline"
              className="px-8 py-4 border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white"
              size="lg"
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-neutral-600">
              Professional investment platform built for modern investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Secure Platform</h3>
              <p className="text-neutral-600">
                Bank-level security with full regulatory compliance and investor protection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Passive Income</h3>
              <p className="text-neutral-600">
                Earn rental income without property management responsibilities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Community Driven</h3>
              <p className="text-neutral-600">
                Join thousands of investors building wealth through real estate
              </p>
            </div>
          </div>
        </div>
      </section>
      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        onClose={() => {
          setShowLogin(false);
          setShowRegister(false);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
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
    </div>
  );
}
