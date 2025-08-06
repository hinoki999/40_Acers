import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CreditCard, Shield, Crown, Smartphone, DollarSign, TrendingUp, Plus, Trash2, X, History, Search, Download, Calendar, MapPin, AlertTriangle, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import Footer from "@/components/Footer";
import AddPaymentMethodModal from "@/components/AddPaymentMethodModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import paypalIcon from "@assets/paypal_1751739388573.webp";

// Transaction History List Component
function TransactionHistoryList({ period, searchTerm, onTransactionClick }: { period: string; searchTerm: string; onTransactionClick: (transaction: any) => void }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions", period],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Filter transactions based on period and search term
  const filteredTransactions = transactions.filter((transaction: any) => {
    const now = new Date();
    const transactionDate = new Date(transaction.createdAt);
    
    // Period filtering
    let periodMatch = true;
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      periodMatch = transactionDate >= weekAgo;
    } else if (period === "30days") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      periodMatch = transactionDate >= monthAgo;
    } else if (period === "60days") {
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      periodMatch = transactionDate >= twoMonthsAgo;
    }
    
    // Search filtering
    const searchMatch = !searchTerm || 
      transaction.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return periodMatch && searchMatch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
        <p className="text-gray-600">
          {searchTerm ? "No transactions match your search criteria." : "You haven't made any transactions yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction: any) => (
        <div 
          key={transaction.id} 
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onTransactionClick(transaction)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">
                {transaction.type === 'investment' ? 'Investment Purchase' : transaction.type}
              </h4>
              <p className="text-sm text-gray-600">{transaction.propertyAddress}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === 'investment' ? 'text-red-600' : 'text-green-600'}`}>
                {transaction.type === 'investment' ? '-' : '+'}${transaction.amount}
              </p>
              <p className="text-xs text-gray-500">
                {transaction.shares && `${transaction.shares} shares`}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Transaction ID: {transaction.id}</span>
            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const queryClient = useQueryClient();
  
  // Get tab from URL parameters
  const [activeTab, setActiveTab] = useState('profile');
  

  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    userType: "investor",
    profileImage: ""
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isGoldMember, setIsGoldMember] = useState(false);
  const [membershipTier, setMembershipTier] = useState<"Free" | "Gold">("Free");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: ""
  });
  
  // Transaction History state
  const [transactionPeriod, setTransactionPeriod] = useState("lifetime");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [userBalance] = useState(0); // In real app, this would come from API

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: (user as any)?.firstName || "",
        lastName: (user as any)?.lastName || "",
        email: (user as any)?.email || "",
        companyName: (user as any)?.businessName || "",
        userType: (user as any)?.userType || "investor",
        profileImage: ""
      });
    }
  }, [user]);

  // PDF Download Function
  const downloadTransactionPDF = (transaction: any) => {
    // Create PDF content as text
    const pdfContent = `
40 Acres - Transaction Receipt
=============================

Transaction ID: ${transaction.id}
Date: ${new Date(transaction.createdAt).toLocaleDateString()}
Type: ${transaction.type === 'investment' ? 'Investment Purchase' : transaction.type}
Property: ${transaction.propertyAddress}
Amount: $${transaction.amount}
${transaction.shares ? `Shares: ${transaction.shares}` : ''}
${transaction.shares ? `Price per Share: $${(transaction.amount / transaction.shares).toFixed(2)}` : ''}
Status: Completed

Thank you for investing with 40 Acres!
    `.trim();

    // Create a blob with the content
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `40-acres-transaction-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Transaction receipt has been downloaded successfully.",
    });
  };

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest('PUT', '/api/user/profile', profileData);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      // Invalidate the user query to refresh the cached user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      console.log("Profile updated successfully:", updatedUser);
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSave = () => {
    const profileData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      userType: profile.userType,
      businessName: profile.companyName,
      profileImageUrl: profile.profileImage
    };
    
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleUpgradeToGold = () => {
    toast({
      title: "Upgrade to Gold",
      description: "Redirecting to payment page...",
    });
  };

  const handleUpgradePayment = async (paymentType: string, paymentMethod?: any) => {
    try {
      toast({
        title: "Processing Payment",
        description: `Processing your Gold membership upgrade via ${paymentType === 'paypal' ? 'PayPal' : 'Credit Card'}...`,
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setShowUpgradeModal(false);
      
      toast({
        title: "Upgrade Successful!",
        description: "Welcome to Gold membership! Your premium features are now active.",
      });

      // In a real app, this would update the user's membership tier in the backend
      // For now, we'll just show success
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = () => {
    if (userBalance > 0) {
      toast({
        title: "Account Deletion Failed",
        description: "Your balance must be $0.00 to close account. Please withdraw all funds before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!deletePassword) {
      toast({
        title: "Password Required",
        description: "Please enter your password to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Deletion Initiated",
      description: "Your account will be permanently deleted after 60 days. You can cancel this process by logging in again.",
    });
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  const handlePauseMembership = () => {
    toast({
      title: "Membership Paused",
      description: "Your membership has been paused. You can reactivate it at any time from your account settings.",
    });
    setShowDeleteModal(false);
    setDeletePassword("");
  };

  const handleAddPaymentMethod = (paymentMethod: any) => {
    setPaymentMethods([...paymentMethods, paymentMethod]);
  };

  const handleRemovePaymentMethod = (paymentMethodId: number) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== paymentMethodId));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  // Watch for URL changes and update active tab accordingly
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl && ['profile', 'payment', 'membership', 'security', 'transactions'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    };

    // Handle custom events from Header component for tab changes when already on settings page
    const handleTabChange = (event: CustomEvent) => {
      const { tab } = event.detail;
      if (['profile', 'payment', 'membership', 'security', 'transactions'].includes(tab)) {
        setActiveTab(tab);
        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url.toString());
      }
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('changeSettingsTab', handleTabChange as EventListener);
    
    // Also check URL on component mount and when location changes
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('changeSettingsTab', handleTabChange as EventListener);
    };
  }, [location]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Please login to access settings</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-mobile max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto bg-muted p-1 rounded-lg">
          <TabsTrigger 
            value="profile" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Payment</span>
          </TabsTrigger>
          <TabsTrigger 
            value="membership" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Membership</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 rounded-full h-6 w-6 sm:h-8 sm:w-8 p-0 bg-[#A52A2A] hover:bg-[#8B1A1A] text-white text-xs sm:text-sm"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  >
                    +
                  </Button>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setProfile({...profile, profileImage: e.target?.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="text-center sm:text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg break-words">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-gray-600 text-sm sm:text-base break-all">{user?.email}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white text-xs sm:text-sm px-3 py-1"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="userType">Account Type</Label>
                <Select value={profile.userType} onValueChange={(value) => setProfile({...profile, userType: value})}>
                  <SelectTrigger className="hover:border-[#A52A2A] focus:border-[#A52A2A] focus:ring-[#A52A2A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor" className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">Investor</SelectItem>
                    <SelectItem value="business" className="hover:bg-[#A52A2A] hover:text-white focus:bg-[#A52A2A] focus:text-white">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {profile.userType === "business" && (
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profile.companyName}
                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  />
                </div>
              )}
              <Button 
                onClick={handleProfileSave} 
                disabled={updateProfileMutation.isPending}
                className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Credit/Debit Cards</h3>
                {paymentMethods.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <div className="h-12 w-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold">
                      💳
                    </div>
                    <p className="text-gray-500 mb-4">No payment methods added</p>
                    <Button 
                      onClick={() => setShowAddPaymentModal(true)}
                      variant="outline" 
                      className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
                    >
                      Add Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <Card key={pm.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="font-medium">**** **** **** {pm.last4}</p>
                                <p className="text-sm text-gray-600">
                                  {pm.type} • Expires {pm.expiryMonth}/{pm.expiryYear}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {pm.billingAddress.city}, {pm.billingAddress.state} {pm.billingAddress.zipCode}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {pm.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePaymentMethod(pm.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button
                      onClick={() => setShowAddPaymentModal(true)}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">PayPal</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
                    <img src={paypalIcon} alt="PayPal" className="h-12 w-12 object-contain" />
                  </div>
                  <p className="text-gray-500 mb-4">PayPal not connected</p>
                  <Button 
                    onClick={() => setShowPayPalModal(true)}
                    variant="outline" 
                    className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
                  >
                    Connect PayPal
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">40 Acres Wallet</h3>
                <div className={`border-2 rounded-lg p-6 ${membershipTier === 'Gold' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-gray-300 bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold ${membershipTier === 'Gold' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gray-400'}`}>
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${membershipTier !== 'Gold' ? 'text-gray-500' : ''}`}>Connect Your 40 Acres Wallet</h4>
                        <p className={`text-sm ${membershipTier === 'Gold' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {membershipTier === 'Gold' ? 'Secure digital wallet for real estate investments' : 'Requires Gold Member subscription'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {membershipTier !== 'Gold' && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">Upgrade to Gold Member to access the 40 Acres Wallet</p>
                      <Button 
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-[#A52A2A]"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        Upgrade to Gold - $99.99/year
                      </Button>
                    </div>
                  )}
                  
                  {membershipTier === 'Gold' && (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Portfolio Value</span>
                            <span className="text-lg font-bold text-green-600">$0</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                            <div>Properties: 0</div>
                            <div>Total Tokens: 0</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs font-medium">Track Earnings</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xs font-medium">Monitor Performance</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <Shield className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                            <p className="text-xs font-medium">Secure Storage</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Connect 40 Acres Wallet</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Membership Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Basic Plan */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Basic (Free)</h3>
                    <Badge variant="secondary">Current Plan</Badge>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Basic property investing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Fiat USD payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Standard property listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Basic analytics</span>
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold">Free</div>
                </div>

                {/* Gold Plan */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-orange-50 relative">
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-yellow-500 text-white">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Gold Member
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Everything in Basic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Cryptocurrency investing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Blockchain ownership proof</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Premium real estate agents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Advanced market heat map</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Exclusive property listings</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">$99.99/year</div>
                    <Button onClick={handleUpgradeToGold} className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black">
                      Upgrade to Gold
                    </Button>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Billing History</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">January 2025</div>
                      <div className="text-sm text-gray-600">Basic Plan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$0.00</div>
                      <Badge variant="outline" className="text-xs">Free</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="border-t pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-800 mb-4">
                        Permanently delete your 40 Acres account and all associated data. This action cannot be undone.
                      </p>
                      
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-red-900 mb-2">Important Information:</h5>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• You must have a $0.00 balance before closing your account</li>
                          <li>• For security measures, your account will be permanently deleted after 60 days</li>
                          <li>• All investment data, transaction history, and documents will be removed</li>
                          <li>• This action cannot be reversed once confirmed</li>
                        </ul>
                      </div>

                      <Button 
                        variant="destructive"
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                />
              </div>
              
              <Button onClick={handlePasswordChange} className="w-fit bg-[#A52A2A] hover:bg-[#8B1A1A] text-white">
                Update Password
              </Button>
              
              {/* KYC/AML Verification */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Identity Verification (KYC/AML)
                </h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-yellow-900">Verification Required</h5>
                        <p className="text-sm text-yellow-800">To comply with regulations and secure your account, please complete identity verification through our trusted partner Veriff.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Identity Verification</h4>
                      <p className="text-sm text-gray-600">Verify your identity using government-issued ID</p>
                      <p className="text-xs text-gray-500">Powered by Veriff - Secure and encrypted</p>
                    </div>
                    <Button 
                      className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white w-full sm:w-auto text-sm px-3 py-2"
                      onClick={() => {
                        toast({
                          title: "Verification Started",
                          description: "Redirecting to Veriff for secure identity verification...",
                        });
                        // In production, this would redirect to Veriff
                        window.open('https://veriff.com', '_blank');
                      }}
                    >
                      Start Verification
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-500">Address Verification</h4>
                      <p className="text-sm text-gray-400">Verify your residential address</p>
                      <p className="text-xs text-gray-400">Available after identity verification</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      Pending
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">SMS Authentication</h4>
                      <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
                    >
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Authenticator App</h4>
                      <p className="text-sm text-gray-600">Use Google Authenticator or similar apps</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
                    >
                      Setup
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">Enhanced Security</h5>
                        <p className="text-sm text-blue-800">Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2">Search Transactions</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by property name or transaction type..."
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-40">
                  <Label className="text-sm font-medium mb-2">Time Period</Label>
                  <Select value={transactionPeriod} onValueChange={setTransactionPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="60days">60 Days</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transaction List */}
              <TransactionHistoryList 
                period={transactionPeriod} 
                searchTerm={transactionSearch}
                onTransactionClick={(transaction) => {
                  setSelectedTransaction(transaction);
                  setShowTransactionModal(true);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onSave={handleAddPaymentMethod}
      />

      {/* PayPal Connection Modal */}
      <Dialog open={showPayPalModal} onOpenChange={setShowPayPalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <img src={paypalIcon} alt="PayPal" className="h-8 w-8 object-contain" />
              <DialogTitle>Connect to PayPal</DialogTitle>
            </div>
            <DialogDescription>
              Connect your PayPal account to make investments and receive earnings through your PayPal balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900">Secure Connection</h5>
                  <p className="text-sm text-blue-800">Your PayPal credentials are encrypted and securely stored. We never see your login information.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="paypal-email">PayPal Email Address</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="Enter your PayPal email"
                className="w-full"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPayPalModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "PayPal Connected",
                    description: "Your PayPal account has been successfully connected to 40 Acres.",
                  });
                  setShowPayPalModal(false);
                }}
                className="flex-1 bg-[#0070ba] hover:bg-[#005ea6] text-white"
              >
                <img src={paypalIcon} alt="PayPal" className="h-4 w-4 mr-2" />
                Connect PayPal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedTransaction.type === 'investment' ? 'Investment Purchase' : selectedTransaction.type}
                    </h3>
                    <p className="text-gray-600">{selectedTransaction.propertyAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xl ${selectedTransaction.type === 'investment' ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedTransaction.type === 'investment' ? '-' : '+'}${selectedTransaction.amount}
                    </p>
                    {selectedTransaction.shares && (
                      <p className="text-sm text-gray-500">{selectedTransaction.shares} shares</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Transaction ID</Label>
                    <p className="font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedTransaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Property</Label>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedTransaction.propertyAddress}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>

                {/* Additional Details */}
                {selectedTransaction.shares && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Share Details</Label>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm"><strong>Shares Purchased:</strong> {selectedTransaction.shares}</p>
                      <p className="text-sm"><strong>Price per Share:</strong> ${(selectedTransaction.amount / selectedTransaction.shares).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => downloadTransactionPDF(selectedTransaction)}
                  className="flex-1 bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade to Gold Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Upgrade to Gold Membership
            </DialogTitle>
            <DialogDescription>
              Choose your payment method to upgrade to Gold membership for $99.99/year
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Gold Benefits Summary */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Gold Member Benefits</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Cryptocurrency investing</li>
                <li>• Advanced market heat map</li>
                <li>• Premium real estate agents</li>
                <li>• 40 Acres Wallet access</li>
                <li>• Exclusive property listings</li>
              </ul>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Payment Method</Label>
              
              {/* Credit/Debit Cards */}
              {paymentMethods.filter(pm => pm.type === 'card').length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Credit/Debit Cards</p>
                  {paymentMethods
                    .filter(pm => pm.type === 'card')
                    .map((method) => (
                      <button
                        key={method.id}
                        className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                        onClick={() => handleUpgradePayment('card', method)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">•••• •••• •••• {method.lastFour}</p>
                              <p className="text-sm text-gray-600">{method.brand} • Expires {method.expMonth}/{method.expYear}</p>
                            </div>
                          </div>
                          <Badge variant="outline">Card</Badge>
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* PayPal */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">PayPal</p>
                <button
                  className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  onClick={() => handleUpgradePayment('paypal')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={paypalIcon} alt="PayPal" className="h-5 w-5" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-600">Pay with your PayPal balance</p>
                      </div>
                    </div>
                    <Badge variant="outline">PayPal</Badge>
                  </div>
                </button>
              </div>

              {/* No Payment Methods */}
              {paymentMethods.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="mb-3">No payment methods found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUpgradeModal(false);
                      setShowAddPaymentModal(true);
                    }}
                    className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white"
                  >
                    Add Payment Method
                  </Button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total (Annual)</span>
                <span className="text-xl font-bold">$99.99</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
                  disabled={paymentMethods.length === 0}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account Confirmation
            </DialogTitle>
            <DialogDescription>
              This action will permanently delete your account after 60 days. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Balance Check Warning */}
            {userBalance > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-900">Account Balance Warning</h5>
                    <p className="text-sm text-red-800">
                      Your balance must be $0.00 to close account. Please withdraw all funds before proceeding.
                    </p>
                    <p className="text-sm font-medium text-red-900 mt-1">
                      Current Balance: ${userBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Disclaimer:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• User must have $0.00 balance before closing account</li>
                <li>• For security measures, account will be permanently deleted after 60 days</li>
                <li>• All data including investments, transactions, and documents will be removed</li>
                <li>• This action cannot be undone once the 60-day period expires</li>
              </ul>
            </div>

            {/* Password Confirmation */}
            <div>
              <Label htmlFor="deletePassword">Enter your password to confirm</Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder="Your account password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Alternative Option */}
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Not ready to delete? Consider pausing your membership instead.
                </p>
                <Button
                  variant="outline"
                  onClick={handlePauseMembership}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Membership
                </Button>
              </div>

              {/* Main Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || userBalance > 0}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Proceed with Deletion
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      </div>
      <Footer />
    </div>
  );
}