import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  range: number;
  ohlcDiff: number;
}

export const StockChart = () => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform backend {time, value} into OHLC with realistic small fluctuations
  const transformData = (prev: CandlestickData[], newPoint: { time: string; value: number }): CandlestickData => {
    const lastClose = prev.length > 0 ? prev[prev.length - 1].close : newPoint.value;
    const open = lastClose;
    const close = newPoint.value;
    const high = Math.max(open, close) + Math.random() * 2; // small fluctuation
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(Math.random() * 500 + 50);
    const range = high - low;
    const ohlcDiff = Math.abs(close - open);

    return { time: newPoint.time, open, high, low, close, volume, range, ohlcDiff };
  };

  const fetchNextData = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/stock-data`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const responseData = await response.json();
      const points = responseData.data || responseData;

      if (!points || !points.length) throw new Error("No data received");

      setData((prev) => {
        const latestPoint = points[points.length - 1];
        const pointData = {
          time: latestPoint.date || latestPoint.time,
          value: latestPoint.close || latestPoint.value || latestPoint.open
        };
        const newOhlc = transformData(prev, pointData);
        const newData = [...prev, newOhlc];
        return newData.length > 50 ? newData.slice(-50) : newData;
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextData(); // first fetch
    const interval = setInterval(fetchNextData, 3000); // fetch every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel-bright p-6">
      <h2 className="font-heading text-2xl font-bold mb-6">Market Overview</h2>

      {isLoading && (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading market data...
        </div>
      )}

      {error && (
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error: {error}
        </div>
      )}

      {!isLoading && !error && (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="time" stroke="#ccc" style={{ fontSize: "12px" }} />
            <YAxis stroke="#ccc" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #444",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
              formatter={(value: number) => `₹${value.toFixed(2)}`}
            />
            <Bar dataKey="range" fill="#8884d8" opacity={0.3} name="Range" />
            <Bar dataKey="ohlcDiff" fill="#10b981" name="OHLC Diff" />
            <Line type="monotone" dataKey="close" stroke="#4ade80" strokeWidth={2} dot={false} name="Close Price" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
