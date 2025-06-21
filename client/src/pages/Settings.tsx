import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CreditCard, Shield, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    userType: "investor"
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isGoldMember, setIsGoldMember] = useState(false);

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Information
                <div className="flex gap-2">
                  <Badge variant={profile.userType === "business" ? "default" : "secondary"}>
                    {profile.userType === "business" ? "Business" : "Investor"}
                  </Badge>
                  {isGoldMember && (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Gold Member
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <Label htmlFor="userType">Account Type</Label>
                <Select value={profile.userType} onValueChange={(value) => setProfile({ ...profile, userType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">Investor - Invest in Properties</SelectItem>
                    <SelectItem value="business">Business - List Your Properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleProfileSave} className="bg-black text-white hover:bg-gray-200 hover:text-black">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isGoldMember && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Crown className="h-5 w-5 text-yellow-600" />
                          Upgrade to Gold Member
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Access Web3 properties and exclusive blockchain-protected ownership features
                        </p>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">$99/month</p>
                      </div>
                      <Button onClick={handleUpgradeToGold} className="bg-yellow-500 text-white hover:bg-yellow-600">
                        Upgrade Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Credit & Debit Cards</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No payment methods added yet</p>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-200">
                    Add Credit Card
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">PayPal</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="h-12 w-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <p className="text-gray-500 mb-4">PayPal not connected</p>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-200">
                    Connect PayPal
                  </Button>
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                />
              </div>
              
              <Button onClick={handlePasswordChange} className="bg-black text-white hover:bg-gray-200 hover:text-black">
                Change Password
              </Button>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-500">Receive codes via text message</p>
                  </div>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-200">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}