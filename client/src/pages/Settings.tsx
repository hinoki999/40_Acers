import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CreditCard, Shield, Crown, Smartphone, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
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
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isGoldMember, setIsGoldMember] = useState(false);
  const [membershipTier, setMembershipTier] = useState<"Free" | "Gold">("Free");

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: (user as any)?.firstName || "",
        lastName: (user as any)?.lastName || "",
        email: (user as any)?.email || "",
        companyName: (user as any)?.businessName || "",
        userType: (user as any)?.userType || "investor"
      });
    }
  }, [user]);

  const handleProfileSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Membership
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture Section */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
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
                <div>
                  <h3 className="font-semibold text-lg">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
              <Button onClick={handleProfileSave} className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white">Save Changes</Button>
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
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="h-12 w-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold">
                    💳
                  </div>
                  <p className="text-gray-500 mb-4">No payment methods added</p>
                  <Button variant="outline" className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white">Add Payment Method</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">PayPal</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="h-12 w-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <p className="text-gray-500 mb-4">PayPal not connected</p>
                  <Button variant="outline" className="border-[#A52A2A] text-[#A52A2A] hover:bg-[#A52A2A] hover:text-white">Connect PayPal</Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Badge className="bg-yellow-500 text-black">Recommended</Badge>
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
                    <div className="text-2xl font-bold">$99.99/month</div>
                    <Button onClick={handleUpgradeToGold} className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-black">
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
              
              <Button onClick={handlePasswordChange} className="w-fit">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Footer />
    </div>
  );
}