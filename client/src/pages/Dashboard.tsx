import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, Plus, ArrowDown, Search, TrendingUp, Star, HelpCircle, Filter, MoreHorizontal, ChevronDown } from "lucide-react";
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
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
  const [earningsCurrency, setEarningsCurrency] = useState<'USD' | 'BTC'>('USD');
  const [investmentCurrency, setInvestmentCurrency] = useState<'USD' | 'BTC'>('USD');
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

  const { data: bitcoinPrice } = useQuery<{ price: number }>({
    queryKey: ["/api/bitcoin-price"],
    refetchInterval: 60000, // Refetch every minute
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
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Earnings</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEarningsCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    earningsCurrency === 'USD'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => setEarningsCurrency('BTC')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    earningsCurrency === 'BTC'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4" />
                  Bitcoin (BTC)
                </button>
              </div>
            </div>
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
              {earningsCurrency === 'USD' ? (
                `$${portfolio?.totalValue?.toLocaleString() || "8,237.00"}`
              ) : (
                `₿${((portfolio?.totalValue || 8237) / (bitcoinPrice?.price || 107000)).toFixed(6)}`
              )}
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
                <div className="w-3 h-3 rounded-full bg-[#A52A2A]"></div>
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
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: '8/04', income: 6000, expenses: 4500 },
                { name: '9/04', income: 6800, expenses: 5200 },
                { name: '10/04', income: 6121, expenses: 4800 },
                { name: '11/04', income: 7200, expenses: 5500 }
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#A52A2A" 
                  strokeWidth={2} 
                  dot={{ fill: '#A52A2A', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#A52A2A' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#1f2937" 
                  strokeWidth={2} 
                  dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1f2937' }}
                />
              </LineChart>
            </ResponsiveContainer>
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

        {/* Expense Breakdown Chart */}
        <Card className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Investment breakdown</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setInvestmentCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    investmentCurrency === 'USD'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => setInvestmentCurrency('BTC')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    investmentCurrency === 'BTC'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4" />
                  Bitcoin (BTC)
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600">
              <span>Last 30 days</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          
          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <PieChart width={200} height={200}>
                <Pie
                  data={[
                    { name: 'Residential', value: 50, color: '#A52A2A' },
                    { name: 'Commercial', value: 32, color: '#D2691E' },
                    { name: 'Other', value: 18, color: '#d1d5db' }
                  ]}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {[
                    { name: 'Residential', value: 50, color: '#A52A2A' },
                    { name: 'Commercial', value: 32, color: '#D2691E' },
                    { name: 'Other', value: 18, color: '#d1d5db' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-gray-500">SPEND</div>
                <div className="text-sm font-bold text-gray-900" style={{ fontSize: '14pt' }}>
                  {investmentCurrency === 'USD' ? (
                    '$3,800.00'
                  ) : (
                    `₿${(3800 / (bitcoinPrice?.price || 107000)).toFixed(6)}`
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A52A2A]"></div>
                <span className="text-sm text-gray-600">Residential (50%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$2,120.63</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D2691E]"></div>
                <span className="text-sm text-gray-600">Commercial (32%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$1,361.23</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d1d5db]"></div>
                <span className="text-sm text-gray-600">Other (18%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$339.24</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 40 Card Container */}
      <div className="mb-8">
        <Card className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">40 Acres Wallet</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    currency === 'USD'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('BTC')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    currency === 'BTC'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-4 h-4" />
                  Bitcoin (BTC)
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600">
              <span>Last 30 days</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          
          {/* Debit Card Design */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-80 h-48 bg-gradient-to-br from-[#A52A2A] to-[#8B1A1A] rounded-2xl shadow-lg overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white rounded-full"></div>
                <div className="absolute top-4 right-16 w-8 h-8 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Card Content */}
              <div className="relative p-6 h-full flex flex-col justify-between text-white">
                {/* Logo and Chip */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                    </div>
                    <span className="font-bold text-lg">40 ACRES</span>
                  </div>
                  <div className="w-12 h-8 flex items-center justify-center">
                    <img 
                      src="/attached_assets/white_40_1750724342243.png" 
                      alt="40 Acres Logo" 
                      className="w-10 h-6 object-contain"
                    />
                  </div>
                </div>
                
                {/* Balance */}
                <div className="space-y-2">
                  <div className="text-sm opacity-80">BALANCE</div>
                  <div className="text-3xl font-bold">
                    {currency === 'USD' ? (
                      `$${portfolio?.totalValue?.toLocaleString() || "0.00"}`
                    ) : (
                      `₿${((portfolio?.totalValue || 0) / (bitcoinPrice?.price || 107000)).toFixed(6)}`
                    )}
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-xs opacity-60">VALID THRU</div>
                    <div className="text-sm font-mono">12/27</div>
                  </div>
                  <div className="text-lg font-bold tracking-wider">VISA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A52A2A]"></div>
                <span className="text-sm text-gray-600">Balance</span>
              </div>
              <span className="text-sm font-medium text-gray-900">${portfolio?.totalValue?.toLocaleString() || "0.00"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D2691E]"></div>
                <span className="text-sm text-gray-600">Due</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d1d5db]"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <span className="text-sm font-medium text-gray-900">${((portfolio?.totalValue || 0) * 0.80).toLocaleString()}</span>
            </div>
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
