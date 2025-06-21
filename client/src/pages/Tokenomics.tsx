import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Zap
} from "lucide-react";

function Tokenomics() {
  const exampleProperty = {
    value: 400000,
    squareFootage: 2000,
    address: "1909 E Ferry Street, Detroit"
  };

  // Core Formula Calculations
  const baseTokenPrice = exampleProperty.value / exampleProperty.squareFootage; // $200
  const maxTokenizedValue = exampleProperty.value * 0.49; // $196,000
  const platformFee = 0.05;
  const finalTokenPrice = baseTokenPrice * (1 + platformFee); // $210
  const tokenSupply = Math.floor(maxTokenizedValue / baseTokenPrice); // 980 tokens
  const minPurchaseTokens = finalTokenPrice < 100 ? 5 : 1;

  // Tier Calculations
  const founderTierTokens = Math.floor(tokenSupply * 0.10);
  const communityTierTokens = Math.floor(tokenSupply * 0.30);
  const daoTierTokens = tokenSupply - founderTierTokens - communityTierTokens;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 safe-area-inset">
      <div className="container-mobile max-w-7xl mx-auto space-mobile py-6 sm:py-8">
        {/* Header */}
        <div className="text-center space-mobile">
          <h1 className="heading-responsive font-bold text-neutral-900">
            40 Acres Tokenomics
          </h1>
          <p className="text-responsive text-neutral-600 max-w-3xl mx-auto">
            Democratizing real estate investment through compliant tokenization, 
            investor protection, and community-driven ownership
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
          </div>
        </div>

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

        {/* Dynamic Supply Strategy */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={20} />
                Scarcity Model
              </CardTitle>
              <p className="text-sm text-neutral-600">Properties under $500,000</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">10,000</div>
                  <div className="text-sm text-neutral-600">Token Cap</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Higher token price</span>
                    <span className="font-semibold">Premium positioning</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Limited supply</span>
                    <span className="font-semibold">Increased scarcity</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Access Model
              </CardTitle>
              <p className="text-sm text-neutral-600">Properties $500,000+</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100,000</div>
                  <div className="text-sm text-neutral-600">Token Cap</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lower token price</span>
                    <span className="font-semibold">Accessible entry</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Higher liquidity</span>
                    <span className="font-semibold">Broader participation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investor Tier Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Crown size={24} />
              Investor Tier System
            </CardTitle>
            <p className="text-neutral-600">Gradual rollout benefits that reward early and committed investors</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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
            <p className="text-red-700">Multiple layers of security and compliance to protect your investment</p>
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

        {/* Revenue Maximization */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <DollarSign size={24} />
              Revenue Maximization Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">Tiered Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div>Start: $150/token</div>
                  <div>Mid: $200/token</div>
                  <div>Final: $250/token</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">Time-Based Bonuses</h4>
                <div className="space-y-2 text-sm">
                  <div>Early investor bonus yield</div>
                  <div>Airdropped bonus tokens</div>
                  <div>Priority in future offerings</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">Bundle Perks</h4>
                <div className="space-y-2 text-sm">
                  <div>5+ tokens: Free merch/NFT</div>
                  <div>20+ tokens: Voting + access</div>
                  <div>Multiple properties: Loyalty benefits</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Calculation */}
        <Card className="bg-gradient-to-r from-neutral-50 to-blue-50 border-neutral-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calculator size={24} />
              Live Example: {exampleProperty.address}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Component</th>
                    <th className="text-left p-3">Formula</th>
                    <th className="text-left p-3">Calculation</th>
                    <th className="text-left p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="p-3 font-medium">Token Price</td>
                    <td className="p-3">Property Value ÷ Sq Ft</td>
                    <td className="p-3">${exampleProperty.value.toLocaleString()} ÷ {exampleProperty.squareFootage.toLocaleString()}</td>
                    <td className="p-3 font-bold">${baseTokenPrice.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Max Tokenized Value</td>
                    <td className="p-3">Property Value × 0.49</td>
                    <td className="p-3">${exampleProperty.value.toLocaleString()} × 49%</td>
                    <td className="p-3 font-bold">${maxTokenizedValue.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Token Supply</td>
                    <td className="p-3">Max Value ÷ Token Price</td>
                    <td className="p-3">${maxTokenizedValue.toLocaleString()} ÷ ${baseTokenPrice.toFixed(2)}</td>
                    <td className="p-3 font-bold">{tokenSupply.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Final Price (with fee)</td>
                    <td className="p-3">Token Price × 1.05</td>
                    <td className="p-3">${baseTokenPrice.toFixed(2)} × 105%</td>
                    <td className="p-3 font-bold">${finalTokenPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Min Purchase</td>
                    <td className="p-3">If &lt; $100 → 5 tokens</td>
                    <td className="p-3">N/A (price is ${finalTokenPrice.toFixed(2)})</td>
                    <td className="p-3 font-bold">{minPurchaseTokens} token</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join thousands of investors building wealth through tokenized real estate
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
              View Properties
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Download App Section */}
      <section className="py-16 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Download the 40 Acres Wallet App</h2>
              <p className="text-lg text-white mb-6">
                Take your real estate investments anywhere. Manage your portfolio, track earnings, and invest on the go with our secure mobile wallet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-black hover:bg-gray-200 flex items-center gap-2 px-6 py-3">
                  <Smartphone size={20} />
                  Download for iOS
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black flex items-center gap-2 px-6 py-3">
                  <Download size={20} />
                  Download for Android
                </Button>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Digital Wallet</h3>
                <p className="text-sm text-white">Store and manage your real estate tokens securely</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Portfolio Tracking</h3>
                <p className="text-sm text-white">Monitor your investments and earnings in real-time</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-white">Bank-level encryption for all wallet transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Tokenomics;