import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building, TrendingUp, Shield, Users, Calendar, Phone, Mail, Briefcase, Bitcoin, DollarSign, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

function Business() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    consultationType: "",
    investmentRange: "",
    timeline: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Consultation Request Submitted",
        description: "Our team will contact you within 24 hours to schedule your consultation.",
      });
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        businessType: "",
        consultationType: "",
        investmentRange: "",
        timeline: "",
        description: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const services = [
    {
      icon: Bitcoin,
      title: "Bitcoin Investment Strategy",
      description: "Expert guidance on incorporating Bitcoin into your real estate investment portfolio",
      features: ["Portfolio diversification", "Risk assessment", "Market timing strategies", "Regulatory compliance"]
    },
    {
      icon: Building,
      title: "Real Estate Tokenization",
      description: "Transform your real estate assets into digital tokens for improved liquidity",
      features: ["Asset tokenization", "Smart contract development", "Compliance framework", "Investor relations"]
    },
    {
      icon: TrendingUp,
      title: "Investment Advisory",
      description: "Comprehensive investment strategies combining traditional and digital assets",
      features: ["Market analysis", "Risk management", "Portfolio optimization", "Performance tracking"]
    },
    {
      icon: Shield,
      title: "Compliance & Legal",
      description: "Navigate complex regulations for Bitcoin and real estate investments",
      features: ["Regulatory compliance", "Legal structuring", "Tax optimization", "Documentation"]
    }
  ];

  const consultationTypes = [
    {
      type: "Bitcoin Strategy",
      duration: "60 minutes",
      price: "Free Initial Consultation",
      features: ["Market analysis", "Investment strategy", "Risk assessment", "Portfolio review"]
    },
    {
      type: "Real Estate Tokenization",
      duration: "90 minutes",
      price: "Free Initial Consultation",
      features: ["Tokenization feasibility", "Technical roadmap", "Compliance review", "Market positioning"]
    },
    {
      type: "Comprehensive Advisory",
      duration: "120 minutes",
      price: "Premium Consultation",
      features: ["Full portfolio review", "Multi-asset strategy", "Implementation plan", "Ongoing support"]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Business Consultation Services</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
              Expert guidance for businesses and property owners looking to integrate Bitcoin and 
              real estate investment strategies. Get personalized consultation from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4"
                onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calendar className="mr-2" size={20} />
                Schedule Consultation
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 bg-transparent"
              >
                <Phone className="mr-2 hover:text-black" size={20} />
                <span className="hover:text-black">Call Now: 248-250-4510</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Consultation Services</h2>
            <p className="text-xl text-neutral-600">
              Comprehensive advisory services for modern investment strategies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <service.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-6">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Consultation Types */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Consultation Packages</h2>
            <p className="text-xl text-neutral-600">
              Choose the consultation type that best fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultationTypes.map((consultation, index) => (
              <Card key={index} className={`border-2 ${index === 1 ? 'border-blue-500 bg-blue-50' : 'border-neutral-200'} hover:shadow-lg transition-shadow`}>
                <CardHeader className="text-center">
                  {index === 1 && (
                    <Badge className="w-fit mx-auto mb-2 bg-blue-600">Most Popular</Badge>
                  )}
                  <CardTitle className="text-2xl">{consultation.type}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{consultation.price}</div>
                  <div className="text-neutral-600">{consultation.duration}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consultation.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-6 bg-[#b34034] hover:bg-[#A0522D]"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, consultationType: consultation.type }));
                      document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Consultation Form */}
      <section id="consultation-form" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Schedule Your Consultation</h2>
            <p className="text-xl text-neutral-600">
              Fill out the form below and our team will contact you within 24 hours
            </p>
          </div>
          
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building size={16} />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName" className="flex items-center gap-2">
                      <Users size={16} />
                      Contact Name
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Your Full Name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-estate">Real Estate Company</SelectItem>
                        <SelectItem value="investment-firm">Investment Firm</SelectItem>
                        <SelectItem value="property-owner">Property Owner</SelectItem>
                        <SelectItem value="fintech">Fintech Company</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="consultationType">Consultation Type</Label>
                    <Select value={formData.consultationType} onValueChange={(value) => setFormData({ ...formData, consultationType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bitcoin Strategy">Bitcoin Strategy</SelectItem>
                        <SelectItem value="Real Estate Tokenization">Real Estate Tokenization</SelectItem>
                        <SelectItem value="Comprehensive Advisory">Comprehensive Advisory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="investmentRange">Investment Range</Label>
                    <Select value={formData.investmentRange} onValueChange={(value) => setFormData({ ...formData, investmentRange: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select investment range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                        <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                        <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                        <SelectItem value="5m+">$5M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your project, goals, and what you hope to achieve..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#b34034] hover:bg-[#A0522D] py-4 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Schedule Consultation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Contact Information */}
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">Need Immediate Assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="text-neutral-600">248-250-4510</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="text-neutral-600">info@40acresapp.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div className="text-neutral-600">Mon-Fri, 9AM-6PM EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Business;