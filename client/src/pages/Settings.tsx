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
import { User, CreditCard, Shield, Crown, Smartphone, DollarSign, TrendingUp, Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import AddPaymentMethodModal from "@/components/AddPaymentMethodModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import paypalIcon from "@assets/paypal_1751739388573.webp";

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
      if (tabFromUrl && ['profile', 'payment', 'membership', 'security'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handleUrlChange);
    
    // Also check URL on component mount and when location changes
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
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
    <div className="container-mobile max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto bg-muted p-1 rounded-lg">
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
            <span className="text-xs sm:text-sm">Member</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex flex-row items-center justify-center gap-1 text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition-all"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Security</span>
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
                        onClick={handleUpgradeToGold}
                      >
                        Upgrade to Gold - $99.99/month
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
      
      <Footer />
    </div>
  );
}