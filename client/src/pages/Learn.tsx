import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  DollarSign, 
  Home, 
  Users, 
  Shield, 
  Calculator,
  PieChart,
  Building,
  Coins,
  Target,
  FileText,
  Play,
  ExternalLink,
  Clock,
  Star,
  ArrowLeft
} from "lucide-react";
import Footer from "@/components/Footer";

interface LearningResource {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Article" | "Video" | "Guide" | "Calculator";
  featured?: boolean;
  content?: string;
}

const learningResources: LearningResource[] = [
  {
    id: 1,
    title: "What is Real Estate Crowdfunding?",
    description: "Learn the basics of pooling money with other investors to buy real estate properties.",
    category: "crowdfunding",
    duration: "5 min read",
    difficulty: "Beginner",
    type: "Article",
    featured: true,
    content: `# What is Real Estate Crowdfunding?

Real estate crowdfunding is a revolutionary approach to property investment that allows multiple investors to pool their money together to purchase and own shares of real estate properties. This innovative model breaks down traditional barriers to real estate investment, making it accessible to a broader range of investors.

## How It Works

In traditional real estate investing, you would need substantial capital to purchase an entire property. With crowdfunding, you can invest as little as $10 to own a fraction of a property. Here's how the process typically works:

1. **Property Selection**: Professional real estate teams identify and vet investment opportunities
2. **Investment Offering**: Properties are listed on the platform with detailed information about potential returns
3. **Investor Participation**: Multiple investors contribute funds to reach the property's funding goal
4. **Shared Ownership**: Each investor owns a percentage of the property based on their investment amount
5. **Ongoing Returns**: Investors receive their share of rental income and property appreciation

## Benefits of Real Estate Crowdfunding

### Lower Barrier to Entry
Traditional real estate investment often requires tens or hundreds of thousands of dollars. Crowdfunding platforms typically allow investments starting from $10-$1,000, making real estate accessible to more people.

### Diversification
Instead of putting all your money into one property, you can spread your investment across multiple properties, locations, and property types to reduce risk.

### Professional Management
Properties are typically managed by experienced real estate professionals, so you don't need to deal with tenants, maintenance, or day-to-day property management.

### Liquidity Options
Some platforms offer secondary markets where you can sell your shares before the property is sold, providing more liquidity than traditional real estate ownership.

## Types of Real Estate Crowdfunding

### Equity Crowdfunding
Investors own actual shares of the property and receive returns from both rental income and property appreciation when the property is eventually sold.

### Debt Crowdfunding
Investors lend money for real estate projects and receive fixed returns through interest payments, similar to being a bank for real estate developers.

### Hybrid Models
Some platforms combine elements of both equity and debt crowdfunding to provide different risk and return profiles.

## Considerations and Risks

While real estate crowdfunding offers many advantages, it's important to understand the risks:

- **Illiquidity**: Your investment may be tied up for several years
- **Market Risk**: Property values can decrease
- **Platform Risk**: The crowdfunding platform itself could face difficulties
- **Lack of Control**: You typically have no say in property management decisions

## Getting Started

Before investing in real estate crowdfunding, consider:
- Your risk tolerance and investment timeline
- The platform's track record and fee structure
- The specific property's location, condition, and market prospects
- How this investment fits into your overall portfolio

Real estate crowdfunding represents a democratization of real estate investing, allowing more people to participate in an asset class that was previously accessible only to wealthy individuals and institutions.`
  },
  {
    id: 2,
    title: "Understanding Fractional Ownership",
    description: "How owning a fraction of a property works and what it means for your investment.",
    category: "fractional",
    duration: "8 min read",
    difficulty: "Beginner",
    type: "Article",
    featured: true,
    content: `# Understanding Fractional Ownership

Fractional ownership revolutionizes real estate investing by allowing multiple investors to own shares of a single property. This approach democratizes access to real estate markets that were previously available only to wealthy individuals or institutions.

## What is Fractional Ownership?

Fractional ownership means that instead of purchasing an entire property, you buy a percentage or "fraction" of it. Each fraction represents a proportional share of the property's value, rental income, and potential appreciation.

## How Fractional Ownership Works

### Share Structure
- Properties are divided into shares (e.g., 1,000 shares per property)
- Each share represents a percentage of ownership
- Minimum investment typically starts at $10-$100 per share
- You can purchase multiple shares to increase your ownership percentage

### Legal Framework
Fractional ownership is typically structured through:
- **Limited Liability Companies (LLCs)**: Most common structure
- **Real Estate Investment Trusts (REITs)**: For larger portfolios
- **Tokenized Securities**: Blockchain-based fractional ownership

## Benefits of Fractional Ownership

### Accessibility
- Lower minimum investment requirements
- Access to premium properties previously out of reach
- Ability to invest in multiple properties with limited capital

### Diversification
- Spread risk across multiple properties and markets
- Invest in different property types (residential, commercial, industrial)
- Geographic diversification across cities and states

### Professional Management
- Property management handled by experienced professionals
- No direct involvement in day-to-day operations
- Maintenance and tenant relations managed for you

### Liquidity Options
- Some platforms offer secondary markets for trading shares
- More liquid than traditional real estate ownership
- Ability to sell partial holdings

## Types of Returns

### Rental Income
- Receive proportional share of monthly rental income
- Payments typically made quarterly or monthly
- Income distributed after expenses and management fees

### Capital Appreciation
- Benefit from property value increases over time
- Realized when property is sold or refinanced
- Long-term wealth building potential

## Considerations and Risks

### Limited Control
- No decision-making power in property management
- Cannot choose tenants or set rental rates
- Exit strategy dependent on platform policies

### Fees and Costs
- Management fees (typically 1-2% annually)
- Platform fees for transactions
- Property-specific expenses reduce returns

### Market Risk
- Property values can decrease
- Rental income may fluctuate
- Local market conditions affect performance

## Getting Started with Fractional Ownership

### Research Platforms
- Compare fee structures and investment minimums
- Review track record and property types
- Understand liquidity options and exit strategies

### Due Diligence
- Analyze property financials and market conditions
- Review property management team experience
- Understand the legal structure and your rights

### Portfolio Strategy
- Start with small investments to learn the process
- Diversify across properties and markets
- Consider your overall investment timeline and goals

Fractional ownership represents a fundamental shift in real estate investing, making it possible for anyone to build a diversified real estate portfolio regardless of their starting capital.`
  },
  {
    id: 3,
    title: "Cryptocurrency Tokenization Explained",
    description: "Discover how blockchain technology enables secure fractional property ownership.",
    category: "tokenization",
    duration: "12 min read",
    difficulty: "Intermediate",
    type: "Guide",
    featured: true,
    content: `# Cryptocurrency Tokenization Explained

Cryptocurrency tokenization represents the cutting edge of real estate investing, combining blockchain technology with traditional property ownership to create a more transparent, efficient, and accessible investment ecosystem.

## What is Tokenization?

Tokenization is the process of converting real-world assets, like real estate properties, into digital tokens on a blockchain. Each token represents a fractional ownership stake in the underlying asset.

## How Blockchain Enables Real Estate Tokenization

### Immutable Records
- All ownership records stored on blockchain
- Transparent transaction history
- Cannot be altered or falsified
- Provides clear chain of ownership

### Smart Contracts
- Automated execution of investment terms
- Instant distribution of rental income
- Reduced need for intermediaries
- Lower transaction costs

### Global Accessibility
- 24/7 trading capabilities
- Access from anywhere in the world
- Reduced geographic barriers
- Cross-border investment opportunities

## Types of Real Estate Tokens

### Security Tokens
- Represent actual ownership in real estate
- Subject to securities regulations
- Provide rights to income and appreciation
- Most common type for real estate

### Utility Tokens
- Provide access to platform services
- May offer discounts or special features
- Not direct ownership of property
- Less regulatory oversight

### Stablecoins
- Cryptocurrency pegged to stable assets
- Often used for transactions
- Reduces volatility concerns
- Facilitates easier trading

## Benefits of Tokenized Real Estate

### Enhanced Liquidity
- Trade tokens on secondary markets
- No need to sell entire property position
- Faster settlement times (minutes vs. weeks)
- More flexible exit strategies

### Fractional Ownership Made Simple
- Easily divisible into small units
- Precise ownership percentages
- Automated dividend distributions
- Clear ownership verification

### Reduced Costs
- Lower transaction fees
- Eliminated need for many intermediaries
- Automated compliance and reporting
- Reduced paperwork and processing time

### Global Investment Access
- Invest in international properties
- Access to previously restricted markets
- 24/7 trading availability
- Cross-border diversification

## Technical Infrastructure

### Blockchain Platforms
- **Ethereum**: Most popular for real estate tokens
- **Polygon**: Lower fees, faster transactions
- **Solana**: High-speed, low-cost alternative
- **Private Blockchains**: Enterprise-focused solutions

### Token Standards
- **ERC-20**: Standard for fungible tokens
- **ERC-1400**: Designed for security tokens
- **ERC-721**: For unique property tokens (NFTs)
- **Custom Standards**: Platform-specific solutions

## Regulatory Landscape

### Securities Compliance
- Most real estate tokens are securities
- Must comply with SEC regulations
- KYC/AML requirements for investors
- Restricted to accredited investors in some cases

### International Considerations
- Different regulations by country
- Cross-border compliance challenges
- Evolving regulatory framework
- Legal uncertainty in some jurisdictions

## Investment Process

### Platform Registration
- Complete KYC verification
- Link cryptocurrency wallet
- Fund account with digital assets
- Review available properties

### Token Purchase
- Select property tokens to purchase
- Execute trade through smart contract
- Tokens transferred to your wallet
- Ownership recorded on blockchain

### Ongoing Management
- Automatic rental income distribution
- Real-time portfolio tracking
- Voting rights on major decisions
- Easy portfolio rebalancing

## Risks and Considerations

### Technology Risks
- Smart contract vulnerabilities
- Blockchain network issues
- Wallet security concerns
- Platform technical failures

### Regulatory Uncertainty
- Evolving legal framework
- Potential restriction changes
- Compliance requirements
- Tax implications

### Market Volatility
- Cryptocurrency price fluctuations
- Property value changes
- Liquidity variations
- Platform-specific risks

## Future of Tokenized Real Estate

### Emerging Trends
- Integration with DeFi protocols
- Automated property management
- AI-powered investment decisions
- Enhanced transparency and reporting

### Institutional Adoption
- Major real estate firms exploring tokenization
- Traditional banks offering crypto services
- Government pilot programs
- Integration with existing financial systems

Cryptocurrency tokenization represents the future of real estate investing, offering unprecedented accessibility, transparency, and efficiency while creating new opportunities for global property investment.`
  },
  {
    id: 4,
    title: "Real Estate Investment ROI Calculator",
    description: "Calculate potential returns on your real estate investments with various scenarios.",
    category: "realestate",
    duration: "Interactive",
    difficulty: "Beginner",
    type: "Calculator"
  },
  {
    id: 5,
    title: "Building a Diversified Real Estate Portfolio",
    description: "Strategies for spreading risk across different property types and locations.",
    category: "realestate",
    duration: "15 min read",
    difficulty: "Intermediate",
    type: "Guide"
  },
  {
    id: 6,
    title: "How Property Tokens Work",
    description: "Deep dive into the technical aspects of tokenized real estate investments.",
    category: "tokenization",
    duration: "18 min video",
    difficulty: "Advanced",
    type: "Video"
  },
  {
    id: 7,
    title: "Risks and Rewards of Crowdfunded Real Estate",
    description: "Understanding the potential benefits and drawbacks of real estate crowdfunding.",
    category: "crowdfunding",
    duration: "10 min read",
    difficulty: "Intermediate",
    type: "Article"
  },
  {
    id: 8,
    title: "Legal Framework of Fractional Ownership",
    description: "The legal structure behind fractional real estate ownership and investor rights.",
    category: "fractional",
    duration: "20 min read",
    difficulty: "Advanced",
    type: "Guide"
  },
  {
    id: 9,
    title: "Market Analysis and Property Selection",
    description: "How to evaluate markets and choose the right properties for investment.",
    category: "realestate",
    duration: "25 min read",
    difficulty: "Intermediate",
    type: "Guide"
  },
  {
    id: 10,
    title: "Smart Contracts in Real Estate",
    description: "How blockchain smart contracts automate and secure real estate transactions.",
    category: "tokenization",
    duration: "14 min video",
    difficulty: "Advanced",
    type: "Video"
  }
];

const categories = [
  {
    id: "crowdfunding",
    name: "Crowdfunding Basics",
    icon: <Users className="h-6 w-6" />,
    description: "Learn about pooling investments with other investors"
  },
  {
    id: "fractional",
    name: "Fractional Ownership",
    icon: <PieChart className="h-6 w-6" />,
    description: "Understanding partial property ownership structures"
  },
  {
    id: "tokenization",
    name: "Cryptocurrency Tokenization",
    icon: <Coins className="h-6 w-6" />,
    description: "Blockchain technology for real estate investments"
  },
  {
    id: "realestate",
    name: "Real Estate Investing",
    icon: <Building className="h-6 w-6" />,
    description: "General real estate investment knowledge and strategies"
  }
];

export default function Learn() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Article": return <FileText className="h-4 w-4" />;
      case "Video": return <Play className="h-4 w-4" />;
      case "Guide": return <BookOpen className="h-4 w-4" />;
      case "Calculator": return <Calculator className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredResources = (category: string) => {
    return learningResources.filter(resource => resource.category === category);
  };

  const featuredResources = learningResources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn Real Estate Investing
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Master the fundamentals of crowdfunding, fractional ownership, and cryptocurrency tokenization 
              in real estate. Build your knowledge with our comprehensive learning resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
                onClick={() => scrollToSection('featured-resources')}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-black bg-white hover:bg-gray-100 hover:text-black"
                onClick={() => scrollToSection('investment-calculator')}
              >
                <Calculator className="h-5 w-5 mr-2" />
                Investment Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section id="featured-resources" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Learning Resources</h2>
            <p className="text-lg text-gray-600">Start with these essential guides to real estate investing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-[#A52A2A]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      {getTypeIcon(resource.type)}
                      <span className="ml-1">{resource.type}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {resource.duration}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#A52A2A] hover:bg-[#8B1A1A]">
                          <span className="mr-1">Read</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>{resource.title}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="mt-4 h-[60vh]">
                          <div className="prose prose-sm max-w-none">
                            {resource.content ? (
                              <div className="prose prose-lg max-w-none">
                                {resource.content.split('\n\n').map((paragraph, index) => {
                                  if (paragraph.startsWith('# ')) {
                                    return <h1 key={index} className="text-2xl font-bold mb-4 mt-6">{paragraph.replace('# ', '')}</h1>;
                                  } else if (paragraph.startsWith('## ')) {
                                    return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{paragraph.replace('## ', '')}</h2>;
                                  } else if (paragraph.startsWith('### ')) {
                                    return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{paragraph.replace('### ', '')}</h3>;
                                  } else if (paragraph.startsWith('- ')) {
                                    const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
                                    return (
                                      <ul key={index} className="list-disc pl-6 mb-4">
                                        {listItems.map((item, i) => (
                                          <li key={i} className="mb-1">{item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                                        ))}
                                      </ul>
                                    );
                                  } else if (paragraph.match(/^\d+\./)) {
                                    const listItems = paragraph.split('\n').filter(item => item.match(/^\d+\./));
                                    return (
                                      <ol key={index} className="list-decimal pl-6 mb-4">
                                        {listItems.map((item, i) => (
                                          <li key={i} className="mb-1" dangerouslySetInnerHTML={{
                                            __html: item.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                          }} />
                                        ))}
                                      </ol>
                                    );
                                  } else if (paragraph.trim()) {
                                    return (
                                      <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{
                                        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      }} />
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ) : (
                              <p>Full article content coming soon...</p>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Categories</h2>
            <p className="text-lg text-gray-600">Explore different aspects of real estate investing</p>
          </div>

          <Tabs defaultValue="crowdfunding" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-[#A52A2A] data-[state=active]:text-white"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources(category.id).map((resource) => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            {getTypeIcon(resource.type)}
                            <span className="ml-1">{resource.type}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {resource.duration}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="hover:bg-[#A52A2A] hover:text-white">
                                {resource.type === "Calculator" ? "Use Tool" : "Learn More"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>{resource.title}</DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="mt-4 h-[60vh]">
                                <div className="prose prose-sm max-w-none">
                                  {resource.content ? (
                                    <div className="prose prose-lg max-w-none">
                                      {resource.content.split('\n\n').map((paragraph, index) => {
                                        if (paragraph.startsWith('# ')) {
                                          return <h1 key={index} className="text-2xl font-bold mb-4 mt-6">{paragraph.replace('# ', '')}</h1>;
                                        } else if (paragraph.startsWith('## ')) {
                                          return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{paragraph.replace('## ', '')}</h2>;
                                        } else if (paragraph.startsWith('### ')) {
                                          return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{paragraph.replace('### ', '')}</h3>;
                                        } else if (paragraph.startsWith('- ')) {
                                          const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
                                          return (
                                            <ul key={index} className="list-disc pl-6 mb-4">
                                              {listItems.map((item, i) => (
                                                <li key={i} className="mb-1" dangerouslySetInnerHTML={{
                                                  __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                }} />
                                              ))}
                                            </ul>
                                          );
                                        } else if (paragraph.match(/^\d+\./)) {
                                          const listItems = paragraph.split('\n').filter(item => item.match(/^\d+\./));
                                          return (
                                            <ol key={index} className="list-decimal pl-6 mb-4">
                                              {listItems.map((item, i) => (
                                                <li key={i} className="mb-1" dangerouslySetInnerHTML={{
                                                  __html: item.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                }} />
                                              ))}
                                            </ol>
                                          );
                                        } else if (paragraph.trim()) {
                                          return (
                                            <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{
                                              __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            }} />
                                          );
                                        }
                                        return null;
                                      })}
                                    </div>
                                  ) : (
                                    <p>Full article content coming soon...</p>
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Investment Calculator Section */}
      <section id="investment-calculator" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Investment Calculator</h2>
          <p className="text-xl mb-8 text-gray-600">
            Calculate potential returns on your real estate investments.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">Interactive calculator coming soon...</p>
            <Button className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white">
              <Calculator className="h-5 w-5 mr-2" />
              Launch Calculator
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#A52A2A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply what you've learned and begin building your real estate portfolio today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-black bg-white hover:bg-gray-100 hover:text-black"
              onClick={() => window.location.href = '/invest'}
            >
              <Target className="h-5 w-5 mr-2" />
              Browse Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}