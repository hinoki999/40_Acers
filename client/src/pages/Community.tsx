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
      <div className="container-mobile max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Open Houses - Hidden for now as requested */}
        <div className="p-6" style={{display: 'none'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Open Houses</h2>
              <p className="text-gray-600 mt-1">Coming Soon</p>
            </div>
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