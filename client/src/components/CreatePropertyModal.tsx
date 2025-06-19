import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPropertySchema } from "@shared/schema";

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
    maxShares: "",
    sharePrice: "",
    thumbnailUrl: "",
    propertyType: "Townhouse",
  });

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
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = insertPropertySchema.parse({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        maxShares: parseInt(formData.maxShares),
        sharePrice: formData.sharePrice,
        thumbnailUrl: formData.thumbnailUrl || null,
        propertyType: formData.propertyType,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            Create New Property
          </DialogTitle>
          <p className="text-neutral-600">Enter the details of the new property</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="zipcode">Zipcode</Label>
            <Input
              id="zipcode"
              placeholder="12345"
              value={formData.zipcode}
              onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="maxShares">Max Share Count</Label>
            <Input
              id="maxShares"
              type="number"
              placeholder="100"
              value={formData.maxShares}
              onChange={(e) => setFormData({ ...formData, maxShares: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="sharePrice">Share Price</Label>
            <Input
              id="sharePrice"
              type="number"
              step="0.01"
              placeholder="250.00"
              value={formData.sharePrice}
              onChange={(e) => setFormData({ ...formData, sharePrice: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Enter a valid URL for the property thumbnail image
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            disabled={createPropertyMutation.isPending}
          >
            {createPropertyMutation.isPending ? "Creating..." : "Create Property"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
