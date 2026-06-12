import { useState, useEffect, useCallback } from 'react';
import { marketDataService } from '../services/marketData';

interface StockData {
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

interface UseAllStocksReturn {
  stocks: StockData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  historicalData: { [symbol: string]: { date: string; price: number }[] };
}

export const useAllStocks = (): UseAllStocksReturn => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<{ [symbol: string]: { date: string; price: number }[] }>({});

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current stock data and historical data in parallel
      const [currentData, historical] = await Promise.all([
        marketDataService.fetchAllStocksData(),
        marketDataService.getAllStocksHistoricalData(7)
      ]);

      setStocks(currentData);
      setHistoricalData(historical);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();

    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchAllData, 5000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  return {
    stocks,
    loading,
    error,
    refreshData,
    historicalData
  };
};
