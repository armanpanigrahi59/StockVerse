import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, DollarSign, Save } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentMoney: number;
  onSave: (name: string, money: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  currentName, 
  currentMoney, 
  onSave 
}) => {
  const [name, setName] = useState(currentName);
  const [money, setMoney] = useState(currentMoney);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setName(currentName);
    setMoney(currentMoney);
  }, [currentName, currentMoney, isOpen]);

  const handleSave = () => {
    if (name.trim() && money >= 0) {
      onSave(name.trim(), money);
      onClose();
    } else {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 2000);
    }
  };

  const handleMoneyChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMoney(numValue);
    } else if (value === '') {
      setMoney(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-border/50">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            👤 Customize Your Profile
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
        
        <div className="space-y-6 mt-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              Choose a cool name for the leaderboard! 🎮
            </p>
          </div>

          {/* Money Input */}
          <div className="space-y-2">
            <Label htmlFor="money" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Starting Money (₹)
            </Label>
            <Input
              id="money"
              type="number"
              placeholder="10000"
              value={money === 0 ? '' : money}
              onChange={(e) => handleMoneyChange(e.target.value)}
              className="w-full"
              min="0"
              max="100000"
            />
            <p className="text-xs text-muted-foreground">
              Set your virtual starting amount (₹0 - ₹100,000) 💰
            </p>
          </div>

          {/* Validation Error */}
          {!isValid && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-500 text-sm">
                ⚠️ Please enter a valid name and money amount!
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              💡 Pro Tips:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Your name will appear on the leaderboard</li>
              <li>• Starting money affects your initial ranking</li>
              <li>• You can always change these settings later</li>
              <li>• Play games to earn more virtual money!</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
