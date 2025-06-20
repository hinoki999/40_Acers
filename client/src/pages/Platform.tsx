import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Shield, 
  Crown, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Lock, 
  RefreshCw,
  FileText,
  CheckCircle,
  AlertTriangle,
  Zap,
  Upload,
  Eye,
  Download,
  Building2,
  Briefcase,
  Target,
  Award,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function Platform() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  // Document upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document uploaded successfully" });
      setSelectedFile(null);
    },
    onError: () => {
      toast({ title: "Upload failed", variant: "destructive" });
    },
  });

  const handleFileUpload = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentType", "general");
    formData.append("category", "platform_info");
    
    uploadMutation.mutate(formData);
  };

  // Example tokenomics calculations
  const exampleProperty = {
    value: 575000,
    squareFootage: 27000,
    address: "1909 E Ferry Street, Detroit"
  };

  const baseTokenPrice = exampleProperty.value / exampleProperty.squareFootage;
  const maxTokenizedValue = exampleProperty.value * 0.49;
  const finalTokenPrice = baseTokenPrice * 1.05;
  const tokenSupply = Math.floor(maxTokenizedValue / baseTokenPrice);
  const founderTierTokens = Math.floor(tokenSupply * 0.10);
  const communityTierTokens = Math.floor(tokenSupply * 0.30);
  const daoTierTokens = tokenSupply - founderTierTokens - communityTierTokens;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900">
            40 Acres Platform
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Complete real estate tokenization platform with investor protection, 
            document verification, and compliance-first architecture
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Shield size={16} className="mr-2" />
              SEC Reg CF Compliant
            </Badge>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              <CheckCircle size={16} className="mr-2" />
              NMTC Compatible
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2">
              <FileText size={16} className="mr-2" />
              Document Verified
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="documents">Documentation</TabsTrigger>
            <TabsTrigger value="business">Business Model</TabsTrigger>
          </TabsList>

          {/* Platform Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 size={20} />
                    Real Estate Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 mb-4">
                    Democratizing access to premium real estate investments through fractional ownership and blockchain technology.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Properties Listed</span>
                      <span className="font-semibold">3 Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Value</span>
                      <span className="font-semibold">$2.07M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available Tokens</span>
                      <span className="font-semibold">40,095</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Investor Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 mb-4">
                    Multiple layers of security including escrow protection, regulatory compliance, and transparent reporting.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-600" />
                      <span>49% Legal Compliance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-600" />
                      <span>Escrow Protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-600" />
                      <span>Lock-up Periods</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown size={20} />
                    Investor Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 mb-4">
                    Graduated benefits system rewarding early adopters and committed investors with exclusive perks.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Founder Tier</span>
                      <span className="font-semibold">10% Supply</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Community Tier</span>
                      <span className="font-semibold">30% Supply</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>DAO Members</span>
                      <span className="font-semibold">60% Supply</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calculator size={24} className="text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Smart Tokenization</h4>
                    <p className="text-sm text-neutral-600">Automated pricing based on property value and square footage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Document Verification</h4>
                    <p className="text-sm text-neutral-600">Lawyer-verified legal documents and property records</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp size={24} className="text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Real-time Analytics</h4>
                    <p className="text-sm text-neutral-600">Live performance tracking and investment insights</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield size={24} className="text-red-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Secure Payments</h4>
                    <p className="text-sm text-neutral-600">Multi-signature wallets and escrow protection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics" className="space-y-6">
            {/* Core Formula */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Calculator size={24} />
                  Core Tokenization Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-3">1. Token Price</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">Property Value ÷ Square Footage</div>
                      <div className="text-2xl font-bold text-purple-600">
                        ${baseTokenPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        ${exampleProperty.value.toLocaleString()} ÷ {exampleProperty.squareFootage.toLocaleString()} sq ft
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-3">2. Max Tokenized Value</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">49% of Property Value</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${maxTokenizedValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Legal compliance protection
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-3">3. Token Supply</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">Max Value ÷ Token Price</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {tokenSupply.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Final price: ${finalTokenPrice.toFixed(2)} (+5% platform fee)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investor Tiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Crown size={24} />
                  Investor Tier System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Founder Tier */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Crown size={24} className="text-amber-600" />
                      <div>
                        <h3 className="text-xl font-bold text-amber-700">Founder Tier</h3>
                        <p className="text-sm text-amber-600">First 10% of token supply</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-700">
                        {founderTierTokens.toLocaleString()}
                      </div>
                      <div className="text-sm text-amber-600">tokens available</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>NFT Certificate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Lifetime Yield Bonus</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Free Event Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Exclusive Updates</span>
                    </div>
                  </div>
                </div>

                {/* Community Tier */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Users size={24} className="text-blue-600" />
                      <div>
                        <h3 className="text-xl font-bold text-blue-700">Community Tier</h3>
                        <p className="text-sm text-blue-600">Next 30% of token supply</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        {communityTierTokens.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">tokens available</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Monthly Reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Voting Rights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Merch Discounts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Community Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Investment Analytics</span>
                    </div>
                  </div>
                </div>

                {/* DAO Member */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={24} className="text-green-600" />
                      <div>
                        <h3 className="text-xl font-bold text-green-700">DAO Member</h3>
                        <p className="text-sm text-green-600">Remaining 60% of token supply</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">
                        {daoTierTokens.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">tokens available</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>View-only Rights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Basic Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Upgrade Options</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Standard Reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>Community Forum</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investor Protections */}
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-red-800">
                  <Shield size={24} />
                  Investor Protection Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <Lock size={20} className="text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Lock-up Period</h4>
                        <p className="text-sm text-neutral-600">6-12 months minimum hold prevents speculation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <TrendingUp size={20} className="text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Soft Cap Rule</h4>
                        <p className="text-sm text-neutral-600">Funds only released after 60% tokens sold</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <RefreshCw size={20} className="text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Refund Protocol</h4>
                        <p className="text-sm text-neutral-600">Full BTC/USD refund if soft cap not met</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <Shield size={20} className="text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Escrow Holding</h4>
                        <p className="text-sm text-neutral-600">Multisig wallet protection until milestones met</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload size={20} />
                    Upload Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-neutral-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleFileUpload}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="w-full"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                  </Button>
                </CardContent>
              </Card>

              {/* Document Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} />
                    Document Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="font-medium">Properties Verified</span>
                      </div>
                      <Badge className="bg-green-600 text-white">3 Complete</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-blue-600" />
                        <span className="font-medium">Under Review</span>
                      </div>
                      <Badge className="bg-blue-600 text-white">0 Pending</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-yellow-600" />
                        <span className="font-medium">Needs Attention</span>
                      </div>
                      <Badge className="bg-yellow-600 text-white">0 Issues</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document List */}
            <Card>
              <CardHeader>
                <CardTitle>Properties Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-600">Loading documents...</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
                    <p className="text-neutral-600 mb-2">No documents uploaded yet</p>
                    <p className="text-sm text-neutral-500">Upload property documents to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.originalName}</p>
                            <p className="text-sm text-neutral-600">
                              {doc.documentType} • {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              doc.status === 'verified' ? 'bg-green-600 text-white' :
                              doc.status === 'under_review' ? 'bg-blue-600 text-white' :
                              'bg-yellow-600 text-white'
                            }
                          >
                            {doc.status === 'verified' ? 'Verified' :
                             doc.status === 'under_review' ? 'Under Review' :
                             'Pending'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Model Tab */}
          <TabsContent value="business" className="space-y-6">
            {/* Business Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 size={20} />
                    Platform Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 leading-relaxed">
                    40 Acres democratizes real estate investment by enabling fractional ownership 
                    through compliant tokenization. Our platform bridges traditional real estate 
                    with modern blockchain technology, creating accessible investment opportunities 
                    for everyone.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    Mission Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 leading-relaxed">
                    To create wealth-building opportunities through transparent, secure, 
                    and legally compliant real estate tokenization, empowering communities 
                    to participate in property ownership regardless of their investment size.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Model */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} />
                  Revenue Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign size={24} className="text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Platform Fees</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">5%</p>
                    <p className="text-sm text-neutral-600">Transaction fee on all token purchases</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase size={24} className="text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Management Fees</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">2-3%</p>
                    <p className="text-sm text-neutral-600">Annual property management and administration</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award size={24} className="text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Premium Services</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-2">Tiered</p>
                    <p className="text-sm text-neutral-600">Advanced analytics and exclusive access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-neutral-600">248-250-4510</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-neutral-600">contact@40acres.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-neutral-600">Detroit, Michigan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Current Investment Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">1909 E Ferry Street</h4>
                      <p className="text-sm text-neutral-600">Industrial • 27,000 sq ft • $575,000</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$22.36</p>
                      <p className="text-sm text-neutral-600">per token</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">3335 Twenty-Third Street</h4>
                      <p className="text-sm text-neutral-600">Office • 46,278 sq ft • $795,000</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$18.04</p>
                      <p className="text-sm text-neutral-600">per token</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">23001-23005 Gratiot Avenue</h4>
                      <p className="text-sm text-neutral-600">Commercial • 8,553 sq ft • $700,000</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$85.93</p>
                      <p className="text-sm text-neutral-600">per token</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}