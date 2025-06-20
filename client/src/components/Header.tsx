import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoImage from "@/assets/40-acres-logo.png";

import _7EA1D455_ADA2_43DF_B6CA_C0F56A04AD78_processed from "@assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed.png";

interface HeaderProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function Header({ onShowLogin, onShowRegister }: HeaderProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-black shadow-sm border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-sm safe-area-inset">
      <div className="container-mobile max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-smooth touch-target">
              <img 
                src={_7EA1D455_ADA2_43DF_B6CA_C0F56A04AD78_processed} 
                alt="40 Acres Logo" 
                className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain critical"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750352435284.png";
                }}
              />
            </Link>
            <nav className="hidden lg:flex space-x-4 xl:space-x-6">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800 transition-smooth btn-touch">
                  Home
                </Button>
              </Link>
              <Link href="/invest">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800 transition-smooth btn-touch">
                  Invest
                </Button>
              </Link>
              <Link href="/list">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800 transition-smooth btn-touch">
                  List Property
                </Button>
              </Link>
              <Link href="/business">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Business
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Documentation
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Community
                </Button>
              </Link>
              <Link href="/withdraw">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Withdraw
                </Button>
              </Link>
              <Link href="/tokenomics">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Tokenomics
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isLoading && (
              <>
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button variant="ghost" size="sm" onClick={onShowLogin} className="text-sm">
                      Login
                    </Button>
                    <Button onClick={onShowRegister} size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800 text-sm">
                      Register
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={(user as any)?.firstName || ""} />
                        <AvatarFallback>
                          {(user as any)?.firstName?.[0] || (user as any)?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">
                        Hi, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || "User"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut size={16} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
