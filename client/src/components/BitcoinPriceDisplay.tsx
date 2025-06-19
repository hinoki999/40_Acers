import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Bitcoin } from "lucide-react";

interface BitcoinPriceDisplayProps {
  usdPrice: number;
  className?: string;
  showBoth?: boolean;
}

export default function BitcoinPriceDisplay({ usdPrice, className = "", showBoth = false }: BitcoinPriceDisplayProps) {
  const { data: bitcoinData } = useQuery({
    queryKey: ["/api/bitcoin-price"],
    refetchInterval: 60000, // Refetch every minute
  });

  const bitcoinPrice = bitcoinData?.price;
  const btcAmount = bitcoinPrice ? usdPrice / bitcoinPrice : null;

  const formatBitcoin = (btcAmount: number): string => {
    if (btcAmount >= 1) {
      return btcAmount.toFixed(4) + ' BTC';
    } else if (btcAmount >= 0.001) {
      return btcAmount.toFixed(6) + ' BTC';
    } else {
      return Math.round(btcAmount * 100000000).toLocaleString() + ' sats';
    }
  };

  if (!bitcoinPrice || !btcAmount) {
    return showBoth ? (
      <div className={className}>
        <div className="text-lg font-bold">${usdPrice}</div>
        <div className="text-xs text-neutral-500">BTC price loading...</div>
      </div>
    ) : (
      <span className={className}>${usdPrice}</span>
    );
  }

  if (showBoth) {
    return (
      <div className={className}>
        <div className="text-lg font-bold">${usdPrice.toLocaleString()}</div>
        <div className="flex items-center gap-1 text-sm text-orange-600">
          <Bitcoin size={12} />
          {formatBitcoin(btcAmount)}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
        <Bitcoin size={12} className="mr-1" />
        {formatBitcoin(btcAmount)}
      </Badge>
      <span className="text-sm text-neutral-600">(${usdPrice})</span>
    </div>
  );
}