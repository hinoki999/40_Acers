import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  onInvest: (propertyId: number) => void;
}

export default function PropertyCard({ property, onInvest }: PropertyCardProps) {
  const progressPercentage = (property.currentShares / property.maxShares) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={property.address}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-secondary text-white">
          <TrendingUp className="w-3 h-3 mr-1" />
          {property.propertyType}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {property.address}
        </h3>
        <p className="text-neutral-600 mb-4">
          {property.city}, {property.state}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-neutral-900">
            ${property.sharePrice}
          </div>
          <div className="text-sm text-neutral-600">
            {property.currentShares}/{property.maxShares} Shares
          </div>
        </div>
        <Progress value={progressPercentage} className="mb-4" />
        <Button
          onClick={() => onInvest(property.id)}
          className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
        >
          Invest
        </Button>
      </CardContent>
    </Card>
  );
}
