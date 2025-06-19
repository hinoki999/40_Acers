import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";

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
    confirmPassword: "" 
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
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Home className="text-white" size={20} />
            </div>
            <DialogTitle className="text-2xl font-bold text-neutral-900">Create an account</DialogTitle>
            <p className="text-neutral-600">Click below to sign up with Replit</p>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={handleRegister} 
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Sign Up with Replit
            </Button>
          </div>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onSwitchToLogin} className="text-primary">
              Already have an account? Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
