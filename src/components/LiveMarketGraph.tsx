import React, { useEffect, useState } from "react";
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Cell, Line, LineChart } from "recharts";
import { marketDataService } from '../services/marketData';

interface DataPoint {
  time: string;
  price: number;
  volume?: number;
}

interface LiveMarketGraphProps {
  selectedStock?: string;
}

export const LiveMarketGraph: React.FC<LiveMarketGraphProps> = ({ selectedStock = 'TECH' }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get historical data for the selected stock
      const historicalData = await marketDataService.getAllStocksHistoricalData(7);
      const stockData = historicalData[selectedStock];

      if (stockData && stockData.length > 0) {
        // Convert historical data to chart format
        const chartData: DataPoint[] = stockData.map((point, index) => ({
          time: new Date(point.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          price: point.price,
          volume: Math.floor(Math.random() * 1000000) + 500000 // Mock volume data
        }));

        setData(chartData);

        // Calculate price change
        if (chartData.length >= 2) {
          const latest = chartData[chartData.length - 1].price;
          const previous = chartData[chartData.length - 2].price;
          const change = latest - previous;
          const changePercent = (change / previous) * 100;

          setCurrentPrice(latest);
          setPriceChange(change);
          setPriceChangePercent(changePercent);
        }
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load market data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();

    // Update data every 30 seconds
    const interval = setInterval(fetchHistoricalData, 30000);

    return () => clearInterval(interval);
  }, [selectedStock]);

  if (isLoading) {
    return (
      <div className="glass-panel-bright p-6">
        <h2 className="font-heading text-2xl font-bold mb-6">Live Market Data - {selectedStock}</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-muted-foreground">Loading market data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel-bright p-6">
        <h2 className="font-heading text-2xl font-bold mb-6">Live Market Data - {selectedStock}</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-bright p-6">
      <h2 className="font-heading text-2xl font-bold mb-6">Live Market Data - {selectedStock}</h2>
      
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Current Price</div>
          <div className="text-2xl font-bold gradient-text">
            ₹{currentPrice.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">7-Day Change</div>
          <div className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}₹{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="w-full h-[300px] bg-card/20 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-lg font-bold">
                        ₹{payload[0].value?.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Data points: {data.length}</div>
        <div>Last update: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

