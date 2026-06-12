import { Bell, Settings, Trophy, GraduationCap, TrendingUp, User } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onArcadeClick: () => void;
  onLeaderboardClick: () => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

export const Header = ({ onArcadeClick, onLeaderboardClick, onNotificationClick, onProfileClick }: HeaderProps) => {
  return (
    <header className="glass-panel p-2 sm:p-4 mb-3 sm:mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-3xl font-bold gradient-text">
            StockVerse
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Play. Learn. Invest.</p>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-4">
          <Button 
            onClick={onArcadeClick}
            className="glass-panel-bright hover:scale-105 transition-transform text-white flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            data-tour="arcade"
          >
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Arcade</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 sm:h-10 sm:w-10" 
            data-tour="notifications"
            onClick={onNotificationClick}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 sm:h-10 sm:w-10"
            data-tour="trophy" 
            onClick={onLeaderboardClick}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 sm:h-10 sm:w-10"
            data-tour="settings"
            onClick={onProfileClick}
            title="Customize Profile"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
