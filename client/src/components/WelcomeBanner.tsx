import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Sparkles, Gift, TrendingUp } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
  onStartTour: () => void;
  isFirstVisit: boolean;
}

export default function WelcomeBanner({ userName, onStartTour, isFirstVisit }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(isFirstVisit);

  if (!isVisible) return null;

  return (
    <Card className="bg-gradient-to-r from-primary to-accent text-white mb-8 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-6 w-6" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Welcome!
              </Badge>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {isFirstVisit ? "Welcome to 40 Acres!" : `Welcome back${userName ? `, ${userName}` : ""}!`}
            </h2>
            
            <p className="text-blue-100 mb-4 max-w-2xl">
              {isFirstVisit 
                ? "Ready to start your real estate investment journey? Let us show you around the platform and help you get started."
                : "Your real estate portfolio is waiting. Discover new investment opportunities and track your performance."
              }
            </p>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onStartTour}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Star className="h-4 w-4 mr-2" />
                {isFirstVisit ? "Take the Tour" : "Show Me Around"}
              </Button>
              
              {isFirstVisit && (
                <div className="flex items-center space-x-6 text-blue-100 text-sm">
                  <div className="flex items-center space-x-1">
                    <Gift className="h-4 w-4" />
                    <span>No fees to start</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Passive income</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 ml-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}