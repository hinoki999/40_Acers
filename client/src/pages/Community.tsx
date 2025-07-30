import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import InvestmentModal from "@/components/InvestmentModal";
import { Property } from "@shared/schema";
import { 
  TrendingUp, 
  Users, 
  Grid3X3, 
  Play,
  Flame,
  Clock,
  Heart,
  MessageCircle,
  Search,
  MapPin,
  Calendar,
  Home,
  DollarSign,
  RefreshCw
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";

const mockOpenHouses = [
  {
    id: 1,
    propertyId: 6,
    address: "1909 E Ferry St",
    city: "Detroit",
    state: "MI",
    zipCode: "48207",
    date: "2025-06-28",
    time: "2:00 PM - 4:00 PM",
    propertyType: "Single Family",
    price: "$150,000",
    virtualTour: true,
    host: "Sarah Johnson"
  },
  {
    id: 2,
    propertyId: 7,
    address: "3335 Twenty Third St",
    city: "Detroit",
    state: "MI",
    zipCode: "48208",
    date: "2025-06-29",
    time: "1:00 PM - 3:00 PM",
    propertyType: "Multi-Family",
    price: "$220,000",
    virtualTour: false,
    host: "Michael Chen"
  },
  {
    id: 3,
    propertyId: 8,
    address: "23005 Gratiot Ave",
    city: "Eastpointe",
    state: "MI",
    zipCode: "48021",
    date: "2025-06-30",
    time: "11:00 AM - 1:00 PM",
    propertyType: "Commercial",
    price: "$480,000",
    virtualTour: true,
    host: "Jennifer Davis"
  }
];

const mockFeedPosts = [
  {
    id: 1,
    user: { name: "Alex Thompson", avatar: "AT" },
    timestamp: "2 hours ago",
    content: "Just invested in my 5th property on 40 Acres! The monthly returns are exceeding expectations. Detroit market is looking very promising.",
    likes: 24,
    comments: 8,
    shares: 3,
    propertyId: 6
  },
  {
    id: 2,
    user: { name: "Maria Rodriguez", avatar: "MR" },
    timestamp: "4 hours ago",
    content: "Thanks to 40 Acres, I was able to start my real estate investment journey with just $100. Now I own shares in 3 different properties!",
    likes: 18,
    comments: 12,
    shares: 5,
    propertyId: null
  },
  {
    id: 3,
    user: { name: "David Kim", avatar: "DK" },
    timestamp: "6 hours ago",
    content: "The transparency on this platform is incredible. I can track my investments in real-time and see exactly how my money is working for me.",
    likes: 31,
    comments: 15,
    shares: 8,
    propertyId: null
  },
  {
    id: 4,
    user: { name: "Sarah Johnson", avatar: "SJ" },
    timestamp: "8 hours ago",
    content: "Just received my first dividend payment! $47 from my Detroit property investment. Small steps but it's working! 🏡💰",
    likes: 42,
    comments: 23,
    shares: 12,
    propertyId: 6
  }
];

export default function Community() {
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const handleInvest = (property: Property) => {
    setSelectedProperty(property);
    setIsInvestmentModalOpen(true);
  };

  const filteredOpenHouses = mockOpenHouses.filter(house => {
    if (zipCodeSearch) {
      return house.zipCode.includes(zipCodeSearch);
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">

        {/* Open Houses */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Open Houses</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by zip code..."
                  value={zipCodeSearch}
                  onChange={(e) => setZipCodeSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpenHouses.map((house) => (
              <Card key={house.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{house.address}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {house.city}, {house.state} {house.zipCode}
                      </p>
                    </div>
                    <Badge variant="secondary">{house.propertyType}</Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{house.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{house.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Hosted by {house.host}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#A52A2A]">{house.price}</span>
                    <div className="flex gap-2">
                      {house.virtualTour && (
                        <Badge className="bg-blue-100 text-blue-800">Virtual Tour</Badge>
                      )}
                      <Button size="sm" className="bg-[#A52A2A] hover:bg-[#8B1A1B]">
                        RSVP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
}