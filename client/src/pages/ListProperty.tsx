import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Shield, Camera, Video, CheckCircle, Clock, Upload, Users, DollarSign, HelpCircle } from "lucide-react";
import CreatePropertyModal from "@/components/CreatePropertyModal";
import BusinessOwnerTour from "@/components/BusinessOwnerTour";

export default function ListProperty() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBusinessTour, setShowBusinessTour] = useState(false);

  const steps = [
    {
      icon: Building,
      title: "Property Details",
      description: "Provide basic information about your property including location, type, and valuation",
      color: "from-blue-600 to-purple-600"
    },
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Upload property deeds, title documents, and LLC formation papers",
      color: "from-red-600 to-orange-600"
    },
    {
      icon: Camera,
      title: "Property Media",
      description: "Add high-quality photos and videos to showcase your property",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Video,
      title: "Virtual Tours",
      description: "Set up virtual property tours for potential investors",
      color: "from-green-600 to-blue-600"
    },
    {
      icon: Shield,
      title: "Verification",
      description: "Our team reviews your documentation for authenticity and compliance",
      color: "from-orange-600 to-red-600"
    },
    {
      icon: CheckCircle,
      title: "Go Live",
      description: "Your property goes live for fractional investment opportunities",
      color: "from-green-600 to-emerald-600"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Unlock Liquidity",
      description: "Convert your real estate into liquid tokens while maintaining ownership"
    },
    {
      icon: Users,
      title: "Shared Investment",
      description: "Allow multiple investors to participate in your property's success"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level security with full regulatory compliance and investor protection"
    },
    {
      icon: Clock,
      title: "Quick Process",
      description: "Get your property listed and verified within 2-3 business days"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">List Your Property</h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Transform your real estate into fractional investment opportunities. 
              Unlock liquidity while maintaining ownership and earning from your property.
            </p>
            <div className="flex items-center gap-4 justify-center">
              <Button 
                onClick={() => setShowCreateModal(true)}
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 text-lg"
              >
                Start Property Listing
              </Button>
              <Button 
                onClick={() => setShowBusinessTour(true)}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-6 py-4"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why List Your Property?</h2>
            <p className="text-xl text-neutral-600">
              Join the future of real estate investment and unlock new opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Simple 6-Step Process</h2>
            <p className="text-xl text-neutral-600">
              From documentation to going live - we guide you through every step
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center`}>
                      <step.icon className="text-white" size={20} />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">Step {index + 1}</Badge>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">What You'll Need</h2>
            <p className="text-xl text-neutral-600">
              Prepare these documents for a smooth listing process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <FileText size={20} />
                  Legal Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-red-700">
                  <li>• Property deed documents</li>
                  <li>• Title insurance papers</li>
                  <li>• LLC formation documents</li>
                  <li>• Operating agreements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Camera size={20} />
                  Property Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-purple-700">
                  <li>• High-quality photos (multiple angles)</li>
                  <li>• Property tour videos</li>
                  <li>• Exterior and interior shots</li>
                  <li>• Neighborhood highlights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Building size={20} />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-700">
                  <li>• Current market valuation</li>
                  <li>• Square footage details</li>
                  <li>• Property type and condition</li>
                  <li>• Location and amenities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to List Your Property?</h2>
          <p className="text-xl text-white mb-8">
            Join thousands of property owners who have unlocked liquidity through fractional real estate investment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                if (!user) {
                  window.location.href = '/login';
                  return;
                }
                setShowCreateModal(true);
              }}
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4"
            >
              <Upload className="mr-2" size={20} />
              Start Listing Process
            </Button>
            <Button 
              onClick={() => setShowBusinessTour(true)}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-6 py-4"
            >
              <HelpCircle className="mr-2" size={20} />
              Take Business Owner Tour
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <CreatePropertyModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <BusinessOwnerTour
        isOpen={showBusinessTour}
        onClose={() => setShowBusinessTour(false)}
        onComplete={() => setShowBusinessTour(false)}
        onStartListing={() => {
          setShowBusinessTour(false);
          setShowCreateModal(true);
        }}
      />
    </div>
  );
}