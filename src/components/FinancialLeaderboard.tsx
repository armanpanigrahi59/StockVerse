import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

const fakeNames = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Isha", "Vihaan", "Anaya", "Arjun", "Sara"];

interface Player {
  name: string;
  cash: number;
  happiness: number;
  literacy: number;
  health: number;
  debt: number;
}

interface FinancialLeaderboardProps {
  player: Player;
}

function formatCurrencyINR(value: number) {
  try {
    return new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      maximumFractionDigits: 0 
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
  return null;
};

export function FinancialLeaderboard({ player }: FinancialLeaderboardProps) {
  const bots = useMemo(() => {
    const chosen = [...fakeNames].sort(() => Math.random() - 0.5).slice(0, 4);
    return chosen.map((name, i) => ({
      id: `bot-${i}`,
      name,
      cash: Math.floor(Math.random() * 5000) // ₹0 - ₹4999
    }));
  }, []);

  type LeaderboardEntry = {
    id: string;
    name: string;
    cash: number;
    isYou?: boolean;
  };

  const entries = useMemo((): LeaderboardEntry[] => {
    const all: LeaderboardEntry[] = [
      ...bots,
      { id: "you", name: "You", cash: Math.max(0, player?.cash ?? 0), isYou: true },
    ];
    return all.sort((a, b) => b.cash - a.cash);
  }, [bots, player?.cash]);

  return (
    <Card className="glass-panel-bright">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Financial Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className={`p-3 rounded-xl transition-all duration-300 ${
                entry.isYou 
                  ? 'bg-primary/20 border border-primary/30' 
                  : idx === 0 
                    ? 'glass-panel border-yellow-500/30' 
                    : 'bg-muted/20'
              } hover:scale-105`}
              style={{
                animationDelay: `${idx * 100}ms`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 min-w-[40px]">
                  {getRankIcon(idx + 1) || (
                    <span className="text-muted-foreground font-bold text-sm">#{idx + 1}</span>
                  )}
                </div>
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xs">
                  {entry.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrencyINR(entry.cash)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
