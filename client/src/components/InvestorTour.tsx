import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Shield, 
  Target, 
  Calculator,
  CheckCircle,
  Eye,
  CreditCard,
  BarChart3,
  Wallet,
  Users,
  Star
} from "lucide-react";

interface InvestorTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onStartInvesting: () => void;
}

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  ctaText?: string;
  ctaAction?: () => void;
}

export default function InvestorTour({ isOpen, onClose, onComplete, onStartInvesting }: InvestorTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: TourStep[] = [
    {
      id: 1,
      title: "Welcome, Future Real Estate Investor!",
      description: "Start building wealth through fractional real estate",
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Invest in Real Estate with as Little as $100</h3>
          <p className="text-neutral-600 leading-relaxed">
            40 Acres makes real estate investing accessible to everyone. Own fractional shares in 
            properties, earn rental income, and benefit from property appreciation without the 
            traditional barriers of real estate investment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Low Minimum</h4>
              <p className="text-sm text-green-700">Start with any amount</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Diversify</h4>
              <p className="text-sm text-blue-700">Multiple properties</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Passive Income</h4>
              <p className="text-sm text-purple-700">Monthly distributions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How Crowdfunding Real Estate Works",
      description: "Understanding how multiple investors pool money to buy rental properties",
      icon: <Target className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">How Crowdfunding Real Estate Works</h3>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-bold text-blue-900 mb-4">Investment Example: $400,000 Property</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border">
                    <h5 className="font-semibold text-neutral-900 mb-2">Property Details</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Total Value: $400,000</li>
                      <li>• Size: 1,600 sq ft</li>
                      <li>• Total Shares: 160</li>
                      <li>• Price per Share: $2,500</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded border">
                    <h5 className="font-semibold text-neutral-900 mb-2">Your Investment</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Buy 4 shares = $10,000</li>
                      <li>• Your ownership: 2.5%</li>
                      <li>• Monthly income: ~$167</li>
                      <li>• Annual yield: ~8.5%</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded border border-green-300">
                  <h5 className="font-semibold text-green-800 mb-2">Why Crowdfunding Works</h5>
                  <p className="text-green-700 text-sm">
                    Multiple investors pool their money to buy rental properties. You get proportional rental income, 
                    property appreciation, and professional management without the hassles of being a landlord.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "Browse & Analyze Properties",
      description: "Find investments that match your goals",
      icon: <Eye className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Investment Research</h3>
            <p className="text-neutral-600">Every property comes with detailed analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Property Metrics
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Expected rental yield (6-12%)</li>
                  <li>• Historical appreciation rates</li>
                  <li>• Neighborhood market trends</li>
                  <li>• Walk score & amenities</li>
                  <li>• Crime ratings & schools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Assessment
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• AI-powered risk scoring</li>
                  <li>• Market volatility analysis</li>
                  <li>• Owner track record</li>
                  <li>• Property condition reports</li>
                  <li>• Legal document verification</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Investment Decision Process</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">1</div>
                <h5 className="font-medium text-sm">Browse Properties</h5>
                <p className="text-xs text-neutral-600">Filter by location, yield, price</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">2</div>
                <h5 className="font-medium text-sm">Analyze Details</h5>
                <p className="text-xs text-neutral-600">View metrics & documents</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">3</div>
                <h5 className="font-medium text-sm">Check Community</h5>
                <p className="text-xs text-neutral-600">See other investor activity</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">4</div>
                <h5 className="font-medium text-sm">Make Decision</h5>
                <p className="text-xs text-neutral-600">Invest with confidence</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex gap-3">
              <Star className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800">Pro Tip</h5>
                <p className="text-yellow-700 text-sm">
                  Start with properties in markets you understand. Diversify across different 
                  property types and locations to minimize risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Making Your First Investment",
      description: "Simple, secure, and instant process",
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Investment Process</h3>
            <p className="text-neutral-600">Secure payments powered by Stripe</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Step-by-Step Investment</h4>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h5 className="font-semibold text-blue-900">Choose Share Amount</h5>
                  <p className="text-blue-800 text-sm">Select how many shares you want to purchase. See real-time calculation of ownership percentage and expected returns.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h5 className="font-semibold text-green-900">Secure Payment</h5>
                  <p className="text-green-800 text-sm">Pay with credit card, bank transfer, or cryptocurrency. All transactions are encrypted and protected.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h5 className="font-semibold text-purple-900">Instant Ownership</h5>
                  <p className="text-purple-800 text-sm">Receive your shares immediately. Track your investment in your personal dashboard.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Payment Methods</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Credit & Debit Cards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Bank Transfer (ACH)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Digital Wallets</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Security Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Two-factor authentication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>FDIC insured accounts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Track & Manage Your Portfolio",
      description: "Monitor performance and earn returns",
      icon: <Wallet className="h-8 w-8 text-indigo-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Investment Dashboard</h3>
            <p className="text-neutral-600">Real-time portfolio tracking and management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Portfolio Insights</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span>Real-time portfolio value</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PieChart className="h-4 w-4 text-purple-600" />
                    <span>Diversification breakdown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span>Income tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Monthly Benefits</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic rent distributions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Property appreciation gains</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Tax documentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Reinvestment options</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Community Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h5 className="font-medium">Investor Network</h5>
                <p className="text-xs text-neutral-600">Connect with other investors</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h5 className="font-medium">Performance Leaderboard</h5>
                <p className="text-xs text-neutral-600">See top performing portfolios</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h5 className="font-medium">Investment Insights</h5>
                <p className="text-xs text-neutral-600">AI-powered recommendations</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">Ready to Start Investing?</h4>
            <p className="text-blue-800 mb-4">
              Join thousands of investors earning passive income through real estate. 
              Start with any amount and watch your portfolio grow over time.
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>No minimum investment</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Instant liquidity</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Professional management</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Blockchain Tokenization & Cryptocurrency Investing",
      description: "The future of decentralized fractional ownership",
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cryptocurrency & Blockchain Benefits</h3>
            <p className="text-neutral-600">Enhanced security and global accessibility through decentralized technology</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <h4 className="text-xl font-semibold mb-4">How Blockchain Technology Enhances Real Estate Investment</h4>
            <p className="text-neutral-700 leading-relaxed mb-4">
              40 Acres leverages blockchain technology to provide transparent, secure, and decentralized fractional 
              ownership of real estate. When you invest with cryptocurrency, you receive digital tokens that represent 
              your ownership stake, recorded immutably on the blockchain.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cryptocurrency Benefits
                </h4>
                <ul className="text-sm space-y-2 text-neutral-600">
                  <li>• <strong>Global Access:</strong> Invest from anywhere in the world</li>
                  <li>• <strong>Instant Transactions:</strong> No waiting for bank transfers</li>
                  <li>• <strong>Lower Fees:</strong> Reduced transaction costs</li>
                  <li>• <strong>24/7 Trading:</strong> Buy and sell anytime</li>
                  <li>• <strong>Privacy:</strong> Enhanced financial privacy</li>
                </ul>
              </div>
              
              <div className="bg-white p-5 rounded-lg border">
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Blockchain Proof of Ownership
                </h4>
                <ul className="text-sm space-y-2 text-neutral-600">
                  <li>• <strong>Immutable Records:</strong> Ownership cannot be altered</li>
                  <li>• <strong>Transparent:</strong> All transactions are publicly verifiable</li>
                  <li>• <strong>Smart Contracts:</strong> Automated dividend distributions</li>
                  <li>• <strong>Fractional Tokens:</strong> Precise ownership percentages</li>
                  <li>• <strong>Liquidity:</strong> Trade ownership stakes on exchanges</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-3">Supported Cryptocurrencies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">₿</div>
                  <div className="text-sm font-medium">Bitcoin</div>
                  <div className="text-xs text-gray-600">BTC</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <img src="/attached_assets/ethereum_1754171605981.png" alt="Ethereum" className="w-12 h-12 object-contain" />
                  </div>
                  <div className="text-sm font-medium">Ethereum</div>
                  <div className="text-xs text-gray-600">ETH</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">$</div>
                  <div className="text-sm font-medium">USDC</div>
                  <div className="text-xs text-gray-600">Stablecoin</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">+</div>
                  <div className="text-sm font-medium">More</div>
                  <div className="text-xs text-gray-600">Coming Soon</div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-5 rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-3">Why Tokenization Matters</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h5 className="font-medium mb-2">Liquidity</h5>
                  <p className="text-xs text-gray-600">Trade your property tokens on secondary markets</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h5 className="font-medium mb-2">Security</h5>
                  <p className="text-xs text-gray-600">Cryptographic security protects your ownership</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h5 className="font-medium mb-2">Accessibility</h5>
                  <p className="text-xs text-gray-600">Global access without traditional banking barriers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      ctaText: "Browse Properties & Invest",
      ctaAction: onStartInvesting
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    localStorage.setItem('investor_tour_completed', 'true');
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200 hover:text-black">
              Skip Tutorial
            </Button>
            <DialogTitle className="text-2xl font-bold text-primary">Investor Guide</DialogTitle>
            <div className="w-20"></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="flex items-center space-x-3 mb-6">
            {currentStepData.icon}
            <div>
              <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
              <p className="text-neutral-600">{currentStepData.description}</p>
            </div>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 border-black text-black hover:bg-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-primary'
                      : completedSteps.includes(index)
                      ? 'bg-green-500'
                      : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>

            {currentStepData.ctaText && currentStepData.ctaAction ? (
              <Button
                onClick={currentStepData.ctaAction}
                className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
              >
                <span>{currentStepData.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
              >
                <span>{currentStep === steps.length - 1 ? 'Complete Tour' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}