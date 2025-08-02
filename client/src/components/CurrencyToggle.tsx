import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, DollarSign, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CurrencyToggleProps {
  onCurrencyChange: (currency: 'USD' | 'BTC') => void;
  currentCurrency: 'USD' | 'BTC';
  size?: 'sm' | 'md';
}

export default function CurrencyToggle({ onCurrencyChange, currentCurrency, size = 'md' }: CurrencyToggleProps) {
  const { user } = useAuth();
  const isGoldMember = (user as any)?.membershipType === "gold";
  
  const buttonSize = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';

  return (
    <div className="flex items-center bg-neutral-100 rounded-lg p-1">
      <Button
        variant={currentCurrency === 'USD' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('USD')}
        className={`${buttonSize} flex items-center gap-1`}
      >
        <DollarSign size={14} />
        USD
      </Button>
      <Button
        variant={currentCurrency === 'BTC' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => isGoldMember ? onCurrencyChange('BTC') : null}
        disabled={!isGoldMember}
        className={`${buttonSize} flex items-center gap-1 ${!isGoldMember ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
        title={!isGoldMember ? 'Bitcoin view requires Gold membership' : ''}
      >
        <Bitcoin size={14} />
        BTC
        {!isGoldMember && <Crown size={12} className="ml-1 text-yellow-600" />}
      </Button>
    </div>
  );
}