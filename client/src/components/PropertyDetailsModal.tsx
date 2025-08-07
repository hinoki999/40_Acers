import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Calendar, 
  TrendingUp, 
  Shield, 
  School, 
  MapIcon,
  DollarSign,
  BarChart3,
  FileText,
  Star,
  Clock,
  Calculator,
  Users,
  Target,
  Zap,
  Building,
  TreePine,
  Wifi,
  Dumbbell,
  Waves,
  Coffee,
  Send,
  Eye,
  MessageSquare
} from "lucide-react";
import { Property } from "@shared/schema";
import GoogleMap from "./GoogleMap";
import OnboardingTour from "./OnboardingTour";

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest?: (propertyId: number) => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose, onInvest }: PropertyDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Report form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportType, setReportType] = useState("update");
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  if (!property) return null;

  // Check if current user is the property owner
  const isPropertyOwner = user && property.ownerId === (user as any).id;
  
  // Check if user has invested in this property
  const { data: userInvestments = [] } = useQuery({
    queryKey: ["/api/investments"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });
  
  const hasUserInvested = (userInvestments as any[]).some((inv: any) => inv.propertyId === property.id);

  
  // Fetch property reports
  const { data: propertyReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/properties", property.id, "reports"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isOpen && (isPropertyOwner || hasUserInvested) ? true : false,
  });
  
  const typedPropertyReports = propertyReports as any[];
  
  // Send report mutation
  const sendReportMutation = useMutation({
    mutationFn: async (reportData: { title: string; content: string; reportType: string }) => {
      const response = await apiRequest('POST', `/api/properties/${property.id}/reports`, reportData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Sent",
        description: "Your report has been sent to all investors in this property.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties", property.id, "reports"] });
      setReportTitle("");
      setReportContent("");
      setReportType("update");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send report. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSendReport = () => {
    if (!reportTitle.trim() || !reportContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for the report.",
        variant: "destructive",
      });
      return;
    }
    
    sendReportMutation.mutate({
      title: reportTitle,
      content: reportContent,
      reportType,
    });
  };
  
  const handleInvestClick = () => {
    if (!user) {
      setShowGettingStarted(true);
      return;
    }
    if (onInvest) {
      onInvest(property.id);
    }
  };

  const progressPercentage = (property.currentShares / property.maxShares) * 100;
  const availableShares = property.maxShares - property.currentShares;
  const totalInvestment = Number(property.sharePrice) * property.maxShares;
  const monthlyRentalIncome = (Number(property.propertyValue) * (Number(property.rentalYield) || 8) / 100) / 12;

  // Mock additional images for demonstration
  const propertyImages = [
    property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  ];

  const amenityIcons: { [key: string]: any } = {
    "Swimming Pool": Waves,
    "Fitness Center": Dumbbell,
    "WiFi": Wifi,
    "Coffee Shop": Coffee,
    "Parking": Car,
    "Garden": TreePine,
    "Gym": Dumbbell,
    "Pool": Waves,
    "Internet": Wifi,
    "Cafe": Coffee,
  };

  const getAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity] || Star;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto container-mobile mx-2 sm:mx-4 w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 break-words">
            <Building className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </DialogTitle>
          <div className="flex items-center gap-2 text-neutral-600 text-sm sm:text-base">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', ' + property.city + ', ' + property.state + ' ' + property.zipcode)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline cursor-pointer truncate"
            >
              {property.city}, {property.state} {property.zipcode}
            </a>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={propertyImages[activeImageIndex]}
                alt={`${property.address} - Image ${activeImageIndex + 1}`}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
                }}
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white">
                  {activeImageIndex + 1} / {propertyImages.length}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {propertyImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index ? 'border-primary' : 'border-neutral-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={`grid w-full text-xs sm:text-sm ${isPropertyOwner ? 'grid-cols-3 sm:grid-cols-6' : hasUserInvested ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} gap-1 sm:gap-0`}>
              <TabsTrigger value="overview" className="px-2 py-1 sm:px-3 sm:py-2">Overview</TabsTrigger>
              <TabsTrigger value="details" className="px-2 py-1 sm:px-3 sm:py-2">Details</TabsTrigger>
              <TabsTrigger value="investment" className="px-2 py-1 sm:px-3 sm:py-2">Investment</TabsTrigger>
              <TabsTrigger value="location" className="px-2 py-1 sm:px-3 sm:py-2">Location</TabsTrigger>
              {!!isPropertyOwner && <TabsTrigger value="documents" className="px-2 py-1 sm:px-3 sm:py-2">Documents</TabsTrigger>}
              {!!isPropertyOwner && <TabsTrigger value="send-report" className="px-2 py-1 sm:px-3 sm:py-2">Send Report</TabsTrigger>}
              {!!hasUserInvested && <TabsTrigger value="investor-reports" className="px-2 py-1 sm:px-3 sm:py-2">Investor Reports</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      ${Number(property.propertyValue).toLocaleString()}
                    </div>
                    <p className="text-sm text-neutral-600">Property Value</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      ${property.sharePrice}
                    </div>
                    <p className="text-sm text-neutral-600">Per Token</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {property.rentalYield || 8.5}%
                    </div>
                    <p className="text-sm text-neutral-600">Rental Yield</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {availableShares.toLocaleString()}
                    </div>
                    <p className="text-sm text-neutral-600">Available Tokens</p>
                  </CardContent>
                </Card>
              </div>

              {/* Property Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Property Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 text-neutral-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Property Owner: ID #{property.ownerId}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">
                      {property.description || `Beautiful ${property.propertyType.toLowerCase()} located in the heart of ${property.city}. This stunning property offers modern amenities and excellent investment potential with strong rental demand in the area. The property features high-quality finishes and is located in a desirable neighborhood with easy access to shopping, dining, and entertainment.`}
                    </p>
                  </div>
                  
                  {/* Property Highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    {property.bedrooms && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-primary" />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-primary" />
                        <span>{property.bathrooms} Bathrooms</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span>{property.squareFootage.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Investment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Funding Progress</span>
                      <span className="text-sm text-neutral-600">
                        {property.currentShares.toLocaleString()} / {property.maxShares.toLocaleString()} tokens
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Raised:</span>
                        <div className="font-bold text-green-600">
                          ${(property.currentShares * Number(property.sharePrice)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Remaining:</span>
                        <div className="font-bold text-blue-600">
                          ${(availableShares * Number(property.sharePrice)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Progress:</span>
                        <div className="font-bold text-purple-600">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {/* Property Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 text-neutral-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Property Owner: ID #{property.ownerId}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Property Type:</span>
                        <span className="font-medium">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Square Footage:</span>
                        <span className="font-medium">{property.squareFootage.toLocaleString()} sq ft</span>
                      </div>
                      {property.bedrooms && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Bedrooms:</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Bathrooms:</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.yearBuilt && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Year Built:</span>
                          <span className="font-medium">{property.yearBuilt}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {property.lotSize && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Lot Size:</span>
                          <span className="font-medium">{property.lotSize} acres</span>
                        </div>
                      )}
                      {property.parking && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Parking:</span>
                          <span className="font-medium">{property.parking}</span>
                        </div>
                      )}
                      {property.walkScore && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Walk Score:</span>
                          <span className="font-medium">{property.walkScore}/100</span>
                        </div>
                      )}
                      {property.crimeRating && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Crime Rating:</span>
                          <span className="font-medium">{property.crimeRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                          {getAmenityIcon(amenity)}
                          <span className="text-sm font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Nearby Schools */}
              {property.nearbySchools && property.nearbySchools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Nearby Schools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {property.nearbySchools.map((school, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <School className="h-4 w-4 text-blue-600" />
                          <span>{school}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="investment" className="space-y-6">
              {/* Investment Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Property Value:</span>
                        <span className="font-bold text-green-600">
                          ${Number(property.propertyValue).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Token Price:</span>
                        <span className="font-bold text-blue-600">${property.sharePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Total Tokens:</span>
                        <span className="font-medium">{property.maxShares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Available Tokens:</span>
                        <span className="font-medium">{availableShares.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Expected Rental Yield:</span>
                        <span className="font-bold text-green-600">
                          {property.rentalYield || 8.5}% annually
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Monthly Rental Income:</span>
                        <span className="font-bold text-green-600">
                          ${monthlyRentalIncome.toLocaleString()}
                        </span>
                      </div>
                      {property.appreciationRate && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Appreciation Rate:</span>
                          <span className="font-bold text-purple-600">
                            {property.appreciationRate}% annually
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Price per Sq Ft:</span>
                        <span className="font-medium">
                          ${(Number(property.propertyValue) / property.squareFootage).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">Investment Example</h4>
                    <p className="text-blue-800 text-sm">
                      If you invest in 10 tokens (${(Number(property.sharePrice) * 10).toLocaleString()}), 
                      you could earn approximately ${((monthlyRentalIncome * 10) / property.maxShares).toFixed(2)} 
                      per month in rental income, based on current market projections.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              {property.marketTrends && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Market Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700">{property.marketTrends}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Address</h4>
                        <p className="text-neutral-700">
                          {property.address}<br />
                          {property.city}, {property.state} {property.zipcode}
                        </p>
                      </div>
                      
                      {property.walkScore && (
                        <div>
                          <h4 className="font-semibold mb-2">Walkability</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={property.walkScore} className="flex-1" />
                            <span className="font-medium">{property.walkScore}/100</span>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">
                            {property.walkScore >= 90 ? "Walker's Paradise" : 
                             property.walkScore >= 70 ? "Very Walkable" :
                             property.walkScore >= 50 ? "Somewhat Walkable" : "Car-Dependent"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Interactive Google Map */}
                    <div className="w-full h-64">
                      <GoogleMap
                        address={property.address}
                        city={property.city}
                        state={property.state}
                        zipcode={property.zipcode}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Legal Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Property Deeds</h4>
                      {property.deedDocuments && property.deedDocuments.length > 0 ? (
                        property.deedDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Deed Document {index + 1}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500">Documents pending upload</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Title Documents</h4>
                      {property.titleDocuments && property.titleDocuments.length > 0 ? (
                        property.titleDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Title Document {index + 1}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500">Documents pending upload</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">LLC Documents</h4>
                      {property.llcDocuments && property.llcDocuments.length > 0 ? (
                        property.llcDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <Building className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">LLC Document {index + 1}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500">Documents pending upload</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Send Report Tab - Only for Property Owners */}
            <TabsContent value="send-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Report to Investors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Send updates and reports to all investors who have invested in this property.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reportTitle">Report Title</Label>
                      <Input
                        id="reportTitle"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="Enter report title..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="update">General Update</SelectItem>
                          <SelectItem value="maintenance">Maintenance Report</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                          <SelectItem value="general">General Information</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="reportContent">Report Content</Label>
                      <Textarea
                        id="reportContent"
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        placeholder="Enter report content..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSendReport}
                      disabled={sendReportMutation.isPending || !reportTitle.trim() || !reportContent.trim()}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendReportMutation.isPending ? "Sending..." : "Send Report"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investor Reports Tab - Only for Investors */}
            <TabsContent value="investor-reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Investor Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 mb-4">
                    Reports and updates from the property owner about this investment.
                  </p>
                  
                  {reportsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : typedPropertyReports.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
                      <p className="text-gray-600">
                        The property owner hasn't sent any reports yet. Check back later for updates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {typedPropertyReports.map((report: any) => (
                        <div key={report.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{String(report.title)}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {String(report.reportType).charAt(0).toUpperCase() + String(report.reportType).slice(1)}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {String(report.content)}
                          </div>
                          {report.attachments && report.attachments.length > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                              <div className="flex flex-wrap gap-2">
                                {report.attachments.map((attachment: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    📎 {String(attachment)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
            <Button
              onClick={handleInvestClick}
              className="w-full sm:flex-1 bg-black text-white hover:bg-gray-200 hover:text-black text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
              size="sm"
            >
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="truncate">Invest in This Property</span>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-200 hover:text-black text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3" size="sm">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="truncate">Schedule Tour</span>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-200 hover:text-black text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3" size="sm">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="truncate">Calculate Returns</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    {/* Getting Started Modal for Unauthenticated Users */}
    {showGettingStarted && (
      <OnboardingTour
        isOpen={showGettingStarted}
        onClose={() => setShowGettingStarted(false)}
        onComplete={() => setShowGettingStarted(false)}
      />
    )}
    </>
  );
}