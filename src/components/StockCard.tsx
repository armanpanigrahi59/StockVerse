import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const StockCard = ({ symbol, name, price, change, changePercent }: StockCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="glass-panel p-6 hover:scale-105 transition-transform duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-heading text-xl font-bold">{symbol}</h3>
          <p className="text-muted-foreground text-sm">{name}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="text-success w-6 h-6" />
        ) : (
          <TrendingDown className="text-destructive w-6 h-6" />
        )}
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold font-heading">₹{price.toFixed(2)}</div>
        <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
          <span className="font-semibold">
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </span>
          <span className="text-sm">
            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold">
          Buy
        </Button>
        <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold">
          Sell
        </Button>
      </div>
    </div>
  );
};
