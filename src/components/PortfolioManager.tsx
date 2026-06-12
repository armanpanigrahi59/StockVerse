import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Wallet } from 'lucide-react';

// Removed unused interfaces - only TECH trading is supported now

interface TechStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TechInvestments {
  shares: number;
  avgPrice: number;
}

interface PortfolioManagerProps {
  onPortfolioUpdate: (newValue: number) => void;
  techStock?: TechStock | null;
  techInvestments?: TechInvestments;
  onTechTrade?: (action: 'buy' | 'sell', shares: number) => void;
  userMoney?: number;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ 
  onPortfolioUpdate, 
  techStock, 
  techInvestments = { shares: 0, avgPrice: 0 },
  onTechTrade,
  userMoney = 10000
}) => {
  const [techSharesToTrade, setTechSharesToTrade] = useState(1);

  // Calculate total portfolio value including TECH investments
  const techValue = techStock && techInvestments.shares > 0 ? techInvestments.shares * techStock.price : 0;
  const techProfitLoss = techStock && techInvestments.shares > 0 ? techValue - (techInvestments.shares * techInvestments.avgPrice) : 0;
  const totalValue = userMoney + techProfitLoss;

  // Notify parent component of portfolio value change
  useEffect(() => {
    onPortfolioUpdate(totalValue);
  }, [totalValue, onPortfolioUpdate]);

  // Simplified component - only handles TECH trading now

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Available Cash</div>
              <div className="text-2xl font-bold">₹{userMoney.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
              <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
            </div>
          </div>
          {techProfitLoss !== 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground">TECH Investment P&L</div>
              <div className={`text-lg font-bold ${techProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {techProfitLoss >= 0 ? '+' : ''}₹{techProfitLoss.toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trading Interface removed - all stocks are now live data only */}

      {/* TECH Stock Trading */}
      {techStock && (
        <Card className="glass-panel-bright border-2 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Live TECH Trading
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                LIVE DATA
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">TECH Stock</label>
                <div className="p-2 border rounded-md bg-background/50">
                  <div className="font-semibold">{techStock.symbol} - {techStock.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Current: ₹{techStock.price.toFixed(2)} ({techStock.change >= 0 ? '+' : ''}{techStock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Shares to Trade</label>
                <Input
                  type="number"
                  min="1"
                  value={techSharesToTrade}
                  onChange={(e) => setTechSharesToTrade(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => onTechTrade?.('buy', techSharesToTrade)}
                disabled={!onTechTrade || (techSharesToTrade * techStock.price) > userMoney}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Buy {techSharesToTrade} shares
              </Button>
              <Button
                onClick={() => onTechTrade?.('sell', techSharesToTrade)}
                disabled={!onTechTrade || techSharesToTrade > techInvestments.shares}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Sell {techSharesToTrade} shares
              </Button>
            </div>
            
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-sm text-blue-400">
                Estimated Amount
              </div>
              <div className="text-lg font-bold text-blue-300">
                ₹{(techSharesToTrade * techStock.price).toFixed(2)}
              </div>
            </div>

            {/* Current TECH Holdings */}
            {techInvestments.shares > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
                <div className="text-sm font-medium mb-2">Current TECH Holdings</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Shares:</span>
                    <span className="font-semibold ml-2">{techInvestments.shares}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Price:</span>
                    <span className="font-semibold ml-2">₹{techInvestments.avgPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Value:</span>
                    <span className="font-semibold ml-2">₹{techValue.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">P&L:</span>
                    <span className={`font-semibold ml-2 ${techProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {techProfitLoss >= 0 ? '+' : ''}₹{techProfitLoss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Portfolio Holdings removed - only TECH investments are tracked */}
    </div>
  );
};
