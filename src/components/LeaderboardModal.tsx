import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FinancialLeaderboard } from './FinancialLeaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioValue?: number;
  userName?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ 
  isOpen, 
  onClose, 
  portfolioValue = 10000, 
  userName = "You" 
}) => {
  // Player data using actual portfolio value and custom name
  const mockPlayer = {
    name: userName,
    cash: portfolioValue, // Use actual portfolio value
    happiness: 80,
    literacy: 75,
    health: 90,
    debt: 0
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-border/50">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            🏆 Financial Leaderboard
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-4">
          <FinancialLeaderboard player={mockPlayer} />
          
          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
            <h3 className="font-semibold text-sm mb-2">💡 How to climb the leaderboard:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Make smart investment decisions</li>
              <li>• Play games in the Arcade to earn extra money</li>
              <li>• Learn about different companies and their stocks</li>
              <li>• Take advantage of market opportunities</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
