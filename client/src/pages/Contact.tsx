import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, MessageSquare, HelpCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

export default function Contact() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    subject: '',
    category: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.category || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    // Reset form for non-authenticated users
    if (!user) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
    } else {
      setFormData({
        ...formData,
        subject: '',
        category: '',
        message: ''
      });
    }
  };

  const faqs = [
    {
      question: "How does fractional real estate investing work on 40 Acres?",
      answer: "40 Acres allows you to invest in real estate properties starting with as little as $100. Properties are tokenized, meaning ownership is divided into digital shares. When you invest, you purchase a percentage of the property and earn proportional rental income and appreciation."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and Bitcoin. You can manage your payment methods in your Account Settings under the Payment Methods tab."
    },
    {
      question: "How do I receive my investment earnings?",
      answer: "Earnings are distributed monthly to your 40 Acres Wallet. You can then transfer funds to your connected bank account, PayPal, or cryptocurrency wallet. Gold members have access to instant withdrawals."
    },
    {
      question: "Is my investment FDIC insured?",
      answer: "Real estate investments are not FDIC insured as they are not bank deposits. However, all transactions are secured and your investment records are protected. We recommend diversifying your investment portfolio."
    },
    {
      question: "What is KYC/AML verification and why is it required?",
      answer: "Know Your Customer (KYC) and Anti-Money Laundering (AML) verification helps us comply with financial regulations and protect your account. We use Veriff for secure identity verification using government-issued ID."
    },
    {
      question: "Can I sell my property shares?",
      answer: "Yes, you can list your property shares for sale on our marketplace. Other investors can purchase your shares, providing liquidity for your investment. Transaction fees may apply."
    },
    {
      question: "What's the difference between Free and Gold membership?",
      answer: "Gold membership ($99.99/month) provides access to premium features including the 40 Acres Wallet, priority investment opportunities, lower transaction fees, and exclusive market analytics."
    },
    {
      question: "How are property values determined?",
      answer: "Property values are determined by professional appraisals, market analysis, and our AI-powered valuation system. Values are updated regularly to reflect current market conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300">
              Have questions about real estate investing? We're here to help.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-[#A52A2A] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm">support@40acres.com</p>
              <p className="text-gray-500 text-xs mt-1">Response within 24 hours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-[#A52A2A] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm">1-800-40-ACRES</p>
              <p className="text-gray-500 text-xs mt-1">Mon-Fri 9AM-6PM EST</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-[#A52A2A] mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-gray-600 text-sm">Powered by</span>
                <img 
                  src="/attached_assets/Aphid_logo_horizontal_green_light_2x_1753934905976.png" 
                  alt="Aphid" 
                  className="h-4 object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm font-medium">Coming Soon</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="investment">Investment Support</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="account">Account Support</SelectItem>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="property">Property Listing</SelectItem>
                      <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Please provide details about your question or issue..."
                  rows={6}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#A52A2A] hover:bg-[#8B1A1A] text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}