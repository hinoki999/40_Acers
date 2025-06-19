import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin, DollarSign } from "lucide-react";

interface CurrencyToggleProps {
  onCurrencyChange: (currency: 'USD' | 'BTC') => void;
  currentCurrency: 'USD' | 'BTC';
}

export default function CurrencyToggle({ onCurrencyChange, currentCurrency }: CurrencyToggleProps) {
  return (
    <div className="flex items-center bg-neutral-100 rounded-lg p-1">
      <Button
        variant={currentCurrency === 'USD' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('USD')}
        className={`flex items-center gap-1 ${
          currentCurrency === 'USD' 
            ? 'bg-white shadow-sm' 
            : 'hover:bg-neutral-200'
        }`}
      >
        <DollarSign size={14} />
        USD
      </Button>
      <Button
        variant={currentCurrency === 'BTC' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('BTC')}
        className={`flex items-center gap-1 ${
          currentCurrency === 'BTC' 
            ? 'bg-orange-100 text-orange-700 border-orange-200' 
            : 'hover:bg-neutral-200'
        }`}
      >
        <Bitcoin size={14} />
        BTC
      </Button>
    </div>
  );
}