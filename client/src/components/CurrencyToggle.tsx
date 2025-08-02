import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bitcoin, DollarSign, Crown, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface CurrencyToggleProps {
  onCurrencyChange: (currency: 'USD' | 'BTC') => void;
  currentCurrency: 'USD' | 'BTC';
  size?: 'sm' | 'md';
}

export default function CurrencyToggle({ onCurrencyChange, currentCurrency, size = 'md' }: CurrencyToggleProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showGoldUpgrade, setShowGoldUpgrade] = useState(false);
  const isGoldMember = (user as any)?.membershipType === "gold";
  
  const buttonSize = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';

  const handleBitcoinClick = () => {
    if (isGoldMember) {
      onCurrencyChange('BTC');
    } else {
      setShowGoldUpgrade(true);
    }
  };

  return (
    <>
    <div className="relative flex items-center bg-neutral-200 rounded-full p-1 w-32">
      {/* Sliding background indicator */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out ${
          currentCurrency === 'USD' ? 'left-1' : 'left-[calc(50%+2px)]'
        }`}
      />
      
      {/* USD Button */}
      <button
        onClick={() => onCurrencyChange('USD')}
        className={`relative z-10 flex items-center justify-center gap-1 flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentCurrency === 'USD' 
            ? 'text-black' 
            : 'text-gray-600 hover:text-black'
        }`}
      >
        <DollarSign size={14} />
        <span className="text-xs font-semibold">USD</span>
      </button>
      
      {/* Bitcoin Button */}
      <button
        onClick={handleBitcoinClick}
        className={`relative z-10 flex items-center justify-center gap-1 flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors duration-200 ${
          !isGoldMember 
            ? 'text-gray-400 hover:text-[#A52A2A] cursor-pointer' 
            : currentCurrency === 'BTC' 
              ? 'text-black' 
              : 'text-gray-600 hover:text-black'
        }`}
        title={!isGoldMember ? 'Click to upgrade to Gold membership' : ''}
      >
        <Bitcoin size={14} />
        <span className="text-xs font-semibold">BTC</span>
        {!isGoldMember && <Crown size={10} className="text-yellow-600" />}
      </button>
    </div>

    {/* Gold Upgrade Modal */}
    <Dialog open={showGoldUpgrade} onOpenChange={setShowGoldUpgrade}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Gold
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/attached_assets/bitcoin_1750901526377.webp" alt="Bitcoin" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bitcoin View Requires Gold Membership
            </h3>
            <p className="text-gray-600 text-sm">
              Unlock Bitcoin price view and exclusive features with Gold membership
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Bitcoin price viewing</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Advanced market analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Heat map visualization</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Exclusive property listings</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">$99.99/year</div>
            <div className="text-sm text-gray-500">Billed annually</div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowGoldUpgrade(false);
                setLocation('/settings?tab=membership');
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            <Button
              onClick={() => setShowGoldUpgrade(false)}
              variant="outline"
              className="px-6"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}