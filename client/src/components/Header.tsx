import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <Home className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-neutral-900">Arrived</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-neutral-700 hover:text-primary">
                Getting started
              </Button>
              <Button variant="ghost" className="text-neutral-700 hover:text-primary">
                Components
              </Button>
              <Button variant="ghost" className="text-neutral-700 hover:text-primary">
                Documentation
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" onClick={onShowLogin}>
                      Login
                    </Button>
                    <Button onClick={onShowRegister} className="bg-neutral-900 text-white hover:bg-neutral-800">
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
