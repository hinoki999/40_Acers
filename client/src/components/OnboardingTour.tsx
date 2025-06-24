import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  Shield,
  Smartphone,
  Building
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to 40 Acres",
      description: "Your journey to real estate investing starts here",
      icon: <Home className="h-8 w-8 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Welcome to the Future of Real Estate</h3>
          <p className="text-neutral-600 leading-relaxed">
            40 Acres is a peer-to-peer investment marketplace where you can own fractional shares 
            in real estate properties. Build wealth through passive income without the hassle of 
            property management.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Passive Income</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Secure Platform</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How Real Estate Crowdfunding Works",
      description: "Understanding crowdfunded real estate investments",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real Estate Crowdfunding</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <div>
                <p className="font-medium">Pool Your Investment</p>
                <p className="text-sm text-neutral-600">Multiple investors contribute funds to collectively purchase high-value real estate properties</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              <div>
                <p className="font-medium">Fractional Ownership</p>
                <p className="text-sm text-neutral-600">Own a percentage of the property based on your investment amount (minimum $10)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <div>
                <p className="font-medium">Passive Income</p>
                <p className="text-sm text-neutral-600">Earn rental income and property appreciation without property management responsibilities</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Example:</strong> Invest $1,000 in a $100,000 property = 1% ownership and 1% of rental income
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Browse Investment Opportunities",
      description: "Discover properties that match your investment goals",
      icon: <Building className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Investment Marketplace</h3>
          </div>
          
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Sample Property</h4>
                  <p className="text-sm text-neutral-600">123 Main St, Austin, TX</p>
                </div>
                <Badge variant="secondary">Available</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Property Value:</span>
                  <p className="font-semibold">$250,000</p>
                </div>
                <div>
                  <span className="text-neutral-600">Token Price:</span>
                  <p className="font-semibold">$1,225</p>
                </div>
                <div>
                  <span className="text-neutral-600">Available Tokens:</span>
                  <p className="font-semibold">100 tokens</p>
                </div>
                <div>
                  <span className="text-neutral-600">Expected ROI:</span>
                  <p className="font-semibold text-green-600">8-12%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>View detailed analytics</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Access legal documents</span>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 4,
      title: "Community & Support",
      description: "Connect with fellow investors and get help",
      icon: <Users className="h-8 w-8 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Join Our Community</h3>
            <p className="text-neutral-600">Connect with thousands of real estate investors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Community Forum</h4>
                <p className="text-sm text-neutral-600">Share insights and learn from experienced investors</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Investment Leaderboard</h4>
                <p className="text-sm text-neutral-600">See top performers and track your progress</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 24/7 customer support available</li>
              <li>• Comprehensive documentation and guides</li>
              <li>• Live chat support for immediate assistance</li>
            </ul>
          </div>
        </div>
      )
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
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleSkip} className="bg-white text-black border-black hover:bg-gray-200">
              Skip Tutorial
            </Button>
            <DialogTitle className="text-2xl font-bold">Getting Started</DialogTitle>
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
              className="flex items-center space-x-2 bg-white text-black border-black hover:bg-gray-200"
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

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-black text-white hover:bg-gray-200 hover:text-black"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}