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
    <div className="flex items-center bg-neutral-100 rounded-lg p-1">
      <Button
        variant={currentCurrency === 'USD' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('USD')}
        className={`${buttonSize} flex items-center gap-1 ${currentCurrency === 'USD' ? 'bg-black text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`}
      >
        <DollarSign size={14} />
        USD
      </Button>
      <Button
        variant={currentCurrency === 'BTC' ? 'default' : 'ghost'}
        size="sm"
        onClick={handleBitcoinClick}
        className={`${buttonSize} flex items-center gap-1 ${
          !isGoldMember 
            ? 'opacity-50 text-gray-400 hover:bg-[#A52A2A] hover:text-white hover:opacity-100' 
            : currentCurrency === 'BTC' 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'text-black hover:bg-gray-100'
        }`}
        title={!isGoldMember ? 'Click to upgrade to Gold membership' : ''}
      >
        <Bitcoin size={14} />
        BTC
        {!isGoldMember && <Crown size={12} className="ml-1 text-yellow-600" />}
      </Button>
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