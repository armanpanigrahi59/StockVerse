import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Player {
  name: string;
  cash: number;
  happiness: number;
  literacy: number;
  health: number;
  debt: number;
}

interface FinancialDashboardProps {
  player: Player;
}

const capped = (value: number, max: number = 100) => Math.max(0, Math.min(max, value ?? 0));

export function FinancialDashboard({ player }: FinancialDashboardProps) {
  return (
    <Card className="glass-panel-bright">
      <CardHeader>
        <CardTitle className="text-xl">Financial Literacy Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">💳 Debt</span>
              <span className="font-semibold">₹{Math.max(0, player.debt || 0)}</span>
            </div>
            <Progress 
              value={Math.min(100, Math.round(((Math.abs(player.debt || 0)) / 1000000) * 100))} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">💰 Cash</span>
              <span className="font-semibold">₹{player.cash}</span>
            </div>
            <Progress 
              value={Math.min(100, Math.round((player.cash / 1000) * 100))} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">😀 Happiness</span>
              <span className="font-semibold">{capped(player.happiness)}%</span>
            </div>
            <Progress value={capped(player.happiness)} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">📘 Literacy</span>
              <span className="font-semibold">{capped(player.literacy)}%</span>
            </div>
            <Progress value={capped(player.literacy)} className="h-2" />
          </div>

          <div className="space-y-2 col-span-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">❤️ Health</span>
              <span className="font-semibold">{capped(player.health)}%</span>
            </div>
            <Progress value={capped(player.health)} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
