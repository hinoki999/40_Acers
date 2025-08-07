import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Plus,
  ArrowDown,
  Search,
  TrendingUp,
  Star,
  HelpCircle,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Shield,
  Lock,
  Smartphone,
  Calendar as CalendarIcon,
  FileText,
  Send,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import CreatePropertyModal from "@/components/CreatePropertyModal";
import InvestmentModal from "@/components/InvestmentModal";
import PropertyCard from "@/components/PropertyCard";
import SocialShareModal from "@/components/SocialShareModal";
import EnhancedHeatMap from "@/components/MapboxHeatMap";
import PortfolioChart from "@/components/PortfolioChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CurrencyToggle from "@/components/CurrencyToggle";
import OnboardingTour from "@/components/OnboardingTour";
import InvestorTour from "@/components/InvestorTour";
import PropertyReportModal from "@/components/PropertyReportModal";
import InvestorReportsModal from "@/components/InvestorReportsModal";
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [transactionFilter, setTransactionFilter] = useState("");
  const [currency, setCurrency] = useState<"USD" | "BTC">("USD");
  const [earningsCurrency, setEarningsCurrency] = useState<"USD" | "BTC">(
    "USD",
  );
  const [investmentCurrency, setInvestmentCurrency] = useState<"USD" | "BTC">(
    "USD",
  );
  const [showInvestorTour, setShowInvestorTour] = useState(false);
  const [timePeriod, setTimePeriod] = useState<"Day" | "Week" | "Month" | "Lifetime">("Day");
  const [showPropertyReportModal, setShowPropertyReportModal] = useState(false);
  const [showInvestorReportsModal, setShowInvestorReportsModal] = useState(false);
  const [selectedPropertyForReport, setSelectedPropertyForReport] = useState(null);
  const [propertyReportsTab, setPropertyReportsTab] = useState("properties");
  const [earningsTimePeriod, setEarningsTimePeriod] = useState<"Day" | "Week" | "Month" | "Lifetime">("Day");
  const [investmentFilter, setInvestmentFilter] = useState("Last 30 Days");
  const [walletFilter, setWalletFilter] = useState("Last 30 Days");
  const [propertyFilter, setPropertyFilter] = useState("Last 30 Days");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalStep, setWithdrawalStep] = useState<
    "password" | "sms" | "confirm"
  >("password");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const {
    showOnboarding,
    isFirstVisit,
    completeOnboarding,
    startOnboarding,
    setShowOnboarding,
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
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowInvestment(true);
    }
  };

  const handleShare = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowSocialShare(true);
    }
  };

  // Function to check if user has invested in a property
  const hasUserInvested = (propertyId: number): boolean => {
    return transactions.some(
      (transaction) =>
        transaction.propertyId === propertyId &&
        transaction.status === "completed" &&
        transaction.transactionType === "investment",
    );
  };

  const notifyMutation = useMutation({
    mutationFn: async () => {
      // This would typically send a notification signup request
      return new Promise((resolve) => setTimeout(resolve, 1000));
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

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.email
        ?.toLowerCase()
        .includes(transactionFilter.toLowerCase()) ||
      transaction.status
        .toLowerCase()
        .includes(transactionFilter.toLowerCase()),
  );

  // Filter properties based on selected filter and search term
  const filteredProperties = properties.filter((property) => {
    // First filter by search term
    const matchesSearch = searchTerm === "" || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${property.address} ${property.city}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Then filter by selected filter
    switch (propertyFilter) {
      case "Favorites":
        // In a real app, you'd check if property is marked as favorite by the user
        return property.id % 3 === 0; // Mock logic for demo
      case "Saved":
        // In a real app, you'd check if property is saved by the user
        return property.id % 2 === 0; // Mock logic for demo
      case "Last 7 Days":
        // In a real app, you'd check the property's creation/update date
        return true; // Mock - show all for now
      case "24H":
        // In a real app, you'd check properties from last 24 hours
        return true; // Mock - show all for now
      case "Select Range":
        return true; // Would open date picker in real app
      default:
        return true; // Show all properties for "Last 30 Days" and default
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-secondary text-white">Success</Badge>;
      case "pending":
        return <Badge className="bg-accent text-white">Processing</Badge>;
      case "failed":
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Manage your real estate investments
          </p>
        </div>

        {/* Help/Onboarding Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {(user as any)?.userType === "business" ? (
            <Button className="bg-black hover:bg-[#A52A2A] text-white" asChild>
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
        userName={user?.email?.split("@")[0]}
        onStartTour={startOnboarding}
        isFirstVisit={isFirstVisit}
      />
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Portfolio Value Card - Budget Overview Style */}
        <Card className="p-4 sm:p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          {/* Header with title and time period tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Earnings</h2>
          </div>
          <div className="flex items-center justify-between mb-8">
            <CurrencyToggle 
              currentCurrency={earningsCurrency} 
              onCurrencyChange={setEarningsCurrency}
              size="sm"
            />
            <Select value={earningsTimePeriod} onValueChange={setEarningsTimePeriod}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Week">Week</SelectItem>
                <SelectItem value="Month">Month</SelectItem>
                <SelectItem value="Lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main value and percentage */}
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-bold text-gray-900">
              {earningsCurrency === "USD"
                ? `$${(portfolio?.totalValue || 0).toFixed(2)}`
                : `${((portfolio?.totalValue || 0) / (bitcoinPrice?.price || 107000)).toFixed(8)} BTC`}
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
              <LineChart
                data={[
                  { name: "8/04", income: 6000, expenses: 4500 },
                  { name: "9/04", income: 6800, expenses: 5200 },
                  { name: "10/04", income: 6121, expenses: 4800 },
                  { name: "11/04", income: 7200, expenses: 5500 },
                ]}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#A52A2A"
                  strokeWidth={2}
                  dot={{ fill: "#A52A2A", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#A52A2A" }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#1f2937"
                  strokeWidth={2}
                  dot={{ fill: "#1f2937", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#1f2937" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-[#A52A2A] text-white border-[#A52A2A] hover:bg-[#8B1A1A] hover:border-[#8B1A1A]"
              onClick={() => setShowWithdrawalModal(true)}
            >
              <ArrowDown className="mr-2" size={16} />
              Withdraw Funds
            </Button>
          </div>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Investment Breakdown
            </h2>
          </div>
          <div className="flex items-center justify-between mb-8">
            <CurrencyToggle 
              currentCurrency={investmentCurrency} 
              onCurrencyChange={setInvestmentCurrency}
              size="sm"
            />
            <Select value={investmentFilter} onValueChange={(value) => {
              setInvestmentFilter(value);
              if (value === "Select Range") {
                setShowDatePicker(true);
              }
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                <SelectItem value="24H">24H</SelectItem>
                <SelectItem value="Select Range">Select Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <PieChart width={200} height={200}>
                <Pie
                  data={[
                    { name: "Residential", value: 40, color: "#A52A2A" },
                    { name: "Commercial", value: 28, color: "#D2691E" },
                    { name: "Land", value: 17, color: "#8B4513" },
                    { name: "Other", value: 15, color: "#d1d5db" },
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
                    { name: "Residential", value: 40, color: "#A52A2A" },
                    { name: "Commercial", value: 28, color: "#D2691E" },
                    { name: "Land", value: 17, color: "#8B4513" },
                    { name: "Other", value: 15, color: "#d1d5db" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-gray-500">SPEND</div>
                <div
                  className="text-sm font-bold text-gray-900"
                  style={{ fontSize: "14pt" }}
                >
                  {investmentCurrency === "USD"
                    ? `$${(portfolio?.totalValue || 0).toFixed(2)}`
                    : `₿${((portfolio?.totalValue || 0) / (bitcoinPrice?.price || 107000)).toFixed(8)}`}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A52A2A]"></div>
                <span className="text-sm text-gray-600">Residential (0%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {investmentCurrency === "USD" ? "$0.00" : "0.00000000 BTC"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D2691E]"></div>
                <span className="text-sm text-gray-600">Commercial (0%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {investmentCurrency === "USD" ? "$0.00" : "0.00000000 BTC"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                <span className="text-sm text-gray-600">Land (0%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{investmentCurrency === "USD" ? "$0.00" : "0.00000000 BTC"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d1d5db]"></div>
                <span className="text-sm text-gray-600">Other (0%)</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{investmentCurrency === "USD" ? "$0.00" : "0.00000000 BTC"}</span>
            </div>
          </div>
        </Card>
      </div>
      {/* 40 Card Container */}
      <div className="mb-8">
        <Card className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                40 Acres Wallet
              </h2>
              <CurrencyToggle 
                currentCurrency={currency} 
                onCurrencyChange={setCurrency}
                size="sm"
              />
            </div>
            <Select value={walletFilter} onValueChange={(value) => {
              setWalletFilter(value);
              if (value === "Select Range") {
                setShowDatePicker(true);
              }
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                <SelectItem value="24H">24H</SelectItem>
                <SelectItem value="Select Range">Select Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Debit Card Design */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-80 h-48 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg overflow-hidden">
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
                    <span className="font-bold text-lg">40 ACRES</span>
                  </div>
                  <div className="w-12 h-8 flex items-center justify-center pt-[0px] pb-[0px] mt-[0px] mb-[0px] ml-[11px] mr-[11px]">
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
                    {currency === "USD"
                      ? `$${portfolio?.totalValue?.toLocaleString() || "0.00"}`
                      : `₿${((portfolio?.totalValue || 0) / (bitcoinPrice?.price || 107000)).toFixed(6)}`}
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
              <span className="text-sm font-medium text-gray-900">
                ${portfolio?.totalValue?.toLocaleString() || "0.00"}
              </span>
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
              <span className="text-sm font-medium text-gray-900">
                ${((portfolio?.totalValue || 0) * 0.8).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
      {/* My Listed Properties Section */}
      {properties.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  {(user as any)?.userType === "business"
                    ? "My Listed Properties"
                    : "My Investments"}
                </CardTitle>
                <p className="text-neutral-600">
                  {(user as any)?.userType === "business"
                    ? "Manage your property listings"
                    : "View the investments you've made"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
                <Input
                  placeholder="Search by location or property"
                  className="w-full sm:w-48 md:w-64 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <Select value={propertyFilter} onValueChange={(value) => {
                    setPropertyFilter(value);
                    if (value === "Select Range") {
                      setShowDatePicker(true);
                    }
                  }}>
                    <SelectTrigger className="w-full sm:w-36 md:w-48 h-10">
                      <SelectValue placeholder="Filters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                      <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                      <SelectItem value="24H">24H</SelectItem>
                      <SelectItem value="Select Range">Select Range</SelectItem>
                      <SelectItem value="Favorites">Favorites</SelectItem>
                      <SelectItem value="Saved">Saved</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:block">
                    <CurrencyToggle
                      currentCurrency={currency}
                      onCurrencyChange={setCurrency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={propertyReportsTab} onValueChange={setPropertyReportsTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties">
                  <Building className="h-4 w-4 mr-2" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value={user?.userType === "business" ? "send-reports" : "investor-reports"}>
                  {user?.userType === "business" ? (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reports
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Investor Reports
                    </>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.slice(0, 3).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onInvest={handleInvest}
                      onShare={handleShare}
                      hasInvested={hasUserInvested(property.id)}
                    />
                  ))}
                </div>
                {filteredProperties.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">No properties found matching your filter criteria.</p>
                  </div>
                )}
                {filteredProperties.length > 3 && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      className="px-8 bg-[#A52A2A] text-white hover:bg-[#8B1A1A] border-[#A52A2A]"
                      onClick={() => {
                        window.location.href = "/invest";
                        setTimeout(() => window.scrollTo(0, 0), 100);
                      }}
                    >
                      View All Properties
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {user?.userType === "business" ? (
                <TabsContent value="send-reports" className="mt-6">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Send Property Reports</h3>
                      <p className="text-neutral-600">Send updates and reports to investors for your properties</p>
                    </div>
                    
                    {filteredProperties.length === 0 ? (
                      <div className="text-center py-8">
                        <Building className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Properties Listed</h3>
                        <p className="text-neutral-500">You need to list properties before you can send reports to investors.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProperties.map((property) => (
                          <Card key={property.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-neutral-900">{property.address}</h4>
                                  <p className="text-sm text-neutral-600">{property.city}, {property.state}</p>
                                  <p className="text-xs text-neutral-500 mt-1">Active Investors: {property.currentShares || 0} shares sold</p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setSelectedPropertyForReport(property);
                                    setShowPropertyReportModal(true);
                                  }}
                                  className="bg-[#A52A2A] hover:bg-[#8B1A1A]"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Report
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              ) : (
                <TabsContent value="investor-reports" className="mt-6">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your Investment Reports</h3>
                      <p className="text-neutral-600">View reports and updates from property owners</p>
                    </div>
                    
                    {filteredProperties.filter(property => hasUserInvested(property.id)).length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No Investments Yet</h3>
                        <p className="text-neutral-500">Start investing in properties to receive reports from business owners.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProperties.filter(property => hasUserInvested(property.id)).map((property) => (
                          <Card key={property.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-neutral-900">{property.address}</h4>
                                  <p className="text-sm text-neutral-600">{property.city}, {property.state}</p>
                                  <p className="text-xs text-neutral-500 mt-1">Your Investment: Active</p>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPropertyForReport(property);
                                    setShowInvestorReportsModal(true);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Reports
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
      {/* Heat Map Section - Only for Gold Members */}
      {properties.length > 0 && (user as any)?.membershipType === "gold" && (
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
          onClose={completeOnboarding}
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
              window.location.href = "/invest";
            }
          }}
        />

        {/* Secure Withdrawal Modal */}
        <Dialog
          open={showWithdrawalModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowWithdrawalModal(false);
              setWithdrawalStep("password");
              setWithdrawalPassword("");
              setSmsCode("");
              setWithdrawalAmount("");
              setSelectedBankAccount("");
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Secure Withdrawal
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Step 1: Password Verification */}
              {withdrawalStep === "password" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Verify Your Password</h3>
                    <p className="text-sm text-gray-600">
                      Enter your account password to continue
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">
                        Available Balance:
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        ${((portfolio?.totalValue || 0) * 0.8).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="withdrawal-amount">
                      Withdrawal Amount ($)
                    </Label>
                    <Input
                      id="withdrawal-amount"
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={(portfolio?.totalValue || 0) * 0.8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdrawal-password">Password</Label>
                    <Input
                      id="withdrawal-password"
                      type="password"
                      value={withdrawalPassword}
                      onChange={(e) => setWithdrawalPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      if (withdrawalPassword && withdrawalAmount) {
                        setWithdrawalStep("sms");
                        toast({
                          title: "SMS Sent",
                          description: "Verification code sent to your phone",
                        });
                      }
                    }}
                    className="w-full bg-[#A52A2A] hover:bg-[#8B1A1A]"
                    disabled={!withdrawalPassword || !withdrawalAmount}
                  >
                    Continue to SMS Verification
                  </Button>
                </div>
              )}

              {/* Step 2: SMS Verification */}
              {withdrawalStep === "sms" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">SMS Verification</h3>
                    <p className="text-sm text-gray-600">
                      Enter the 6-digit code sent to your phone
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="sms-code">Verification Code</Label>
                    <Input
                      id="sms-code"
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setWithdrawalStep("password")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (smsCode.length === 6) {
                          setWithdrawalStep("confirm");
                        }
                      }}
                      className="flex-1 bg-[#A52A2A] hover:bg-[#8B1A1A]"
                      disabled={smsCode.length !== 6}
                    >
                      Verify Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {withdrawalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Confirm Withdrawal</h3>
                    <p className="text-sm text-gray-600">
                      Review your withdrawal details
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bank-account">Select Bank Account</Label>
                    <Select
                      value={selectedBankAccount}
                      onValueChange={setSelectedBankAccount}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose bank account for withdrawal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chase-checking">
                          Chase Bank - Checking ****1234
                        </SelectItem>
                        <SelectItem value="bofa-savings">
                          Bank of America - Savings ****5678
                        </SelectItem>
                        <SelectItem value="wells-checking">
                          Wells Fargo - Checking ****9012
                        </SelectItem>
                        <SelectItem value="citi-savings">
                          Citibank - Savings ****3456
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="font-medium">
                        ${parseFloat(withdrawalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Processing Fee:
                      </span>
                      <span className="font-medium">$2.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Destination:
                      </span>
                      <span className="font-medium">
                        {selectedBankAccount
                          ? selectedBankAccount
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Net Amount:</span>
                      <span className="font-semibold">
                        ${(parseFloat(withdrawalAmount) - 2.5).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setWithdrawalStep("sms")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedBankAccount) {
                          toast({
                            title: "Withdrawal Initiated",
                            description:
                              "Your withdrawal request has been submitted and will be processed within 2-3 business days.",
                          });
                          setShowWithdrawalModal(false);
                        }
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!selectedBankAccount}
                    >
                      Confirm Withdrawal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <SocialShareModal
          isOpen={showSocialShare}
          onClose={() => {
            setShowSocialShare(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />

        {/* Date Picker Dialog */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent className="max-w-lg sm:max-w-lg top-[60%] translate-y-[-40%]">
            <DialogHeader>
              <DialogTitle>Select Date Range</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowDatePicker(false);
                  // Reset dates when cancelled
                  setDateFrom(undefined);
                  setDateTo(undefined);
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (dateFrom && dateTo) {
                      const dateRangeText = `${format(dateFrom, "MMM dd")} - ${format(dateTo, "MMM dd")}`;
                      setPropertyFilter(dateRangeText);
                      setInvestmentFilter(dateRangeText);
                      setWalletFilter(dateRangeText);
                    }
                    setShowDatePicker(false);
                    // Reset dates for next use
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                  disabled={!dateFrom || !dateTo}
                  className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <PropertyReportModal
          isOpen={showPropertyReportModal}
          onClose={() => {
            setShowPropertyReportModal(false);
            setSelectedPropertyForReport(null);
          }}
          property={selectedPropertyForReport}
        />

        <InvestorReportsModal
          isOpen={showInvestorReportsModal}
          onClose={() => {
            setShowInvestorReportsModal(false);
            setSelectedPropertyForReport(null);
          }}
          property={selectedPropertyForReport}
        />

        <Footer />
      </>
    </div>
  );
}
