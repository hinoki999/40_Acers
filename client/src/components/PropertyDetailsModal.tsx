import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Coffee
} from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest?: (propertyId: number) => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose, onInvest }: PropertyDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            {property.address}
          </DialogTitle>
          <div className="flex items-center gap-2 text-neutral-600">
            <MapPin className="h-4 w-4" />
            <span>{property.city}, {property.state} {property.zipcode}</span>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  <p className="text-neutral-700 leading-relaxed mb-4">
                    {property.description || `Beautiful ${property.propertyType.toLowerCase()} located in the heart of ${property.city}. This stunning property offers modern amenities and excellent investment potential with strong rental demand in the area. The property features high-quality finishes and is located in a desirable neighborhood with easy access to shopping, dining, and entertainment.`}
                  </p>
                  
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

                    {/* Placeholder for map - in real implementation, you'd integrate with Google Maps or similar */}
                    <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center border">
                      <div className="text-center text-neutral-500">
                        <MapIcon className="h-12 w-12 mx-auto mb-2" />
                        <p>Interactive Map</p>
                        <p className="text-sm">Location: {property.city}, {property.state}</p>
                      </div>
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
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              onClick={() => onInvest && onInvest(property.id)}
              className="flex-1"
              size="lg"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Invest in This Property
            </Button>
            <Button variant="outline" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Tour
            </Button>
            <Button variant="outline" size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Returns
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}