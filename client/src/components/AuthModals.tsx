import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthModalsProps {
  showLogin: boolean;
  showRegister: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
}

export default function AuthModals({ 
  showLogin, 
  showRegister, 
  onClose, 
  onSwitchToRegister, 
  onSwitchToLogin 
}: AuthModalsProps) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    userType: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth (handles both login and registration)
    window.location.href = "/api/login";
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Home className="text-white" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Welcome Back</DialogTitle>
            <p className="text-neutral-600">Enter your credentials to access your account</p>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={handleLogin} 
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Sign In with Replit
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToRegister} className="text-primary">
              Don't have an account? Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={showRegister} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Home className="text-white" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Choose Account Type</DialogTitle>
            <p className="text-neutral-600">Select the type of account you want to create</p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <Card 
              className={`cursor-pointer border-2 transition-all ${
                registerForm.userType === 'investor' 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setRegisterForm({...registerForm, userType: 'investor'})}
            >
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-semibold mb-2">Investor</h3>
                <p className="text-sm text-neutral-600">Invest in Properties</p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer border-2 transition-all ${
                registerForm.userType === 'business' 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setRegisterForm({...registerForm, userType: 'business'})}
            >
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-semibold mb-2">Business</h3>
                <p className="text-sm text-neutral-600">List Your Properties</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleRegister} 
              disabled={!registerForm.userType}
              className="w-full bg-black text-white hover:bg-gray-200 hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sign Up with Replit
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToLogin} className="text-black">
              Already have an account? Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
