import { Trophy, Medal, Award } from "lucide-react";

const players = [
  { rank: 1, name: "Arjun Sharma", profit: 47.8, avatar: "AS" },
  { rank: 2, name: "Priya Patel", profit: 42.3, avatar: "PP" },
  { rank: 3, name: "Rohan Kumar", profit: 38.5, avatar: "RK" },
  { rank: 4, name: "Sneha Reddy", profit: 35.2, avatar: "SR" },
  { rank: 5, name: "Vikram Singh", profit: 31.7, avatar: "VS" }
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
  return null;
};

export const Leaderboard = () => {
  return (
    <div className="glass-panel-bright p-6">
      <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-primary" />
        Top Investors
      </h2>
      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.rank}
            className={`p-4 rounded-xl transition-all duration-300 ${
              player.rank <= 3 ? 'glass-panel' : 'bg-muted/20'
            } hover:scale-105`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[60px]">
                {getRankIcon(player.rank) || (
                  <span className="text-muted-foreground font-bold">#{player.rank}</span>
                )}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold">
                {player.avatar}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold">{player.name}</div>
                <div className="text-xs text-muted-foreground">Level {player.rank + 4}</div>
              </div>
              
              <div className="text-right">
                <div className="text-success font-bold text-lg">
                  +{player.profit}%
                </div>
                <div className="text-xs text-muted-foreground">Profit</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
