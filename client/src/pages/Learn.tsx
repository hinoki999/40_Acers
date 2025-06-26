import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Download
} from "lucide-react";
import Footer from "@/components/Footer";

function Learn() {
  const articles = [
    {
      id: 1,
      title: "Real Estate Crowdfunding: A Beginner's Guide",
      description: "Learn the fundamentals of real estate crowdfunding and how it democratizes property investment",
      readTime: "8 min read",
      category: "Basics",
      featured: true,
      content: "Understanding the basics of real estate crowdfunding and how it opens investment opportunities to everyone."
    },
    {
      id: 2,
      title: "How to Evaluate Investment Properties",
      description: "Key metrics and analysis techniques for assessing real estate investment opportunities",
      readTime: "12 min read",
      category: "Analysis",
      featured: true,
      content: "Learn to analyze cap rates, cash flow, location factors, and market trends for smart investments."
    },
    {
      id: 3,
      title: "Understanding Real Estate Market Cycles",
      description: "Navigate market ups and downs with knowledge of real estate cycles and timing",
      readTime: "10 min read",
      category: "Market",
      featured: false,
      content: "Master the four phases of real estate cycles to optimize your investment timing and strategy."
    },
    {
      id: 4,
      title: "Building a Diversified Real Estate Portfolio",
      description: "Strategies for spreading risk across different property types and locations",
      readTime: "15 min read",
      category: "Strategy",
      featured: true,
      content: "Learn diversification strategies across property types, markets, and investment structures."
    },
    {
      id: 5,
      title: "Legal Considerations in Real Estate Crowdfunding",
      description: "Important legal frameworks, regulations, and protections for investors",
      readTime: "18 min read",
      category: "Legal",
      featured: false,
      content: "Navigate SEC regulations, investor protections, and legal structures in crowdfunding."
    },
    {
      id: 6,
      title: "Tax Benefits of Real Estate Investment",
      description: "Maximize your returns through understanding real estate tax advantages",
      readTime: "14 min read",
      category: "Tax",
      featured: false,
      content: "Explore depreciation, 1031 exchanges, and other tax strategies for real estate investors."
    }
  ];

  const guides = [
    {
      title: "Getting Started with 40 Acres",
      description: "Step-by-step guide to making your first real estate investment",
      steps: 4,
      duration: "5 minutes"
    },
    {
      title: "Investment Screening Process",
      description: "How we evaluate and select properties for the platform",
      steps: 6,
      duration: "8 minutes"
    },
    {
      title: "Managing Your Portfolio",
      description: "Track performance and optimize your real estate investments",
      steps: 5,
      duration: "6 minutes"
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4">
                <BookOpen className="mr-2" size={20} />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-[#A52A2A] hover:text-white font-semibold px-8 py-4">
                <PlayCircle className="mr-2" size={20} />
                Watch Video Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
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
                  <Button variant="outline" className="w-full">
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800">
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
    </div>
  );
}

export default Learn;