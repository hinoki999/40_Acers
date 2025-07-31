import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  BookOpen,
  PlayCircle,
  ExternalLink,
  Clock,
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
  Smartphone,
  Download,
  X,
  ArrowRight
} from "lucide-react";
import Footer from "@/components/Footer";

function Learn() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const articles = [
    {
      id: 1,
      title: "Real Estate Crowdfunding: A Beginner's Guide",
      description: "Learn the fundamentals of real estate crowdfunding and how it democratizes property investment",
      readTime: "8 min read",
      category: "Basics",
      featured: true,
      content: "Understanding the basics of real estate crowdfunding and how it opens investment opportunities to everyone.",
      fullContent: `
        <h2>What is Real Estate Crowdfunding?</h2>
        <p>Real estate crowdfunding is an innovative investment method that allows multiple investors to pool their money together to purchase or invest in real estate properties. Through online platforms like 40 Acres, individual investors can participate in real estate deals that were once only available to wealthy individuals or institutions.</p>
        
        <h3>How It Works</h3>
        <p>1. <strong>Property Selection:</strong> Platforms carefully select and vet properties for investment opportunities</p>
        <p>2. <strong>Tokenization:</strong> Properties are divided into digital shares or tokens, making ownership fractional</p>
        <p>3. <strong>Investment:</strong> Investors can purchase shares starting from as little as $50</p>
        <p>4. <strong>Returns:</strong> Investors receive proportional rental income and potential appreciation gains</p>
        
        <h3>Benefits for Investors</h3>
        <ul>
          <li>Lower barrier to entry compared to traditional real estate</li>
          <li>Portfolio diversification across multiple properties</li>
          <li>Passive income generation</li>
          <li>Professional property management</li>
          <li>Transparency through blockchain technology</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>Begin your real estate crowdfunding journey by researching platforms, understanding fee structures, and starting with smaller investments to learn the process. Always consider your risk tolerance and investment goals before committing funds.</p>
      `
    },
    {
      id: 2,
      title: "How to Evaluate Investment Properties",
      description: "Key metrics and analysis techniques for assessing real estate investment opportunities",
      readTime: "12 min read",
      category: "Analysis",
      featured: true,
      content: "Learn to analyze cap rates, cash flow, location factors, and market trends for smart investments.",
      fullContent: `
        <h2>Essential Property Analysis Metrics</h2>
        <p>Successful real estate investing requires thorough analysis of potential properties. Here are the key metrics every investor should understand:</p>
        
        <h3>1. Capitalization Rate (Cap Rate)</h3>
        <p><strong>Formula:</strong> Net Operating Income ÷ Property Value</p>
        <p>Cap rates help you compare properties and determine if the asking price is reasonable. Generally, higher cap rates indicate higher returns but also higher risk.</p>
        
        <h3>2. Cash Flow Analysis</h3>
        <p>Calculate monthly cash flow by subtracting all expenses from rental income:</p>
        <ul>
          <li>Gross rental income</li>
          <li>Minus: Property management fees</li>
          <li>Minus: Maintenance and repairs</li>
          <li>Minus: Property taxes and insurance</li>
          <li>Equals: Net cash flow</li>
        </ul>
        
        <h3>3. Location Factors</h3>
        <p>Location determines long-term property performance:</p>
        <ul>
          <li>Job market strength and diversity</li>
          <li>Population growth trends</li>
          <li>School district quality</li>
          <li>Transportation accessibility</li>
          <li>Future development plans</li>
        </ul>
        
        <h3>4. Market Trends</h3>
        <p>Analyze local market conditions including median home prices, rental rates, vacancy rates, and economic indicators. Use tools like city planning documents and economic development reports to understand future prospects.</p>
      `
    },
    {
      id: 3,
      title: "Understanding Real Estate Market Cycles",
      description: "Navigate market ups and downs with knowledge of real estate cycles and timing",
      readTime: "10 min read",
      category: "Market",
      featured: false,
      content: "Master the four phases of real estate cycles to optimize your investment timing and strategy.",
      fullContent: `
        <h2>The Four Phases of Real Estate Cycles</h2>
        <p>Real estate markets move in predictable cycles. Understanding these phases helps investors make better timing decisions:</p>
        
        <h3>Phase 1: Recovery</h3>
        <p>Characteristics:</p>
        <ul>
          <li>High vacancy rates begin to decline</li>
          <li>Rental growth is slow but steady</li>
          <li>New construction is limited</li>
          <li>Property values are at or near bottom</li>
        </ul>
        <p><strong>Investment Strategy:</strong> This is often the best time to buy, as prices are low and fundamentals are improving.</p>
        
        <h3>Phase 2: Expansion</h3>
        <p>Characteristics:</p>
        <ul>
          <li>Vacancy rates continue falling</li>
          <li>Rental income growth accelerates</li>
          <li>New construction begins increasing</li>
          <li>Property values rise steadily</li>
        </ul>
        <p><strong>Investment Strategy:</strong> Continue acquiring properties while monitoring supply increases.</p>
        
        <h3>Phase 3: Hyper Supply</h3>
        <p>Characteristics:</p>
        <ul>
          <li>Vacancy rates bottom out</li>
          <li>Rental growth peaks</li>
          <li>New construction is at cycle highs</li>
          <li>Property values peak</li>
        </ul>
        <p><strong>Investment Strategy:</strong> Consider selling properties and being more selective about new acquisitions.</p>
        
        <h3>Phase 4: Recession</h3>
        <p>Characteristics:</p>
        <ul>
          <li>Vacancy rates begin rising</li>
          <li>Rental growth slows or turns negative</li>
          <li>New construction starts declining</li>
          <li>Property values begin falling</li>
        </ul>
        <p><strong>Investment Strategy:</strong> Focus on preserving capital and preparing for the next recovery phase.</p>
      `
    },
    {
      id: 4,
      title: "Building a Diversified Real Estate Portfolio",
      description: "Strategies for spreading risk across different property types and locations",
      readTime: "15 min read",
      category: "Strategy",
      featured: true,
      content: "Learn diversification strategies across property types, markets, and investment structures.",
      fullContent: `
        <h2>Portfolio Diversification Strategies</h2>
        <p>Diversification is crucial for managing risk and optimizing returns in real estate investing. Here's how to build a well-balanced portfolio:</p>
        
        <h3>1. Property Type Diversification</h3>
        <p>Spread investments across different property types:</p>
        <ul>
          <li><strong>Residential:</strong> Single-family homes, condos, apartments</li>
          <li><strong>Commercial:</strong> Office buildings, retail spaces, warehouses</li>
          <li><strong>Industrial:</strong> Manufacturing facilities, distribution centers</li>
          <li><strong>Special Purpose:</strong> Healthcare facilities, self-storage, student housing</li>
        </ul>
        
        <h3>2. Geographic Diversification</h3>
        <p>Invest across different markets to reduce regional risk:</p>
        <ul>
          <li>Primary markets (major cities)</li>
          <li>Secondary markets (mid-size cities)</li>
          <li>Tertiary markets (smaller cities)</li>
          <li>Different economic bases (tech, manufacturing, agriculture)</li>
        </ul>
        
        <h3>3. Investment Structure Diversification</h3>
        <p>Use various investment vehicles:</p>
        <ul>
          <li>Direct property ownership</li>
          <li>Real Estate Crowdfunding (like 40 Acres)</li>
          <li>REITs (Real Estate Investment Trusts)</li>
          <li>Real estate syndications</li>
        </ul>
        
        <h3>4. Risk Profile Diversification</h3>
        <p>Balance risk levels across your portfolio:</p>
        <ul>
          <li><strong>Core Properties:</strong> Stable, income-producing assets (60-70%)</li>
          <li><strong>Core-Plus:</strong> Properties needing minor improvements (20-25%)</li>
          <li><strong>Value-Add:</strong> Properties requiring significant renovation (10-15%)</li>
          <li><strong>Opportunistic:</strong> High-risk, high-reward investments (5-10%)</li>
        </ul>
        
        <h3>Building Your Portfolio</h3>
        <p>Start with core properties in familiar markets, then gradually expand to different property types and locations as your experience and capital grow. Regular portfolio review and rebalancing ensure optimal performance.</p>
      `
    },
    {
      id: 5,
      title: "Legal Considerations in Real Estate Crowdfunding",
      description: "Important legal frameworks, regulations, and protections for investors",
      readTime: "18 min read",
      category: "Legal",
      featured: false,
      content: "Navigate SEC regulations, investor protections, and legal structures in crowdfunding.",
      fullContent: `
        <h2>Legal Framework for Real Estate Crowdfunding</h2>
        <p>Understanding the legal landscape is essential for safe and compliant real estate crowdfunding investments.</p>
        
        <h3>SEC Regulations</h3>
        <p>Real estate crowdfunding operates under specific SEC regulations:</p>
        
        <h4>Regulation Crowdfunding (Reg CF)</h4>
        <ul>
          <li>Maximum investment of $5 million per year per company</li>
          <li>Individual investment limits based on income and net worth</li>
          <li>Required financial disclosures from issuers</li>
          <li>12-month holding period restrictions</li>
        </ul>
        
        <h4>Regulation D (Rule 506)</h4>
        <ul>
          <li>Private placement exemptions</li>
          <li>Accredited investor requirements</li>
          <li>Unlimited investment amounts</li>
          <li>Limited advertising restrictions</li>
        </ul>
        
        <h3>Investor Protections</h3>
        <p>Several mechanisms protect crowdfunding investors:</p>
        <ul>
          <li><strong>Due Diligence:</strong> Platforms must verify offerings</li>
          <li><strong>Disclosure Requirements:</strong> Detailed financial information</li>
          <li><strong>Fraud Prevention:</strong> Background checks on sponsors</li>
          <li><strong>Progress Reporting:</strong> Regular updates on investments</li>
        </ul>
        
        <h3>Legal Structure Types</h3>
        <p>Common legal structures for crowdfunded properties:</p>
        <ul>
          <li><strong>Limited Liability Company (LLC):</strong> Most common structure</li>
          <li><strong>Limited Partnership (LP):</strong> Traditional real estate structure</li>
          <li><strong>Delaware Statutory Trust (DST):</strong> For 1031 exchanges</li>
          <li><strong>Tenancy in Common (TIC):</strong> Direct ownership interest</li>
        </ul>
        
        <h3>Key Legal Documents</h3>
        <p>Essential documents to review before investing:</p>
        <ul>
          <li>Private Placement Memorandum (PPM)</li>
          <li>Operating Agreement</li>
          <li>Subscription Agreement</li>
          <li>Property Purchase Agreement</li>
          <li>Management Agreement</li>
        </ul>
        
        <h3>Risk Disclosures</h3>
        <p>All offerings must clearly disclose risks including market volatility, illiquidity, management risk, and the potential for total loss of investment.</p>
      `
    },
    {
      id: 6,
      title: "Tax Benefits of Real Estate Investment",
      description: "Understand depreciation, 1031 exchanges, and other tax advantages",
      readTime: "14 min read",
      category: "Tax",
      featured: false,
      content: "Maximize your returns through strategic tax planning and real estate-specific benefits.",
      fullContent: `
        <h2>Tax Advantages of Real Estate Investment</h2>
        <p>Real estate offers numerous tax benefits that can significantly enhance your investment returns. Understanding these advantages is crucial for maximizing your wealth-building potential.</p>
        
        <h3>1. Depreciation Deductions</h3>
        <p>The IRS allows you to depreciate the cost of your rental property over 27.5 years (residential) or 39 years (commercial):</p>
        <ul>
          <li>Reduces taxable income dollar-for-dollar</li>
          <li>Applies even if property appreciates in value</li>
          <li>Can create "phantom losses" to offset other income</li>
          <li>Bonus depreciation available for certain property improvements</li>
        </ul>
        
        <h3>2. 1031 Like-Kind Exchanges</h3>
        <p>Defer capital gains taxes by exchanging investment properties:</p>
        <ul>
          <li>No limit on frequency of exchanges</li>
          <li>Allows indefinite tax deferral</li>
          <li>Can build wealth through leveraging deferred taxes</li>
          <li>Strict timeline requirements (45 days to identify, 180 days to close)</li>
        </ul>
        
        <h3>3. Opportunity Zones</h3>
        <p>Invest capital gains in designated economically distressed areas:</p>
        <ul>
          <li>Defer capital gains taxes until 2026</li>
          <li>Reduce deferred gains by 10-15% if held long enough</li>
          <li>Eliminate taxes on appreciation if held 10+ years</li>
        </ul>
        
        <h3>4. Other Tax Benefits</h3>
        <ul>
          <li><strong>Mortgage Interest:</strong> Fully deductible on investment properties</li>
          <li><strong>Operating Expenses:</strong> Management fees, repairs, insurance</li>
          <li><strong>Professional Services:</strong> Legal, accounting, property management</li>
          <li><strong>Travel Expenses:</strong> Property inspection and management trips</li>
        </ul>
        
        <h3>Tax Planning Strategies</h3>
        <p>Work with qualified tax professionals to optimize your real estate tax strategy and ensure compliance with all regulations.</p>
      `
    }
  ];

  const guides = [
    {
      id: 1,
      title: "Getting Started with 40 Acres",
      description: "Step-by-step guide to making your first real estate investment",
      steps: 4,
      duration: "5 minutes",
      content: [
        {
          title: "Create Your Account",
          description: "Sign up and complete your investor profile to get started with 40 Acres.",
          details: "Click 'Get Started' and choose your investor type. Complete the required information including your investment preferences and risk tolerance. Verify your email address to activate your account."
        },
        {
          title: "Browse Properties",
          description: "Explore available investment opportunities on our marketplace.",
          details: "Use the Invest page to browse properties. Filter by location, property type, and investment amount. Review property details, financial projections, and documentation for each listing."
        },
        {
          title: "Make Your Investment",
          description: "Select your investment amount and complete the purchase process.",
          details: "Choose your investment amount (minimum $50). Review the investment summary and tokenomics. Complete payment using your preferred method (credit card, bank transfer, or cryptocurrency)."
        },
        {
          title: "Track Your Returns",
          description: "Monitor your investment performance through your dashboard.",
          details: "Access your dashboard to view portfolio performance, recent transactions, and earnings. Set up notifications for important updates and dividend payments."
        }
      ]
    },
    {
      id: 2,
      title: "Investment Screening Process",
      description: "How we evaluate and select properties for the platform",
      steps: 6,
      duration: "8 minutes",
      content: [
        {
          title: "Property Sourcing",
          description: "We identify potential investment properties through multiple channels.",
          details: "Our team works with real estate brokers, property owners, and market analysts to identify high-quality investment opportunities in growing markets."
        },
        {
          title: "Financial Analysis",
          description: "Comprehensive evaluation of property financial performance.",
          details: "We analyze cap rates, cash flow projections, comparable sales, rental income potential, and operating expenses to ensure strong investment fundamentals."
        },
        {
          title: "Market Research",
          description: "Detailed assessment of local market conditions and trends.",
          details: "Our analysts review population growth, job market strength, development plans, school ratings, and neighborhood characteristics to evaluate long-term potential."
        },
        {
          title: "Legal Due Diligence",
          description: "Thorough review of all legal and regulatory requirements.",
          details: "We verify clear title, review zoning compliance, check for liens or encumbrances, and ensure all regulatory requirements are met before listing."
        },
        {
          title: "Property Inspection",
          description: "Professional inspection and condition assessment.",
          details: "Licensed inspectors evaluate structural integrity, systems functionality, and identify any maintenance or repair needs. We factor these costs into our financial projections."
        },
        {
          title: "Final Approval",
          description: "Investment committee review and platform listing approval.",
          details: "Our investment committee reviews all due diligence materials and makes the final decision on whether to list the property for crowdfunding."
        }
      ]
    },
    {
      id: 3,
      title: "Managing Your Portfolio",
      description: "Track performance and optimize your real estate investments",
      steps: 5,
      duration: "6 minutes",
      content: [
        {
          title: "Dashboard Overview",
          description: "Understanding your investment dashboard and key metrics.",
          details: "Your dashboard shows total portfolio value, recent transactions, earnings summary, and performance analytics. Use the time period filters to analyze returns over different timeframes."
        },
        {
          title: "Performance Tracking",
          description: "Monitor individual property and overall portfolio performance.",
          details: "Track key metrics including total return, dividend yield, appreciation, and individual property performance. Compare your returns to market benchmarks and indices."
        },
        {
          title: "Dividend Management",
          description: "Understanding and managing your investment dividends.",
          details: "Review dividend payment schedules, reinvestment options, and tax implications. Set up automatic reinvestment to compound your returns over time."
        },
        {
          title: "Portfolio Diversification",
          description: "Strategies for building a balanced real estate portfolio.",
          details: "Monitor your allocation across property types, geographic regions, and risk levels. Consider rebalancing periodically to maintain your target diversification."
        },
        {
          title: "Tax Optimization",
          description: "Managing tax implications of your real estate investments.",
          details: "Access tax documents, understand depreciation benefits, and consider tax-advantaged account options. Consult with tax professionals for personalized advice."
        }
      ]
    }
  ];

  // Tokenomics example data
  const exampleProperty = {
    value: 400000,
    squareFootage: 2000,
    address: "1909 E Ferry Street, Detroit"
  };

  const baseTokenPrice = exampleProperty.value / exampleProperty.squareFootage; // $200
  const maxTokenizedValue = exampleProperty.value * 0.49; // $196,000
  const platformFee = 0.05;
  const finalTokenPrice = baseTokenPrice * (1 + platformFee); // $210
  const tokenSupply = Math.floor(maxTokenizedValue / baseTokenPrice); // 980 tokens

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Learn Real Estate Investing
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-4xl mx-auto">
              Master the fundamentals of real estate crowdfunding and build wealth through informed investment decisions
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4"
                onClick={() => document.getElementById('featured-articles')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="mr-2" size={20} />
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section id="featured-articles" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Featured Articles</h2>
            <p className="text-xl text-neutral-600">Essential knowledge for real estate investors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(article => article.featured).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock size={14} className="mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">{article.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedArticle(article)}
                  >
                    Read Article
                    <ExternalLink size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guides */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Quick Start Guides</h2>
            <p className="text-xl text-neutral-600">Interactive guides to get you started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guides.map((guide, index) => (
              <Card key={index} className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <span>{guide.steps} steps</span>
                    <span>{guide.duration}</span>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-[#A52A2A] transition-colors duration-200"
                    onClick={() => {
                      setSelectedGuide(guide);
                      setCurrentGuideStep(0);
                    }}
                  >
                    Start Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">All Articles</h2>
            <p className="text-xl text-neutral-600">Comprehensive learning library</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{article.category}</Badge>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Clock size={14} className="mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-neutral-600 mb-4">{article.content}</p>
                  <Button 
                    variant="ghost" 
                    className="px-4 py-2 h-auto font-semibold text-blue-600 hover:text-white hover:bg-[#A52A2A] transition-all duration-200 rounded-md"
                    onClick={() => setSelectedArticle(article)}
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">40 Acres Tokenomics</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Democratizing real estate investment through compliant tokenization, 
              investor protection, and community-driven ownership
            </p>
            <div className="flex justify-center gap-4 mt-6">
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
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-8">
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
                      {tokenSupply.toLocaleString()} tokens
                    </div>
                    <div className="text-xs text-neutral-500">
                      Available for investment
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <Download size={20} className="text-orange-600" />
                  <span className="font-semibold text-orange-900">Download Full Tokenomics Report</span>
                </div>
                <p className="text-orange-800 text-sm">
                  Get the complete 40 Acres tokenomics documentation including detailed formulas, 
                  compliance frameworks, and investment structures.
                </p>
                <Button className="mt-3 bg-orange-600 hover:bg-orange-700 text-white">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Article Modal */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <DialogTitle className="text-3xl font-bold text-neutral-900 mb-2">
                    {selectedArticle.title}
                  </DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <Badge variant="secondary">{selectedArticle.category}</Badge>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {selectedArticle.readTime}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent }} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Guide Modal */}
      {selectedGuide && (
        <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-neutral-900">
                    {selectedGuide.title}
                  </DialogTitle>
                  <DialogDescription className="text-neutral-600 mt-1">
                    Step {currentGuideStep + 1} of {selectedGuide.steps}: {selectedGuide.content[currentGuideStep]?.title}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGuide(null)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-neutral-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentGuideStep + 1) / selectedGuide.steps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentGuideStep + 1) / selectedGuide.steps) * 100}%` }}
                  ></div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  {selectedGuide.content[currentGuideStep]?.title}
                </h3>
                <p className="text-blue-800 mb-4">
                  {selectedGuide.content[currentGuideStep]?.description}
                </p>
                <p className="text-neutral-700">
                  {selectedGuide.content[currentGuideStep]?.details}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentGuideStep(Math.max(0, currentGuideStep - 1))}
                  disabled={currentGuideStep === 0}
                  className="hover:bg-black hover:text-white"
                >
                  Previous
                </Button>
                
                {currentGuideStep < selectedGuide.steps - 1 ? (
                  <Button
                    onClick={() => setCurrentGuideStep(Math.min(selectedGuide.steps - 1, currentGuideStep + 1))}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next Step
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedGuide(null)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Complete Guide
                    <CheckCircle size={16} className="ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Learn;