import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Building, ArrowLeft } from "lucide-react";
import logoImage from "@assets/white_40_1750724342243.png";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    firstName: "",
    lastName: "",
    email: "", 
    password: "", 
    confirmPassword: "",
    userType: ""
  });
  const [showInvestmentPreference, setShowInvestmentPreference] = useState(false);
  const [investmentPreference, setInvestmentPreference] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  const handleAccountTypeSelection = (type: string) => {
    setRegisterForm({ ...registerForm, userType: type });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setShowInvestmentPreference(true);
  };

  const handleInvestmentPreferenceSubmit = () => {
    // Redirect to Replit Auth after collecting preferences
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Sign In
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToRegister} className="text-primary">
              Don't have an account? Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Modal - Account Type Selection */}
      <Dialog open={showRegister && !registerForm.userType && !showInvestmentPreference} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
              <img src={logoImage} alt="40 Acres Logo" className="w-10 h-10 object-contain" />
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Join 40 Acres</DialogTitle>
            <p className="text-neutral-600">Choose your account type to get started</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary" 
                  onClick={() => handleAccountTypeSelection("investor")}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Investor</h3>
                <p className="text-neutral-600 text-sm">
                  Invest in fractional real estate and build wealth through property ownership
                </p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
                  onClick={() => handleAccountTypeSelection("business")}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Business Owner</h3>
                <p className="text-neutral-600 text-sm">
                  List your properties for fractional investment and access capital
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToLogin} className="text-primary">
              Already have an account? Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Form */}
      <Dialog open={showRegister && Boolean(registerForm.userType) && !showInvestmentPreference} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setRegisterForm({ ...registerForm, userType: "" })}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
              {registerForm.userType === "investor" ? <Users className="text-white" size={20} /> : <Building className="text-white" size={20} />}
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Create Account</DialogTitle>
            <p className="text-neutral-600">Complete your {registerForm.userType} registration</p>
          </DialogHeader>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-black text-white hover:bg-neutral-800"
            >
              Continue
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToLogin} className="text-primary">
              Already have an account? Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Investment Preference */}
      <Dialog open={showInvestmentPreference} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInvestmentPreference(false)}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building className="text-white" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">
              {registerForm.userType === "business" ? "Property Listing Preferences" : "Investment Preferences"}
            </DialogTitle>
            <p className="text-neutral-600">
              {registerForm.userType === "business" 
                ? "What type of properties do you plan to list?" 
                : "What type of investments are you looking to make?"}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="investmentType">
                {registerForm.userType === "business" ? "Property Type" : "Investment Type"}
              </Label>
              <Select value={investmentPreference} onValueChange={setInvestmentPreference}>
                <SelectTrigger className="hover:[&>div]:bg-[#A52A2A] hover:[&>div]:text-white transition-colors">
                  <SelectValue placeholder={
                    registerForm.userType === "business" 
                      ? "Select property type" 
                      : "Select investment type"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {registerForm.userType === "business" ? (
                    <>
                      <SelectItem value="single-family" className="hover:bg-[#A52A2A] hover:text-white">Single Family Home</SelectItem>
                      <SelectItem value="multi-family" className="hover:bg-[#A52A2A] hover:text-white">Multi-Family</SelectItem>
                      <SelectItem value="condo" className="hover:bg-[#A52A2A] hover:text-white">Condominium</SelectItem>
                      <SelectItem value="townhouse" className="hover:bg-[#A52A2A] hover:text-white">Townhouse</SelectItem>
                      <SelectItem value="apartment" className="hover:bg-[#A52A2A] hover:text-white">Apartment Building</SelectItem>
                      <SelectItem value="commercial" className="hover:bg-[#A52A2A] hover:text-white">Commercial</SelectItem>
                      <SelectItem value="land" className="hover:bg-[#A52A2A] hover:text-white">Land</SelectItem>
                      <SelectItem value="other" className="hover:bg-[#A52A2A] hover:text-white">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="residential" className="hover:bg-[#A52A2A] hover:text-white">Residential</SelectItem>
                      <SelectItem value="commercial" className="hover:bg-[#A52A2A] hover:text-white">Commercial</SelectItem>
                      <SelectItem value="other" className="hover:bg-[#A52A2A] hover:text-white">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleInvestmentPreferenceSubmit}
              className="w-full bg-black text-white hover:bg-neutral-800"
              disabled={!investmentPreference}
            >
              Complete Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}