import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Invest from "@/pages/Invest";
import ListProperty from "@/pages/ListProperty";
import Business from "@/pages/Business";
import Documentation from "@/pages/Documentation";
import Community from "@/pages/Community";
import PropertyCommunity from "@/pages/PropertyCommunity";
import Withdraw from "@/pages/Withdraw";
import Marketplace from "@/pages/Marketplace";
import Learn from "@/pages/Learn";
import LegalDisclaimer from "@/pages/LegalDisclaimer";
import Settings from "@/pages/Settings";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import WalletSecurity from "@/pages/WalletSecurity";
import NotFound from "@/pages/not-found";
import AuthModals from "@/components/AuthModals";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowLogin = () => {
    console.log('handleShowLogin called');
    setShowLogin(true);
  };
  const handleShowRegister = () => {
    console.log('handleShowRegister called');
    setShowRegister(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={() => <Landing onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />} />
            <Route path="/invest" component={Invest} />
            <Route path="/list-property" component={ListProperty} />
            <Route path="/business" component={Business} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/community" component={Community} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/learn" component={Learn} />
            <Route path="/wallet-security" component={WalletSecurity} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/community/:id" component={PropertyCommunity} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/invest" component={Invest} />
            <Route path="/list-property" component={ListProperty} />
            <Route path="/business" component={Business} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/community/:id" component={PropertyCommunity} />
            <Route path="/community" component={Community} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/learn" component={Learn} />
            <Route path="/wallet-security" component={WalletSecurity} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/settings" component={Settings} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      
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
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
