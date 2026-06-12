import { X, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventPopup = ({ isOpen, onClose }: EventPopupProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-bright max-w-md w-full p-6 animate-slide-up relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-primary/20 neon-glow-green">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold mb-2">
              Market Event Alert! 🎯
            </h3>
            <p className="text-sm text-muted-foreground">
              Tech Sector Update
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="mb-3">
            Government announces new EV subsidy policy. Electric vehicle manufacturers expected to benefit significantly.
          </p>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-semibold text-primary">
              💡 AI Prediction: Tech stocks likely to rise by 5-8% over the next 24 hours
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1 bg-success hover:bg-success/90">
            Invest Now
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Watch
          </Button>
        </div>
      </div>
    </div>
  );
};
