import { Button } from "@/components/ui/button";

interface CurrencyToggleProps {
  currentCurrency: 'USD' | 'BTC';
  onCurrencyChange: (currency: 'USD' | 'BTC') => void;
}

export default function CurrencyToggle({ currentCurrency, onCurrencyChange }: CurrencyToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        size="sm"
        variant={currentCurrency === 'USD' ? 'default' : 'ghost'}
        onClick={() => onCurrencyChange('USD')}
        className="h-8 px-3"
      >
        USD
      </Button>
      <Button
        size="sm"
        variant={currentCurrency === 'BTC' ? 'default' : 'ghost'}
        onClick={() => onCurrencyChange('BTC')}
        className="h-8 px-3"
      >
        BTC
      </Button>
    </div>
  );
}