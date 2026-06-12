import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface NewsFlashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const breakingNews = [
  {
    id: 1,
    title: "🚀 Tesla shares surge 8% after new EV policy announcement",
    type: "bullish",
    impact: "High",
    time: "2 minutes ago"
  },
  {
    id: 2,
    title: "📱 Tech stocks rally as AI innovation drives market optimism",
    type: "bullish",
    impact: "Medium",
    time: "5 minutes ago"
  },
  {
    id: 3,
    title: "💰 Banking sector sees massive growth in Q4 earnings",
    type: "bullish",
    impact: "High",
    time: "8 minutes ago"
  },
  {
    id: 4,
    title: "⚡ Renewable energy stocks hit all-time high",
    type: "bullish",
    impact: "High",
    time: "12 minutes ago"
  },
  {
    id: 5,
    title: "🏭 Manufacturing index shows strongest growth in 5 years",
    type: "bullish",
    impact: "Medium",
    time: "15 minutes ago"
  },
  {
    id: 6,
    title: "💼 Indian startups raise record ₹10B in funding this quarter",
    type: "bullish",
    impact: "High",
    time: "18 minutes ago"
  }
];

export const NewsFlashModal: React.FC<NewsFlashModalProps> = ({ isOpen, onClose }) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentNewsIndex(prev => (prev + 1) % breakingNews.length);
          setIsAnimating(false);
        }, 300);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const currentNews = breakingNews[currentNewsIndex];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-xl border border-red-500/50">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-0 right-0 h-6 w-6 hover:bg-red-500/20 z-10"
          >
            <X className="h-4 w-4 text-white" />
          </Button>

          {/* Breaking News Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">📰</span>
              <h2 className="text-xl font-bold text-white animate-pulse">
                BREAKING NEWS
              </h2>
              <span className="text-2xl">📰</span>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
          </div>

          {/* News Content */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-start gap-3">
                {currentNews.type === "bullish" ? (
                  <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                
                <div className="flex-1">
                  <p className="text-white font-medium text-sm leading-relaxed">
                    {currentNews.title}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70">Impact:</span>
                      <span className={`text-xs font-semibold ${getImpactColor(currentNews.impact)}`}>
                        {currentNews.impact}
                      </span>
                    </div>
                    
                    <span className="text-xs text-white/70">
                      {currentNews.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-4 gap-1">
            {breakingNews.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  index === currentNewsIndex 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentNewsIndex(prev => prev > 0 ? prev - 1 : breakingNews.length - 1);
                  setIsAnimating(false);
                }, 300);
              }}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              size="sm"
            >
              ← Previous
            </Button>
            <Button
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentNewsIndex(prev => (prev + 1) % breakingNews.length);
                  setIsAnimating(false);
                }, 300);
              }}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              size="sm"
            >
              Next →
            </Button>
          </div>

          <div className="text-center mt-3">
            <p className="text-xs text-white/70">
              Stay updated with the latest market news! 📈
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
