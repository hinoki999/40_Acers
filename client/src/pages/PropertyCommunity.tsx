import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PropertyCommunityHub from "@/components/PropertyCommunityHub";
import { Property } from "@shared/schema";

export default function PropertyCommunity() {
  const { id } = useParams<{ id: string }>();
  
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading property community...</p>
        </div>
      </div>
    );
  }

  const property = properties?.find(p => p.id === parseInt(id || "0"));
  
  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Community Not Found</h1>
          <p className="text-neutral-600">The property community you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === property.ownerId;

  return (
    <div className="min-h-screen bg-neutral-50">
      <PropertyCommunityHub property={property} isOwner={isOwner} />
    </div>
  );
}