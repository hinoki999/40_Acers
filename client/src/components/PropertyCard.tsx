import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MapPin, Users, Zap, Heart, Video, Calculator, Share2, PieChart } from "lucide-react";
import { Property } from "@shared/schema";
import { useState } from "react";
import BitcoinPriceDisplay from "./BitcoinPriceDisplay";
import TokenizationCalculator from "./TokenizationCalculator";
import SocialInvestorNetwork from "./SocialInvestorNetwork";

interface PropertyCardProps {
  property: Property;
  onInvest: (propertyId: number) => void;
  onShare?: (propertyId: number) => void;
}

export default function PropertyCard({ property, onInvest, onShare }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showTokenization, setShowTokenization] = useState(false);
  
  const progressPercentage = (property.currentShares / property.maxShares) * 100;
  const totalValue = Number(property.sharePrice) * property.maxShares;
  const availableShares = property.maxShares - property.currentShares;

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={property.thumbnailUrl || "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={property.address}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <Badge className="bg-secondary text-white shadow-lg backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            {property.propertyType}
          </Badge>
          {progressPercentage > 75 && (
            <Badge className="bg-accent text-white shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
          {property.zoomMeetingUrl && (
            <Badge className="bg-blue-600 text-white shadow-lg">
              <Video className="w-3 h-3 mr-1" />
              Virtual Tour
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:scale-110"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-600'}`} 
          />
        </button>

        {/* Funding Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {Math.round(progressPercentage)}% Funded
            </span>
            <span>{availableShares} shares left</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors">
              {property.address}
            </h3>
            <p className="text-neutral-600 flex items-center gap-1 text-sm">
              <MapPin size={14} />
              {property.city}, {property.state} {property.zipcode}
            </p>
          </div>
        </div>

        {/* Property Value */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border border-green-100">
          <div className="text-center">
            <div className="text-xs text-green-600 font-medium mb-1">Property Value</div>
            <div className="text-lg font-bold text-green-700">
              ${Number(property.propertyValue).toLocaleString()}
            </div>
            <div className="text-xs text-green-600">
              {property.squareFootage.toLocaleString()} sq ft
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="bg-gradient-to-r from-neutral-50 to-blue-50 rounded-lg p-4 mb-4 border border-neutral-100">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <BitcoinPriceDisplay 
                usdPrice={Number(property.sharePrice)} 
                showBoth={true}
                className="text-center"
              />
              <div className="text-xs text-neutral-600 mt-1">Per Token</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">
                {property.maxShares.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-600 mt-1">Total Tokens</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">
                {property.squareFootage ? property.squareFootage.toLocaleString() : 'N/A'}
              </div>
              <div className="text-xs text-neutral-600 mt-1">Sq Ft</div>
            </div>
          </div>
          
          {property.propertyValue && property.squareFootage && (
            <div className="mt-3 pt-3 border-t border-neutral-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokenization(!showTokenization)}
                className="w-full text-xs text-neutral-600 hover:text-neutral-900"
              >
                <Calculator size={12} className="mr-1" />
                {showTokenization ? 'Hide' : 'Show'} Tokenization Details
              </Button>
            </div>
          )}
        </div>

        {/* Tokenization Calculator */}
        {showTokenization && property.propertyValue && property.squareFootage && (
          <div className="mb-4">
            <TokenizationCalculator
              propertyValue={Number(property.propertyValue)}
              squareFootage={property.squareFootage}
            />
          </div>
        )}

        {/* Progress Bar with Labels */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Funding Progress</span>
            <span className="font-medium">{property.currentShares.toLocaleString()}/{property.maxShares.toLocaleString()}</span>
          </div>
          <div className="relative">
            <Progress value={progressPercentage} className="h-3" />
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Property Description */}
        {property.description && (
          <div className="mb-4 p-3 bg-neutral-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-neutral-900 mb-2">Property Details</h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {property.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {(() => {
            const remainingShares = property.maxShares - property.currentShares;
            const maxPossibleOwnership = (remainingShares / property.maxShares) * 100;
            const canInvest = maxPossibleOwnership >= 49;
            
            return (
              <Button
                onClick={() => onInvest(property.id)}
                disabled={!canInvest}
                className={`w-full transition-all duration-300 shadow-lg hover:shadow-xl btn-touch ${
                  canInvest 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                size="lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp size={16} />
                  {canInvest ? "Invest Now (49% Min)" : "Insufficient Shares Available"}
                </div>
              </Button>
            );
          })()}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-neutral-50"
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-blue-50 border-blue-200 text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(property.id);
              }}
            >
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
            {property.zoomMeetingUrl ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-blue-50 border-blue-200 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(property.zoomMeetingUrl!, '_blank');
                }}
              >
                <Video size={14} className="mr-1" />
                Tour
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-neutral-50"
              >
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {availableShares < 100 && (
          <div className="mt-3 p-2 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-accent-foreground text-center font-medium">
              ⚡ Only {availableShares} shares remaining!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
