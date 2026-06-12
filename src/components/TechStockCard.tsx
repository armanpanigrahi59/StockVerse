import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TechStock {
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

interface TechStockCardProps {
  techStock: TechStock | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  theme: any;
  isConnected: boolean;
}

export const TechStockCard: React.FC<TechStockCardProps> = ({
  techStock,
  loading,
  error,
  onRefresh,
  theme,
  isConnected
}) => {
  if (loading && !techStock) {
    return (
      <div className={`${theme.glass} backdrop-blur-md rounded-xl transition-all duration-500 
        ${theme.border} border ${theme.hover} hover:scale-105 ${theme.animation}`}>
        <div className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className={`${theme.heading} text-lg`}>TECH</h3>
              <p className={`${theme.text} text-sm`}>Loading Live Data...</p>
            </div>
            <div className="animate-spin">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className={`text-2xl ${theme.highlight} font-bold animate-pulse`}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || !techStock) {
    return (
      <div className={`${theme.glass} backdrop-blur-md rounded-xl transition-all duration-500 
        ${theme.border} border ${theme.hover} hover:scale-105 ${theme.animation}`}>
        <div className="p-4 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className={`${theme.heading} text-lg`}>TECH</h3>
              <p className={`${theme.text} text-sm`}>Live Market Data</p>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-red-500" />
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className={`text-2xl ${theme.highlight} font-bold`}>
            ₹{techStock?.price?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {error || 'Unable to load live data'}
          </div>
        </div>
      </div>
    );
  }

  const isPositive = techStock.change >= 0;

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
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className={`${theme.heading} text-lg`}>{techStock.symbol}</h3>
            <p className={`${theme.text} text-sm`}>{techStock.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${isPositive ? theme.success : theme.error} font-bold animate-pulse`}>
              {isPositive ? '+' : ''}{techStock.changePercent}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-6 w-6 p-0 hover:bg-primary/20"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className={`text-2xl ${theme.highlight} font-bold`}>
          ₹{techStock.price.toFixed(2)}
        </div>

        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${isPositive ? theme.success : theme.error}`}>
            {isPositive ? '+' : ''}₹{techStock.change.toFixed(2)}
          </span>
        </div>

        {/* Additional data */}
        {techStock.volume && (
          <div className="mt-3 pt-2 border-t border-border/30">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="block">Volume</span>
                <span className="font-semibold">{techStock.volume.toLocaleString()}</span>
              </div>
              <div>
                <span className="block">Day Range</span>
                <span className="font-semibold">
                  ₹{techStock.low?.toFixed(2)} - ₹{techStock.high?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300
          ${isPositive ? theme.success : theme.error}`}
          style={{ width: `${Math.min(Math.abs(techStock.changePercent) * 10, 100)}%` }}
        />

        {/* Live data indicator */}
        <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
          {isConnected ? 'LIVE' : 'CACHED'}
        </div>
      </div>
    </div>
  );
};

