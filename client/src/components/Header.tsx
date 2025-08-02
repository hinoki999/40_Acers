import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, CreditCard, Shield, Settings, Star, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import logoImage from "@/assets/40-acres-logo.png";
import { useState } from "react";

import _7EA1D455_ADA2_43DF_B6CA_C0F56A04AD78_processed from "@assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed.png";

interface HeaderProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function Header({ onShowLogin, onShowRegister }: HeaderProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-black shadow-sm border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-sm safe-area-inset">
      <div className="container-mobile max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <div className="flex items-center space-x-2 md:space-x-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden text-white hover:bg-[#A52A2A] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-smooth touch-target">
              <img 
                src={_7EA1D455_ADA2_43DF_B6CA_C0F56A04AD78_processed} 
                alt="40 Acres Logo" 
                className="h-28 sm:h-34 md:h-45 lg:h-56 w-auto object-contain critical"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750352435284.png";
                }}
              />
            </Link>
            <div className="landscape:absolute landscape:left-1/2 landscape:transform landscape:-translate-x-1/2 md:absolute md:left-1/3 lg:left-1/2 md:transform md:-translate-x-1/2 ml-4 sm:ml-8 md:ml-0 landscape:ml-0">
              <nav className="hidden sm:flex space-x-1 lg:space-x-4 xl:space-x-6 landscape:space-x-2">
                <Link href="/">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded text-xs md:text-sm lg:text-base">
                    Home
                  </Button>
                </Link>
                <Link href="/invest">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded text-xs md:text-sm lg:text-base">
                    Invest
                  </Button>
                </Link>
                <Link href="/list-property">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded text-xs md:text-sm lg:text-base">
                    List Property
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 px-1 md:px-2 lg:px-3 py-1 md:py-2 rounded text-xs md:text-sm lg:text-base">Learn</Button>
                </Link>
              </nav>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2 hover:bg-[#A52A2A]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={(user as any)?.firstName || ""} />
                      <AvatarFallback>
                        {(user as any)?.firstName?.[0] || (user as any)?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white">
                      Hi, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setLocation('/settings?tab=profile')} className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/settings?tab=payment')} className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/settings?tab=membership')} className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">
                    <Star className="mr-2 h-4 w-4" />
                    Membership
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/settings?tab=security')} className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button 
                  onClick={() => {
                    console.log('Get Started clicked');
                    onShowRegister();
                  }} 
                  size="sm" 
                  className="bg-black text-white hover:bg-[#A52A2A] text-sm"
                >
                  Get Started
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    console.log('Login clicked');
                    onShowLogin();
                  }} 
                  className="text-white hover:bg-[#A52A2A] hover:text-white text-sm border-0"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-black border-t border-neutral-800 landscape:max-h-48 landscape:overflow-y-auto">
            <nav className="flex flex-col space-y-1 p-4 landscape:p-2 landscape:space-y-0.5">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left justify-start text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 landscape:py-1 landscape:text-sm">
                  Home
                </Button>
              </Link>
              <Link href="/invest" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left justify-start text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 landscape:py-1 landscape:text-sm">
                  Invest
                </Button>
              </Link>
              <Link href="/list-property" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left justify-start text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 landscape:py-1 landscape:text-sm">
                  List Property
                </Button>
              </Link>
              <Link href="/learn" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left justify-start text-white hover:text-white hover:bg-[#A52A2A] transition-all duration-200 landscape:py-1 landscape:text-sm">
                  Learn
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
