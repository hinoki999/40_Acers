import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, Plus, ArrowDown, Search, TrendingUp, Star, HelpCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Footer";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import CreatePropertyModal from "@/components/CreatePropertyModal";
import InvestmentModal from "@/components/InvestmentModal";
import PropertyCard from "@/components/PropertyCard";
import EnhancedHeatMap from "@/components/MapboxHeatMap";
import PortfolioChart from "@/components/PortfolioChart";
import CurrencyToggle from "@/components/CurrencyToggle";
import OnboardingTour from "@/components/OnboardingTour";
import InvestorTour from "@/components/InvestorTour";
import WelcomeBanner from "@/components/WelcomeBanner";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Transaction, Property } from "@shared/schema";
import logoImage from "@/assets/40-acres-logo.png";

interface PortfolioData {
  totalValue: number;
  sharesOwned: number;
}

export default function Dashboard() {
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [showInvestment, setShowInvestment] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [transactionFilter, setTransactionFilter] = useState("");
  const [currency, setCurrency] = useState<'USD' | 'BTC'>('USD');
  const [showInvestorTour, setShowInvestorTour] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const { 
    showOnboarding, 
    isFirstVisit, 
    completeOnboarding, 
    startOnboarding, 
    setShowOnboarding 
  } = useOnboarding();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleInvest = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    }
  };

  const notifyMutation = useMutation({
    mutationFn: async () => {
      // This would typically send a notification signup request
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You'll be notified when we launch new features!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to sign up for notifications. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredTransactions = transactions.filter(transaction =>
    transaction.email?.toLowerCase().includes(transactionFilter.toLowerCase()) ||
    transaction.status.toLowerCase().includes(transactionFilter.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-secondary text-white">Success</Badge>;
      case 'pending':
        return <Badge className="bg-accent text-white">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header with Logo */}
      <div className="flex items-center space-x-4 mb-8">
        <img 
          src="/attached_assets/7EA1D455-ADA2-43DF-B6CA-C0F56A04AD78_processed_1750352435284.png" 
          alt="40 Acres Logo" 
          className="h-20 w-auto object-contain"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600">Manage your real estate investments</p>
        </div>
        
        {/* Help/Onboarding Buttons */}
        <div className="flex gap-2">
          {(user as any)?.userType === 'business' ? (
            <Button 
              className="bg-black hover:bg-red-600 text-white"
              asChild
            >
              <Link href="/list-property">
                <Plus className="h-4 w-4 mr-2" />
                List Your Property
              </Link>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInvestorTour(true)}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Investor Guide</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startOnboarding}
            className="flex items-center space-x-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help Tutorial</span>
          </Button>
        </div>
      </div>

      {/* Welcome Banner for new users */}
      <WelcomeBanner 
        userName={user?.email?.split('@')[0]} 
        onStartTour={startOnboarding}
        isFirstVisit={isFirstVisit}
      />

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Value Card */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Portfolio Value</h2>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="text-white" />
            </div>
          </div>
          <div className="text-5xl font-bold text-neutral-900 mb-2">
            ${portfolio?.totalValue?.toLocaleString() || "0.00"}
          </div>
          <div className="text-neutral-600 mb-8">
            {portfolio?.sharesOwned || 0} Shares Owned
          </div>

          <div className="space-y-4">
            {/* Show different buttons based on user type */}
            {(user as any)?.userType === 'business' ? (
              <Button
                onClick={() => setShowCreateProperty(true)}
                className="w-full bg-black text-white hover:bg-gray-200 hover:text-black shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="mr-2" size={16} />
                List Your Property
              </Button>
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm">Coming Soon</p>
                <p className="text-gray-500 text-xs">Investor Portal</p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            >
              <ArrowDown className="mr-2" size={16} />
              Withdraw Funds
            </Button>
            <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
              <Search className="mr-2" size={16} />
              Explore
            </Button>
          </div>

          <Card className="mt-8 bg-neutral-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Get Notified When We Launch! 🚀
              </h3>
              <p className="text-neutral-600 mb-4">Sign up to receive an email when we go live.</p>
              <Button
                onClick={() => notifyMutation.mutate()}
                disabled={notifyMutation.isPending}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
              >
                {notifyMutation.isPending ? "Signing up..." : "Notify Me"}
              </Button>
            </CardContent>
          </Card>
        </Card>

        {/* Total Assets Chart */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Total Assets</h2>
              <p className="text-neutral-600">Showing total visitors for the last 6 months</p>
            </div>
          </div>
          <PortfolioChart />
          <div className="mt-4 flex items-center text-sm">
            <div className="flex items-center text-secondary">
              <TrendingUp className="mr-1" size={16} />
              <span className="font-medium">Trending up by 5.2% this month</span>
            </div>
            <span className="text-neutral-500 ml-2">January - June 2024</span>
          </div>
        </Card>
      </div>



      {/* Transactions Section */}
      <Card>
        <CardHeader className="border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <p className="text-sm text-neutral-600">Your latest transactions and investments</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by property name..."
                className="w-64"
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead>Property</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-neutral-50">
                  <TableCell>Property #{transaction.propertyId || 'N/A'}</TableCell>
                  <TableCell>{new Date(transaction.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.transactionType || 'Investment'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            0 of {filteredTransactions.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Available Properties Section */}
      {properties.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  {(user as any)?.userType === 'business' ? 'My Listed Properties' : 'Available Investment Opportunities'}
                </CardTitle>
                <p className="text-neutral-600">
                  {(user as any)?.userType === 'business' ? 'Manage your property listings' : 'Discover and invest in new properties'}
                </p>
              </div>
              <CurrencyToggle 
                currentCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 3).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onInvest={handleInvest}
                />
              ))}
            </div>
            {properties.length > 3 && (
              <div className="text-center mt-6">
                <Button variant="outline" className="px-8">
                  View All Properties
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Heat Map Section - Only for Gold Members */}
      {properties.length > 0 && (user as any)?.membershipType === 'gold' && (
        <div className="mb-8">
          <EnhancedHeatMap properties={properties} />
        </div>
      )}

      <CreatePropertyModal
        isOpen={showCreateProperty}
        onClose={() => setShowCreateProperty(false)}
      />
      
      <InvestmentModal
        isOpen={showInvestment}
        onClose={() => {
          setShowInvestment(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
      />
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={completeOnboarding}
      />
      <InvestorTour
        isOpen={showInvestorTour}
        onClose={() => setShowInvestorTour(false)}
        onComplete={() => setShowInvestorTour(false)}
        onStartInvesting={() => {
          setShowInvestorTour(false);
          // Find the first available property and open investment modal
          if (properties && properties.length > 0) {
            const firstProperty = properties[0];
            setSelectedProperty(firstProperty);
            setShowInvestment(true);
          } else {
            window.location.href = '/invest';
          }
        }}
      />
      
      <Footer />
    </div>
  );
}
