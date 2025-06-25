import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Star
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
    featured: true
  },
  {
    id: 2,
    title: "Understanding Fractional Ownership",
    description: "How owning a fraction of a property works and what it means for your investment.",
    category: "fractional",
    duration: "8 min read",
    difficulty: "Beginner",
    type: "Article",
    featured: true
  },
  {
    id: 3,
    title: "Cryptocurrency Tokenization Explained",
    description: "Discover how blockchain technology enables secure fractional property ownership.",
    category: "tokenization",
    duration: "12 min read",
    difficulty: "Intermediate",
    type: "Guide",
    featured: true
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
              <Button size="lg" className="bg-[#A52A2A] hover:bg-[#8B1A1A] text-white">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                <Calculator className="h-5 w-5 mr-2" />
                Investment Calculator
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
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
                    <Button size="sm" className="bg-[#A52A2A] hover:bg-[#8B1A1A]">
                      <span className="mr-1">Read</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
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
                          <Button size="sm" variant="outline" className="hover:bg-[#A52A2A] hover:text-white">
                            {resource.type === "Calculator" ? "Use Tool" : "Learn More"}
                          </Button>
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

      {/* Call to Action */}
      <section className="py-16 bg-[#A52A2A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply what you've learned and begin building your real estate portfolio today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#A52A2A]">
              <Target className="h-5 w-5 mr-2" />
              Browse Properties
            </Button>
            <Button size="lg" className="bg-white text-[#A52A2A] hover:bg-gray-100">
              <DollarSign className="h-5 w-5 mr-2" />
              Start Investing
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}