import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Wallet, TrendingUp, Target } from "lucide-react";

const spendingData = [
  { name: "Investments", value: 45, color: "hsl(var(--primary))" },
  { name: "Savings", value: 30, color: "hsl(var(--secondary))" },
  { name: "Expenses", value: 20, color: "hsl(var(--accent))" },
  { name: "Emergency", value: 5, color: "hsl(var(--muted))" }
];

export const BudgetTracker = () => {
  return (
    <div className="glass-panel-bright p-6">
      <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" />
        Smart Budget
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          {spendingData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Monthly Growth</span>
          </div>
          <p className="text-2xl font-bold">+12.5%</p>
        </div>
        
        <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">AI Recommendation</span>
          </div>
          <p className="text-sm">Save ₹1,500 more this month to reach your goal 🎯</p>
        </div>
      </div>
    </div>
  );
};
