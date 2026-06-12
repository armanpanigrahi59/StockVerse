import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
}

interface LiveStockCardProps {
  stock: StockData;
  theme: any;
  isConnected: boolean;
  onRefresh?: () => void;
  loading?: boolean;
}

export const LiveStockCard: React.FC<LiveStockCardProps> = ({
  stock,
  theme,
  isConnected,
  onRefresh,
  loading = false
}) => {
  const isPositive = stock.change >= 0;

  return (
    <div className={`${theme.glass} backdrop-blur-md rounded-xl transition-all duration-500 
      ${theme.border} border ${theme.hover} hover:scale-105 ${theme.animation}
      ${isConnected ? 'ring-2 ring-green-500/30' : 'ring-2 ring-yellow-500/30'}`}>
      <div className="p-4 relative overflow-hidden">
        {/* Live indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          {isConnected ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-yellow-500" />
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-5 w-5 p-0 hover:bg-primary/20 ml-1"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className={`${theme.heading} text-lg`}>{stock.symbol}</h3>
            <p className={`${theme.text} text-sm`}>{stock.name}</p>
          </div>
          <span className={`${isPositive ? theme.success : theme.error} font-bold animate-pulse`}>
            {isPositive ? '+' : ''}{stock.changePercent}%
          </span>
        </div>

        <div className={`text-2xl ${theme.highlight} font-bold`}>
          ₹{stock.price.toFixed(2)}
        </div>

        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${isPositive ? theme.success : theme.error}`}>
            {isPositive ? '+' : ''}₹{stock.change.toFixed(2)}
          </span>
        </div>

        {/* Additional data */}
        {stock.volume && (
          <div className="mt-3 pt-2 border-t border-border/30">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="block">Volume</span>
                <span className="font-semibold">{stock.volume.toLocaleString()}</span>
              </div>
              <div>
                <span className="block">Day Range</span>
                <span className="font-semibold">
                  ₹{stock.low?.toFixed(2)} - ₹{stock.high?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300
          ${isPositive ? theme.success : theme.error}`}
          style={{ width: `${Math.min(Math.abs(stock.changePercent) * 10, 100)}%` }}
        />

        {/* Live data indicator */}
        <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
          {isConnected ? 'LIVE' : 'CACHED'}
        </div>
      </div>
    </div>
  );
};

