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
      
    </div>
  );
}