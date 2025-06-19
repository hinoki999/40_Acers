import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoImage from "@/assets/40-acres-logo.png";

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
    <header className="bg-black shadow-sm border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity touch-target">
              <img 
                src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750355342962.png" 
                alt="40 Acres Logo" 
                className="h-28 md:h-40 w-auto object-cover object-center critical"
                style={{
                  objectPosition: 'center',
                  clipPath: 'inset(10% 10% 10% 10%)',
                  scale: '1.2'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750352435284.png";
                }}
              />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Home
                </Button>
              </Link>
              <Link href="/invest">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
                  Invest
                </Button>
              </Link>
              <Link href="/list">
                <Button variant="ghost" className="text-white hover:text-[#b34034] hover:bg-neutral-800">
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
                        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-neutral-700">
                        Hi, {user?.firstName || user?.email?.split('@')[0] || "User"}
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
