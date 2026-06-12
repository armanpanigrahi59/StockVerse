import { useState, useEffect, useCallback } from 'react';
import { marketDataService } from '../services/marketData';

interface TechStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
}

interface UseTechStockReturn {
  techStock: TechStock | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  historicalData: { date: string; price: number }[];
}

export const useTechStock = (): UseTechStockReturn => {
  const [techStock, setTechStock] = useState<TechStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<{ date: string; price: number }[]>([]);

  const fetchTechData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current stock data and historical data in parallel
      const [currentData, historical] = await Promise.all([
        marketDataService.fetchTechStockData(),
        marketDataService.getTechHistoricalData(7)
      ]);

      if (currentData.length > 0) {
        setTechStock(currentData[0]);
      }
      
      setHistoricalData(historical);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tech stock data');
      console.error('Error fetching tech stock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchTechData();
  }, [fetchTechData]);

  useEffect(() => {
    fetchTechData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchTechData, 30000);

    return () => clearInterval(interval);
  }, [fetchTechData]);

  return {
    techStock,
    loading,
    error,
    refreshData,
    historicalData
  };
};

