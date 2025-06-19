import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPropertySchema } from "@shared/schema";
import { Home, MapPin, DollarSign, Share, Camera, Sparkles, Video } from "lucide-react";

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePropertyModal({ isOpen, onClose }: CreatePropertyModalProps) {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: "",
    propertyValue: "",
    squareFootage: "",
    maxShares: "",
    sharePrice: "",
    thumbnailUrl: "",
    propertyType: "Townhouse",
    description: "",
    zoomMeetingUrl: "",
    zoomMeetingId: "",
    zoomPassword: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Calculate tokenization based on property value and square footage
  const calculateTokenization = (propertyValue: string, squareFootage: string) => {
    if (propertyValue && squareFootage) {
      const value = parseFloat(propertyValue);
      const sqFt = parseInt(squareFootage);
      
      if (value > 0 && sqFt > 0) {
        // Each 10 square feet = 1 token
        const totalTokens = Math.floor(sqFt / 10);
        const tokenPrice = (value / totalTokens).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          maxShares: totalTokens.toString(),
          sharePrice: tokenPrice
        }));
      }
    }
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPropertyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      onClose();
      setFormData({
        address: "",
        city: "",
        state: "",
        zipcode: "",
        maxShares: "",
        sharePrice: "",
        thumbnailUrl: "",
        propertyType: "Townhouse",
        description: "",
        zoomMeetingUrl: "",
        zoomMeetingId: "",
        zoomPassword: "",
      });
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = insertPropertySchema.parse({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        propertyValue: formData.propertyValue,
        squareFootage: parseInt(formData.squareFootage),
        maxShares: parseInt(formData.maxShares),
        sharePrice: formData.sharePrice,
        thumbnailUrl: formData.thumbnailUrl || null,
        propertyType: formData.propertyType,
        zoomMeetingUrl: formData.zoomMeetingUrl || null,
        zoomMeetingId: formData.zoomMeetingId || null,
        zoomPassword: formData.zoomPassword || null,
      });

      createPropertyMutation.mutate(propertyData);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Property Location</h3>
              <p className="text-neutral-600">Tell us where this amazing property is located</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <Home size={16} />
                  Property Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Los Angeles"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="zipcode">ZIP Code</Label>
                <Input
                  id="zipcode"
                  placeholder="90210"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Single Family">Single Family Home</SelectItem>
                    <SelectItem value="Condo">Condominium</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Apartment">Apartment Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Investment Details</h3>
              <p className="text-neutral-600">Set the investment structure for your property</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxShares" className="flex items-center gap-2">
                  <Share size={16} />
                  Total Shares Available
                </Label>
                <Input
                  id="maxShares"
                  type="number"
                  placeholder="1000"
                  value={formData.maxShares}
                  onChange={(e) => setFormData({ ...formData, maxShares: e.target.value })}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  How many shares will this property be divided into?
                </p>
              </div>
              <div>
                <Label htmlFor="sharePrice">Price per Share</Label>
                <div className="relative">
                  <Input
                    id="sharePrice"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={formData.sharePrice}
                    onChange={(e) => setFormData({ ...formData, sharePrice: e.target.value })}
                    className="pl-8"
                    required
                  />
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Individual share price for investors
                </p>
              </div>
              {formData.maxShares && formData.sharePrice && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-neutral-900 mb-2">Investment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Shares:</span>
                      <span className="font-medium">{formData.maxShares.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per Share:</span>
                      <span className="font-medium">${formData.sharePrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary border-t pt-2 mt-2">
                      <span>Total Property Value:</span>
                      <span>${(parseInt(formData.maxShares) * parseFloat(formData.sharePrice)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Visual Appeal</h3>
              <p className="text-neutral-600">Make your property stand out to investors</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="thumbnailUrl" className="flex items-center gap-2">
                  <Camera size={16} />
                  Property Image URL
                </Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/beautiful-property.jpg"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Add a high-quality image to attract investors
                </p>
              </div>
              <div>
                <Label htmlFor="description">Property Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what makes this property special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              {formData.thumbnailUrl && (
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Property preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Zoom Meeting Setup</h3>
              <p className="text-neutral-600">Set up virtual property tours for potential investors</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zoomMeetingUrl" className="flex items-center gap-2">
                  <Video size={16} />
                  Zoom Meeting URL (Optional)
                </Label>
                <Input
                  id="zoomMeetingUrl"
                  type="url"
                  placeholder="https://zoom.us/j/123456789"
                  value={formData.zoomMeetingUrl}
                  onChange={(e) => setFormData({ ...formData, zoomMeetingUrl: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Provide a Zoom link for virtual property tours
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zoomMeetingId">Meeting ID</Label>
                  <Input
                    id="zoomMeetingId"
                    placeholder="123 456 789"
                    value={formData.zoomMeetingId}
                    onChange={(e) => setFormData({ ...formData, zoomMeetingId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zoomPassword">Meeting Password</Label>
                  <Input
                    id="zoomPassword"
                    placeholder="password123"
                    value={formData.zoomPassword}
                    onChange={(e) => setFormData({ ...formData, zoomPassword: e.target.value })}
                  />
                </div>
              </div>
              
              {formData.zoomMeetingUrl && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-neutral-900 mb-2">Virtual Tour Setup</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Meeting URL:</span>
                      <span className="font-medium text-blue-600 truncate ml-2">{formData.zoomMeetingUrl}</span>
                    </div>
                    {formData.zoomMeetingId && (
                      <div className="flex justify-between">
                        <span>Meeting ID:</span>
                        <span className="font-medium">{formData.zoomMeetingId}</span>
                      </div>
                    )}
                    {formData.zoomPassword && (
                      <div className="flex justify-between">
                        <span>Password:</span>
                        <span className="font-medium">{formData.zoomPassword}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    Investors will be able to join virtual property tours using these details
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-neutral-900">
                List Your Property
              </DialogTitle>
              <p className="text-neutral-600">Share your investment opportunity with the community</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${
                    step < currentStep ? 'bg-primary' : 'bg-neutral-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6"
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6 bg-primary text-white hover:bg-primary/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createPropertyMutation.isPending}
                className="px-8 bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90"
              >
                {createPropertyMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    Launch Property
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
