import { useEffect, useState } from "react";
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Cell, Line, LineChart } from "recharts";

interface DataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Custom Candlestick Component using SVG
const CandlestickChart = ({ data }: { data: DataPoint[] }) => {
  const maxValue = Math.max(...data.map(d => d.high));
  const minValue = Math.min(...data.map(d => d.low));
  const range = maxValue - minValue;
  const chartHeight = 250;
  const chartWidth = 800;
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length;

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };

  return (
    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
      {/* Grid lines and Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const value = minValue + (range * (1 - ratio));
        return (
          <g key={i}>
            <line
              x1={0}
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="hsl(var(--chart-grid))"
              strokeDasharray="2 2"
              opacity={0.3}
            />
            <text
              x={5}
              y={chartHeight * ratio + 4}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              ₹{value.toFixed(0)}
            </text>
          </g>
        );
      })}
      
      {data.map((item, index) => {
        const x = index * barSpacing + (barSpacing - barWidth) / 2;
        const isGreen = item.close >= item.open;
        const bodyHeight = Math.abs(item.close - item.open);
        const bodyY = getY(Math.max(item.open, item.close));
        const wickTop = getY(item.high);
        const wickBottom = getY(item.low);
        const openY = getY(item.open);
        const closeY = getY(item.close);

        return (
          <g key={index}>
            {/* High-Low line (wick) */}
            <line
              x1={x + barWidth / 2}
              y1={wickTop}
              x2={x + barWidth / 2}
              y2={wickBottom}
              stroke={isGreen ? "#10b981" : "#ef4444"}
              strokeWidth={1}
            />
            {/* Open tick */}
            <line
              x1={x}
              y1={openY}
              x2={x + barWidth / 2}
              y2={openY}
              stroke={isGreen ? "#10b981" : "#ef4444"}
              strokeWidth={1}
            />
            {/* Close tick */}
            <line
              x1={x + barWidth / 2}
              y1={closeY}
              x2={x + barWidth}
              y2={closeY}
              stroke={isGreen ? "#10b981" : "#ef4444"}
              strokeWidth={1}
            />
            {/* Body */}
            <rect
              x={x + barWidth * 0.1}
              y={bodyY}
              width={barWidth * 0.8}
              height={bodyHeight}
              fill={isGreen ? "#10b981" : "#ef4444"}
              fillOpacity={0.8}
            />
          </g>
        );
      })}
      
      {/* X-axis labels */}
      {data.filter((_, index) => index % Math.ceil(data.length / 6) === 0).map((item, index) => {
        const originalIndex = data.findIndex(d => d === item);
        const x = originalIndex * barSpacing + barSpacing / 2;
        return (
          <text
            key={index}
            x={x}
            y={chartHeight - 5}
            fontSize="10"
            fill="hsl(var(--muted-foreground))"
            textAnchor="middle"
          >
            {item.time}
          </text>
        );
      })}
    </svg>
  );
};

// Generate realistic fallback candlestick data locally
const generateFallbackData = (count: number = 50): DataPoint[] => {
  const data: DataPoint[] = [];
  let basePrice = 180;
  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-min intervals
    const volatility = 0.015;
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const open = Math.max(10, basePrice);
    const close = Math.max(10, open + change);
    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;
    basePrice = close;

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(Math.max(1, low) * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 900000) + 100000,
    });
  }
  return data;
};

export const RandomGraph = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch real data from backend
  const fetchStockData = async (): Promise<DataPoint[]> => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE}/api/stock-data?limit=50`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvData = await response.json();
    
    // Extract data array from response
    const dataArray = csvData.data || csvData;
    
    // Convert CSV data to our format
    const formattedData: DataPoint[] = dataArray.map((item: any) => ({
      time: new Date(item.date || item.time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseInt(item.volume)
    }));
    
    console.log('Fetched data:', formattedData.length, 'points');
    return formattedData;
  };

  useEffect(() => {
    let isMounted = true;

    // Fetch initial data — fall back to local generator if backend unreachable
    const loadInitialData = async () => {
      try {
        const initialData = await fetchStockData();
        if (isMounted) {
          setData(initialData);
          setUsingFallback(false);
          setError(null);
        }
      } catch (err) {
        console.warn('Backend unavailable, using generated data:', err);
        if (isMounted) {
          setData(generateFallbackData(50));
          setUsingFallback(true);
          setError(null); // No error shown — chart works with fallback
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    // Update data every 5 seconds
    const interval = setInterval(async () => {
      if (!isMounted) return;
      
      try {
        const newData = await fetchStockData();
        if (isMounted) {
          setData(prev => {
            const combined = [...prev, ...newData];
            return combined.slice(-50);
          });
          setUsingFallback(false);
          // Clear any previous error since we now have live data
          setError(null);
        }
      } catch (err) {
        // Silently keep existing data — do NOT set error or wipe the chart
        console.warn('Periodic fetch failed, keeping existing chart data:', err);
        if (isMounted && usingFallback) {
          // Keep animating with generated data so chart stays alive
          setData(prev => {
            if (prev.length === 0) return generateFallbackData(50);
            const last = prev[prev.length - 1];
            const basePrice = last.close;
            const change = (Math.random() - 0.5) * 0.015 * basePrice;
            const open = Math.max(10, basePrice);
            const close = Math.max(10, open + change);
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;
            const newPoint: DataPoint = {
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              open: Math.round(open * 100) / 100,
              high: Math.round(high * 100) / 100,
              low: Math.round(Math.max(1, low) * 100) / 100,
              close: Math.round(close * 100) / 100,
              volume: Math.floor(Math.random() * 900000) + 100000,
            };
            return [...prev.slice(-49), newPoint];
          });
        }
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel-bright p-6">
        <h2 className="font-heading text-2xl font-bold mb-6">Live Market Data</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-muted-foreground">Loading market data...</div>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="glass-panel-bright p-6">
        <h2 className="font-heading text-2xl font-bold mb-6">Live Market Data</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-bright p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold">Live Market Data</h2>
        {usingFallback && (
          <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
            ⚡ Simulated Data
          </span>
        )}
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Current Price</div>
          <div className="text-2xl font-bold gradient-text">
            ₹{data[data.length - 1]?.close?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Volume</div>
          <div className="text-lg font-semibold">
            {data[data.length - 1]?.volume?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      <div className="w-full h-[300px] bg-card/20 rounded-lg p-4">
        <CandlestickChart data={data} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>Data points: {data.length}</div>
        <div>Last update: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};
