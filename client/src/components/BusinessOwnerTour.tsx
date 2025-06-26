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
  Building, 
  DollarSign, 
  FileText, 
  Camera, 
  Users, 
  TrendingUp,
  CheckCircle,
  Shield,
  Calculator,
  MapPin,
  Zap
} from "lucide-react";

interface BusinessOwnerTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onStartListing: () => void;
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

export default function BusinessOwnerTour({ isOpen, onClose, onComplete, onStartListing }: BusinessOwnerTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: TourStep[] = [
    {
      id: 1,
      title: "Welcome, Property Owner!",
      description: "Your journey to listing your property starts here",
      icon: <Building className="h-8 w-8 text-primary" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Turn Your Property Into Digital Assets</h3>
          <p className="text-neutral-600 leading-relaxed">
            40 Acres allows you to tokenize your property and raise capital from investors without 
            traditional financing. Retain control while accessing liquidity through fractional ownership.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Access Capital</h4>
              <p className="text-sm text-green-700">Raise funds without debt</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Keep Control</h4>
              <p className="text-sm text-blue-700">Retain management rights</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Share Profits</h4>
              <p className="text-sm text-purple-700">Distribute rental income</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Property Tokenization Explained",
      description: "How we convert your property into digital tokens",
      icon: <Calculator className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tokenization Formula</h3>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-bold text-blue-900 mb-4">Example: $500,000 Property, 2,000 sq ft</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="font-medium">Step 1: Calculate Total Tokens</span>
                  <span className="text-blue-600 font-bold">2,000 sq ft ÷ 10 = 200 tokens</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="font-medium">Step 2: Set Token Price</span>
                  <span className="text-green-600 font-bold">$500,000 ÷ 200 = $2,500/token</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="font-medium">Step 3: Max Ownership Offered</span>
                  <span className="text-purple-600 font-bold">49% = 98 tokens available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800">You Keep</h5>
              <p className="text-green-700">51% ownership + management control</p>
            </div>
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800">Investors Get</h5>
              <p className="text-blue-700">Up to 49% + proportional rental income</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Property Information Required",
      description: "What details you'll need to list your property",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Listing Requirements</h3>
            <p className="text-neutral-600">Gather these items before starting your listing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-neutral-900 border-b pb-2">Property Details</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address & Location</p>
                    <p className="text-sm text-neutral-600">Full address, city, state, ZIP code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Property Specifications</p>
                    <p className="text-sm text-neutral-600">Square footage, bedrooms, bathrooms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Current Market Value</p>
                    <p className="text-sm text-neutral-600">Recent appraisal or market analysis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-neutral-900 border-b pb-2">Legal Documents</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Property Deed</p>
                    <p className="text-sm text-neutral-600">Proof of ownership documentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Title Insurance</p>
                    <p className="text-sm text-neutral-600">Current title insurance policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">LLC Formation</p>
                    <p className="text-sm text-neutral-600">Business entity documentation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800">Pro Tip</h5>
                <p className="text-yellow-700 text-sm">
                  Have high-quality photos ready! Properties with professional photos receive 3x more investor interest.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Upload Media & Documentation",
      description: "Make your property stand out to investors",
      icon: <Camera className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Appeal Matters</h3>
            <p className="text-neutral-600">Professional presentation attracts serious investors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Property Photos
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Exterior views from multiple angles</li>
                  <li>• Interior shots of each room</li>
                  <li>• Kitchen and bathroom highlights</li>
                  <li>• Outdoor spaces and amenities</li>
                  <li>• Neighborhood context shots</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Virtual Tours
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Zoom meeting room setup</li>
                  <li>• 360° virtual walkthrough</li>
                  <li>• Video property tour</li>
                  <li>• Live Q&A sessions</li>
                  <li>• Neighborhood overview</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Document Upload Process</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">1</div>
                <h5 className="font-medium">Scan Documents</h5>
                <p className="text-xs text-neutral-600">High-resolution PDF format</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">2</div>
                <h5 className="font-medium">Upload Files</h5>
                <p className="text-xs text-neutral-600">Drag & drop interface</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg border">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold">3</div>
                <h5 className="font-medium">Verification</h5>
                <p className="text-xs text-neutral-600">Automated review process</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Business Verification & Review",
      description: "Complete verification and pay listing fee",
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Business Verification Required</h3>
            <p className="text-neutral-600">Final verification step before going live</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-amber-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Status Check
                </h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>• LLC documents review</li>
                  <li>• Property deed verification</li>
                  <li>• Title insurance validation</li>
                  <li>• Property media approval</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Listing Fee Structure
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Under $100k: 3% of property value</li>
                  <li>• $100k-$500k: 2.5% of property value</li>
                  <li>• $500k-$1M: 2% of property value</li>
                  <li>• Over $1M: 1.5% of property value</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-blue-800">What Happens Next</h5>
                <p className="text-blue-700 text-sm">
                  Once verification is complete and the listing fee is paid, your property will be reviewed by our team within 24-48 hours and then go live on the marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Launch & Manage Your Listing",
      description: "Go live and start attracting investors",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Property Goes Live!</h3>
            <p className="text-neutral-600">Track performance and manage investor relations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">What Happens Next</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span>Property appears in investor marketplace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span>Investors can view details and invest</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span>Real-time funding progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span>Automated investor communications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3">Your Dashboard Tools</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Investment progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Investor management tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Revenue distribution system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span>Document management center</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-900 mb-3">Ready to List Your Property?</h4>
            <p className="text-green-800 mb-4">
              Join hundreds of property owners who have successfully tokenized their real estate and 
              accessed capital through our platform. The average property gets funded within 30-45 days.
            </p>
            <div className="flex items-center gap-4 text-sm text-green-700">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>No upfront costs</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Keep control</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Instant liquidity</span>
              </div>
            </div>
          </div>
        </div>
      ),
      ctaText: "Start Listing My Property",
      ctaAction: onStartListing
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
    localStorage.setItem('business_tour_completed', 'true');
    onComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">Business Owner Guide</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-200">
              Skip Tutorial
            </Button>
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
              className="flex items-center space-x-2"
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
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <span>{currentStepData.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
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