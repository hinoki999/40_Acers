import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
import Tokenomics from "@/pages/Tokenomics";
import Settings from "@/pages/Settings";
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
            <Route path="/tokenomics" component={Tokenomics} />
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
            <Route path="/tokenomics" component={Tokenomics} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
