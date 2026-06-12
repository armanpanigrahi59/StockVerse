import { Star, Zap } from "lucide-react";

interface XPBarProps {
  level: number;
  currentXP: number;
  maxXP: number;
}

export const XPBar = ({ level, currentXP, maxXP }: XPBarProps) => {
  const percentage = (currentXP / maxXP) * 100;
  
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary">
            <Star className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold">Level {level}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          {currentXP} / {maxXP} XP
        </div>
      </div>
      
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full neon-glow-green"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage >= 90 && (
        <div className="mt-2 text-xs text-primary font-semibold animate-pulse">
          🎉 Almost there! Level up coming soon!
        </div>
      )}
    </div>
  );
};
