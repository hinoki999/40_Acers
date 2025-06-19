// Bitcoin price conversion using CoinGecko API (free)
export async function getBitcoinPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    
    if (!response.ok) {
      console.error('Bitcoin price fetch failed:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.bitcoin?.usd || null;
  } catch (error) {
    console.error('Bitcoin price fetch error:', error);
    return null;
  }
}

export function convertToBitcoin(usdAmount: number, bitcoinPrice: number): number {
  return usdAmount / bitcoinPrice;
}

export function formatBitcoin(btcAmount: number): string {
  if (btcAmount >= 1) {
    return btcAmount.toFixed(4) + ' BTC';
  } else if (btcAmount >= 0.001) {
    return btcAmount.toFixed(6) + ' BTC';
  } else {
    return (btcAmount * 100000000).toFixed(0) + ' sats';
  }
}