import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, Plus, ArrowDown, Search, TrendingUp, Star, HelpCircle, Filter, MoreHorizontal } from "lucide-react";
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
  const [timePeriod, setTimePeriod] = useState<'Day' | 'Week' | 'Month'>('Day');
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
      {/* Dashboard Header */}
      <div className="flex items-center space-x-4 mb-8">
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
              className="flex items-center space-x-2 hover:bg-[#A52A2A] hover:text-white"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Investor Guide</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startOnboarding}
            className="flex items-center space-x-2 hover:bg-[#A52A2A] hover:text-white"
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
        {/* Portfolio Value Card - Budget Overview Style */}
        <Card className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          {/* Header with title and time period tabs */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['Day', 'Week', 'Month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period as 'Day' | 'Week' | 'Month')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timePeriod === period
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Main value and percentage */}
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-bold text-gray-900">
              ${portfolio?.totalValue?.toLocaleString() || "8,237.00"}
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">2.6%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          {/* Chart Area */}
          <div className="h-48 relative mb-6">
            <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 32" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Income line (orange) */}
              <path
                d="M 0 120 Q 50 100 100 110 T 200 90 T 300 95 T 400 80"
                fill="none"
                stroke="#fb923c"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              
              {/* Expenses line (black) */}
              <path
                d="M 0 140 Q 50 130 100 125 Q 150 115 200 120 Q 250 125 300 110 Q 350 95 400 100"
                fill="none"
                stroke="#1f2937"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              
              {/* Interactive point */}
              <circle cx="200" cy="120" r="4" fill="#1f2937" className="drop-shadow-sm" />
              
              {/* Tooltip */}
              <g transform="translate(200, 100)">
                <rect x="-25" y="-20" width="50" height="20" rx="4" fill="#1f2937" />
                <text x="0" y="-8" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">
                  $6,121
                </text>
              </g>
            </svg>
          </div>

          {/* Date labels */}
          <div className="flex justify-between text-xs text-gray-500 mb-6">
            <span>8/04</span>
            <span>9/04</span>
            <span>10/04</span>
            <span>10/04</span>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {(user as any)?.userType === 'business' && (
              <Button
                onClick={() => setShowCreateProperty(true)}
                className="w-full bg-black text-white hover:bg-gray-800 shadow-sm"
              >
                <Plus className="mr-2" size={16} />
                List Your Property
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
            >
              <ArrowDown className="mr-2" size={16} />
              Withdraw Funds
            </Button>
          </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-neutral-50">
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
                  {(user as any)?.userType === 'business' ? 'My Listed Properties' : 'My Investments'}
                </CardTitle>
                <p className="text-neutral-600">
                  {(user as any)?.userType === 'business' ? 'Manage your property listings' : 'View the investments you\'ve made'}
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
                <Button variant="outline" className="px-8 bg-[#A52A2A] text-white hover:bg-[#8B1A1A] border-[#A52A2A]">
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
      <>
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
      </>
    </div>
  );
}
