import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPropertySchema } from "@shared/schema";
import { Home, MapPin, DollarSign, Share, Camera, Sparkles, Video, FileText, Upload, X, Building, Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    // Document uploads
    deedDocuments: [] as string[],
    titleDocuments: [] as string[],
    llcDocuments: [] as string[],
    // Media uploads
    propertyImages: [] as string[],
    propertyVideos: [] as string[],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [uploadingFiles, setUploadingFiles] = useState(false);

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

  // File upload handler
  const handleFileUpload = async (files: FileList, documentType: string) => {
    setUploadingFiles(true);
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Simulate file upload - in production, this would upload to cloud storage
        const mockUrl = `https://storage.example.com/${documentType}/${Date.now()}-${file.name}`;
        uploadedUrls.push(mockUrl);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload time
      } catch (error) {
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    setUploadingFiles(false);
    return uploadedUrls;
  };

  const handleDocumentUpload = async (files: FileList, docType: 'deed' | 'title' | 'llc' | 'images' | 'videos') => {
    const urls = await handleFileUpload(files, docType);
    
    setFormData(prev => ({
      ...prev,
      [`${docType}Documents`]: docType === 'images' ? 
        [...prev.propertyImages, ...urls] : 
        docType === 'videos' ? 
        [...prev.propertyVideos, ...urls] :
        [...(prev[`${docType}Documents` as keyof typeof prev] as string[]), ...urls]
    }));
  };

  const removeDocument = (docType: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [docType]: (prev[docType as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const createProperty = useMutation({
    mutationFn: (data: any) => apiRequest("/api/properties", "POST", data),
    onSuccess: (response: any) => {
      // Check if property was successfully posted to community feed and marketplace
      if (response.communityFeedPosted && response.marketplacePosted) {
        toast({
          title: "Success!",
          description: "Property listed successfully in Community Feed and Marketplace!",
        });
      } else {
        toast({
          title: "Success!",
          description: "Property created successfully!",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      onClose();
      setFormData({
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
        deedDocuments: [],
        titleDocuments: [],
        llcDocuments: [],
        propertyImages: [],
        propertyVideos: [],
      });
      setCurrentStep(1);
    },
    onError: (error: any) => {
      if (error?.message?.includes("verified business users")) {
        toast({
          title: "Upgrade Required",
          description: "Only verified business users can list properties. Please upgrade your account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create property. Please try again.",
          variant: "destructive",
        });
      }
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
        thumbnailUrl: formData.thumbnailUrl,
        propertyType: formData.propertyType,
        description: formData.description,
        deedDocuments: formData.deedDocuments,
        titleDocuments: formData.titleDocuments,
        llcDocuments: formData.llcDocuments,
        propertyImages: formData.propertyImages,
        propertyVideos: formData.propertyVideos,
        zoomMeetingUrl: formData.zoomMeetingUrl || undefined,
        zoomMeetingId: formData.zoomMeetingId || undefined,
        zoomPassword: formData.zoomPassword || undefined,
      });

      createProperty.mutate(propertyData);
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Property Valuation</h3>
              <p className="text-neutral-600">Enter property value and size to calculate tokenization</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyValue" className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Property Value ($)
                </Label>
                <Input
                  id="propertyValue"
                  type="number"
                  min="1"
                  placeholder="500000"
                  value={formData.propertyValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormData({ ...formData, propertyValue: newValue });
                    calculateTokenization(newValue, formData.squareFootage);
                  }}
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Total market value of the property
                </p>
              </div>
              <div>
                <Label htmlFor="squareFootage" className="flex items-center gap-2">
                  <Home size={16} />
                  Square Footage
                </Label>
                <Input
                  id="squareFootage"
                  type="number"
                  min="1"
                  placeholder="2000"
                  value={formData.squareFootage}
                  onChange={(e) => {
                    const newSqFt = e.target.value;
                    setFormData({ ...formData, squareFootage: newSqFt });
                    calculateTokenization(formData.propertyValue, newSqFt);
                  }}
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Total living space in square feet
                </p>
              </div>
            </div>
            {formData.propertyValue && formData.squareFootage && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-neutral-900 mb-3">Tokenization Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Total Tokens:</span>
                    <div className="font-bold text-lg text-green-600">
                      {formData.maxShares ? parseInt(formData.maxShares).toLocaleString() : '0'}
                    </div>
                    <p className="text-xs text-neutral-500">Based on sq ft ÷ 10</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Token Price:</span>
                    <div className="font-bold text-lg text-blue-600">
                      ${formData.sharePrice || '0'}
                    </div>
                    <p className="text-xs text-neutral-500">Value ÷ tokens</p>
                  </div>
                  <div>
                    <span className="text-neutral-600">Price per Sq Ft:</span>
                    <div className="font-bold text-lg text-purple-600">
                      ${formData.propertyValue && formData.squareFootage ? 
                        (parseFloat(formData.propertyValue) / parseInt(formData.squareFootage)).toFixed(0) : '0'}
                    </div>
                    <p className="text-xs text-neutral-500">Market rate</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Tokenization Formula:</strong> Each 10 sq ft = 1 token. 
                    Token price = Property value ÷ Total tokens.
                  </p>
                </div>
              </div>
            )}
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
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Legal Documentation</h3>
              <p className="text-neutral-600">Upload property deeds, titles, and business documents for verification</p>
            </div>
            
            <div className="space-y-4">
              {/* Property Deed Upload */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <Shield className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">Property Deed</h4>
                  <p className="text-sm text-neutral-600 mb-4">Upload official property deed documents (PDF, JPG, PNG)</p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleDocumentUpload(e.target.files, 'deed')}
                    className="hidden"
                    id="deed-upload"
                  />
                  <Label htmlFor="deed-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingFiles}>
                      <Upload className="mr-2" size={16} />
                      {uploadingFiles ? 'Uploading...' : 'Select Files'}
                    </Button>
                  </Label>
                </div>
                {formData.deedDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium text-sm">Uploaded Documents:</p>
                    {formData.deedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="text-sm text-green-800">{doc.split('/').pop()}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('deedDocuments', index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title Documents Upload */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">Title Documents</h4>
                  <p className="text-sm text-neutral-600 mb-4">Upload title insurance and ownership documents</p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleDocumentUpload(e.target.files, 'title')}
                    className="hidden"
                    id="title-upload"
                  />
                  <Label htmlFor="title-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingFiles}>
                      <Upload className="mr-2" size={16} />
                      {uploadingFiles ? 'Uploading...' : 'Select Files'}
                    </Button>
                  </Label>
                </div>
                {formData.titleDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium text-sm">Uploaded Documents:</p>
                    {formData.titleDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="text-sm text-green-800">{doc.split('/').pop()}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('titleDocuments', index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LLC Documents Upload */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <Building className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">Business LLC Documents</h4>
                  <p className="text-sm text-neutral-600 mb-4">Upload LLC formation documents and operating agreements</p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleDocumentUpload(e.target.files, 'llc')}
                    className="hidden"
                    id="llc-upload"
                  />
                  <Label htmlFor="llc-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingFiles}>
                      <Upload className="mr-2" size={16} />
                      {uploadingFiles ? 'Uploading...' : 'Select Files'}
                    </Button>
                  </Label>
                </div>
                {formData.llcDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium text-sm">Uploaded Documents:</p>
                    {formData.llcDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="text-sm text-green-800">{doc.split('/').pop()}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('llcDocuments', index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Property Media</h3>
              <p className="text-neutral-600">Upload high-quality images and videos of your property</p>
            </div>
            
            <div className="space-y-4">
              {/* Property Images Upload */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">Property Images</h4>
                  <p className="text-sm text-neutral-600 mb-4">Upload multiple high-quality photos (JPG, PNG, max 10MB each)</p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleDocumentUpload(e.target.files, 'images')}
                    className="hidden"
                    id="images-upload"
                  />
                  <Label htmlFor="images-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingFiles}>
                      <Upload className="mr-2" size={16} />
                      {uploadingFiles ? 'Uploading...' : 'Select Images'}
                    </Button>
                  </Label>
                </div>
                {formData.propertyImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {formData.propertyImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center text-xs text-neutral-600 overflow-hidden">
                          <Camera size={20} />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeDocument('propertyImages', index)}
                        >
                          <X size={12} />
                        </Button>
                        <p className="text-xs text-center mt-1 truncate">{img.split('/').pop()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Videos Upload */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-primary transition-colors">
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-900 mb-2">Property Videos</h4>
                  <p className="text-sm text-neutral-600 mb-4">Upload property tour videos (MP4, MOV, max 100MB each)</p>
                  <Input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => e.target.files && handleDocumentUpload(e.target.files, 'videos')}
                    className="hidden"
                    id="videos-upload"
                  />
                  <Label htmlFor="videos-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploadingFiles}>
                      <Upload className="mr-2" size={16} />
                      {uploadingFiles ? 'Uploading...' : 'Select Videos'}
                    </Button>
                  </Label>
                </div>
                {formData.propertyVideos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium text-sm">Uploaded Videos:</p>
                    {formData.propertyVideos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                        <span className="text-sm text-purple-800 flex items-center">
                          <Video size={16} className="mr-2" />
                          {video.split('/').pop()}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument('propertyVideos', index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Business Verification Required</h3>
              <p className="text-neutral-600 max-w-md mx-auto">
                Property listing is available for verified business users only. You'll need to complete business verification and pay the listing fee.
              </p>
            </div>

            {/* Business Verification Status */}
            <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Building className="text-white" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">Business Verification Status</h4>
                  <p className="text-amber-700 text-sm">Required for property listings</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-800">Business LLC Documents</span>
                  <Badge variant="outline" className="border-amber-300 text-amber-800">
                    {formData.llcDocuments.length > 0 ? "Uploaded" : "Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-800">Property Deed & Title</span>
                  <Badge variant="outline" className="border-amber-300 text-amber-800">
                    {(formData.deedDocuments.length > 0 && formData.titleDocuments.length > 0) ? "Complete" : "Required"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-800">Property Media</span>
                  <Badge variant="outline" className="border-amber-300 text-amber-800">
                    {formData.propertyImages.length > 0 ? "Uploaded" : "Required"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Listing Fee Calculation */}
            {formData.propertyValue && formData.state && (
              <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Listing Fee Calculation
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Property Value:</span>
                    <span className="font-semibold">${Number(formData.propertyValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700">Location ({formData.state}):</span>
                    <span className="text-sm text-neutral-600">
                      {(['CA', 'NY', 'WA', 'MA', 'HI'].includes(formData.state.toUpperCase())) ? "High-value market" : 
                       (['TX', 'FL', 'OH', 'IN', 'TN'].includes(formData.state.toUpperCase())) ? "Standard market" : "Standard market"}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Listing Fee:</span>
                      <span className="text-green-600">
                        ${Math.round((Number(formData.propertyValue) * (
                          Number(formData.propertyValue) < 100000 ? 3.0 :
                          Number(formData.propertyValue) < 500000 ? 2.5 :
                          Number(formData.propertyValue) < 1000000 ? 2.0 : 1.5
                        )) / 100).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      Fee: {Number(formData.propertyValue) < 100000 ? "3%" : 
                            Number(formData.propertyValue) < 500000 ? "2.5%" :
                            Number(formData.propertyValue) < 1000000 ? "2%" : "1.5%"} of property value
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Tour Setup */}
            <div className="border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Video size={20} />
                Virtual Tour Setup (Optional)
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="zoomMeetingUrl" className="flex items-center gap-2">
                    <Video size={16} />
                    Zoom Meeting URL
                  </Label>
                  <Input
                    id="zoomMeetingUrl"
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    value={formData.zoomMeetingUrl}
                    onChange={(e) => setFormData({ ...formData, zoomMeetingUrl: e.target.value })}
                  />
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
                      placeholder="Optional password"
                      value={formData.zoomPassword}
                      onChange={(e) => setFormData({ ...formData, zoomPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            <div className="space-y-6">
              {/* Virtual Tour Setup */}
              <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Video size={20} />
                  Virtual Tour Setup (Optional)
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="zoomMeetingUrl" className="flex items-center gap-2">
                      <Video size={16} />
                      Zoom Meeting URL
                    </Label>
                    <Input
                      id="zoomMeetingUrl"
                      type="url"
                      placeholder="https://zoom.us/j/123456789"
                      value={formData.zoomMeetingUrl}
                      onChange={(e) => setFormData({ ...formData, zoomMeetingUrl: e.target.value })}
                      className="mt-2"
                    />
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
                </div>
              </div>

              {/* Submission Summary */}
              <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Submission Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Property:</span>
                      <span className="font-medium">{formData.address || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Type:</span>
                      <span className="font-medium">{formData.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Value:</span>
                      <span className="font-medium">${formData.propertyValue ? parseInt(formData.propertyValue).toLocaleString() : '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Square Footage:</span>
                      <span className="font-medium">{formData.squareFootage ? parseInt(formData.squareFootage).toLocaleString() : '0'} sq ft</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Deed Documents:</span>
                      <span className="font-medium">{formData.deedDocuments.length} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Title Documents:</span>
                      <span className="font-medium">{formData.titleDocuments.length} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">LLC Documents:</span>
                      <span className="font-medium">{formData.llcDocuments.length} files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Property Media:</span>
                      <span className="font-medium">{formData.propertyImages.length + formData.propertyVideos.length} files</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">
                    <strong>Review Required:</strong> Your property will be reviewed by our team within 2-3 business days. 
                    You'll receive updates via email about the verification status.
                  </p>
                </div>
              </div>
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
              <DialogDescription className="text-sm text-neutral-600 mt-1">
                Step {currentStep} of {totalSteps}: Complete property documentation
              </DialogDescription>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-neutral-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#b34034] hover:bg-[#A0522D]"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createProperty.isPending}
                className="bg-[#b34034] hover:bg-[#A0522D]"
              >
                {createProperty.isPending ? "Creating..." : "Submit Property"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}