import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, TrendingUp, Users, Smartphone, Download, Zap } from "lucide-react";
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
    <div className="min-h-screen-mobile">
      {/* Hero Section */}
      <section className="py-10 md:py-20 bg-black relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: "url('/attached_assets/eleg_home_1750483966934.jpeg')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container-mobile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-white order-2 lg:order-1">
              <div className="text-left mb-6 md:mb-8">
                <h1 className="font-bold text-2xl md:text-4xl lg:text-[48px] text-left leading-tight">
                  Peer to Peer<br/>Investment Marketplace
                </h1>
              </div>
              <p className="text-base md:text-xl text-white mb-6 md:mb-8 leading-relaxed text-left">
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
                    <span className="text-neutral-900 font-semibold">Max Amount $2000.00</span>
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

          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={handleShowLogin}
              variant="outline"
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white btn-touch"
              size="lg"
            >
              View All Properties
            </Button>
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

      {/* Mobile App Download Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container-mobile text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Smartphone className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Download the 40 Acres Wallet App
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Get our secure digital wallet to manage your real estate investments, track property performance, and make instant transactions from anywhere.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* App Store Button */}
              <a 
                href="https://apps.apple.com/app/40-acres-wallet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors min-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download Wallet on</div>
                    <div className="text-lg font-semibold -mt-1">App Store</div>
                  </div>
                </div>
              </a>
              
              {/* Google Play Button */}
              <a 
                href="https://play.google.com/store/apps/details?id=com.40acres.wallet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors min-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.35.18-.65.46-.84L12.5 12l-9.04 9.34c-.28-.19-.46-.49-.46-.84z"/>
                    <path d="M21 12l-2.5-1.45L14.5 12l4 1.45L21 12z"/>
                    <path d="M12.5 12L3.46 2.66c.08-.05.17-.1.28-.13.1-.03.2-.03.3 0l13.08 7.59L12.5 12z"/>
                    <path d="M12.5 12l4.62 2.88L3.04 22.47c-.1.03-.2.03-.3 0-.11-.03-.2-.08-.28-.13L12.5 12z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get Wallet on</div>
                    <div className="text-lg font-semibold -mt-1">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Digital Wallet</h3>
                <p className="text-sm text-white">Store and manage your real estate tokens securely</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Portfolio Tracking</h3>
                <p className="text-sm text-white">Monitor your investments and earnings in real-time</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-white">Bank-level encryption for all wallet transactions</p>
              </div>
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

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img 
                src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750355342962.png" 
                alt="40 Acres Logo" 
                className="h-26 w-auto object-contain mb-4"
              />
              <p className="text-gray-300 mb-4">
                Build wealth through fractional real estate investing. Own shares in rental properties and earn passive income without the hassle of management.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/business" className="text-gray-300 hover:text-white transition-colors">Business</a></li>
                <li><a href="/community" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
                <li><a href="/tokenomics" className="text-gray-300 hover:text-white transition-colors">Tokenomics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Legal Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 40 Acres App Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
