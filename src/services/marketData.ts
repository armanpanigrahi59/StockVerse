// Market Data Service for TECH stock
// Using a free API that provides real-time stock data

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

// Real stocks from different sectors for diverse portfolio
const REAL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', displaySymbol: 'TECH', displayName: 'Tech Leaders' },
  { symbol: 'TSLA', name: 'Tesla Inc.', displaySymbol: 'GREEN', displayName: 'Green Energy' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', displaySymbol: 'BANK', displayName: 'Banking Giant' },
  { symbol: 'F', name: 'Ford Motor Company', displaySymbol: 'AUTO', displayName: 'Auto Industry' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', displaySymbol: 'PHARMA', displayName: 'Healthcare' },
  { symbol: 'WMT', name: 'Walmart Inc.', displaySymbol: 'RETAIL', displayName: 'Retail Power' }
];

// API endpoint through our proxy server
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class MarketDataService {
  private static instance: MarketDataService;
  private cache: Map<string, { data: StockData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache
  private readonly FETCH_TIMEOUT_MS = 30000; // 30 seconds timeout (Render cold start)

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT_MS);
    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  async fetchAllStocksData(): Promise<StockData[]> {
    try {
      const stockPromises = REAL_STOCKS.map(async (stockInfo) => {
        // Check cache first
        const cached = this.cache.get(stockInfo.symbol);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.data;
        }

        try {
          // Fetch from Yahoo Finance free API (fast-timeout; fallback on CORS/slow)
          const response = await this.fetchWithTimeout(`${API_BASE}/proxy/yahoo/${stockInfo.symbol}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const result = data.chart.result[0];
          
          if (!result || !result.meta) {
            throw new Error('Invalid API response');
          }

          const meta = result.meta;
          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.previousClose;
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          const stockData: StockData = {
            symbol: stockInfo.displaySymbol,
            name: stockInfo.displayName,
            price: Math.round(currentPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            volume: meta.regularMarketVolume,
            high: meta.regularMarketDayHigh,
            low: meta.regularMarketDayLow,
            open: meta.regularMarketOpen
          };

          // Cache the result
          this.cache.set(stockInfo.symbol, {
            data: stockData,
            timestamp: Date.now()
          });

          return stockData;
        } catch (error) {
          console.warn(`Failed to fetch data for ${stockInfo.symbol}, using fallback:`, error);
          return this.getFallbackStockData(stockInfo.displaySymbol, stockInfo.displayName);
        }
      });

      const results = await Promise.all(stockPromises);
      return results.filter(stock => stock !== null);
    } catch (error) {
      console.warn('Failed to fetch all stocks data, using fallback:', error);
      return this.getFallbackAllStocksData();
    }
  }

  async fetchTechStockData(): Promise<StockData[]> {
    const allStocks = await this.fetchAllStocksData();
    return allStocks.filter(stock => stock.symbol === 'TECH');
  }

  private getFallbackStockData(symbol: string, name: string): StockData {
    // Fallback data that simulates real market movements
    const basePrices: { [key: string]: number } = {
      'TECH': 180,
      'GREEN': 220,
      'BANK': 160,
      'AUTO': 12,
      'PHARMA': 170,
      'RETAIL': 160
    };
    
    const basePrice = basePrices[symbol] || 150;
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.max(5, basePrice + change); // Minimum price of 5
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      name,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      high: newPrice + Math.random() * 5,
      low: newPrice - Math.random() * 5,
      open: basePrice
    };
  }

  private getFallbackAllStocksData(): StockData[] {
    return REAL_STOCKS.map(stockInfo => 
      this.getFallbackStockData(stockInfo.displaySymbol, stockInfo.displayName)
    );
  }

  // Get historical data for charts (simplified)
  async getAllStocksHistoricalData(days: number = 7): Promise<{ [symbol: string]: { date: string; price: number }[] }> {
    try {
      const historicalPromises = REAL_STOCKS.map(async (stockInfo) => {
        try {
          const response = await this.fetchWithTimeout(`${API_BASE}/proxy/yahoo/${stockInfo.symbol}?range=${days}d`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const result = data.chart.result[0];
          
          if (!result || !result.timestamp || !result.indicators) {
            throw new Error('Invalid historical data response');
          }

          const timestamps = result.timestamp;
          const prices = result.indicators.quote[0].close;

          const historicalData = timestamps.map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toISOString().split('T')[0],
            price: prices[index] || 0
          })).filter(item => item.price > 0);

          return {
            symbol: stockInfo.displaySymbol,
            data: historicalData
          };
        } catch (error) {
          console.warn(`Failed to fetch historical data for ${stockInfo.symbol}:`, error);
          return {
            symbol: stockInfo.displaySymbol,
            data: this.getFallbackHistoricalData(days)
          };
        }
      });

      const results = await Promise.all(historicalPromises);
      const historicalMap: { [symbol: string]: { date: string; price: number }[] } = {};
      
      results.forEach(result => {
        historicalMap[result.symbol] = result.data;
      });

      return historicalMap;
    } catch (error) {
      console.warn('Failed to fetch historical data, using fallback:', error);
      const fallbackData = this.getFallbackHistoricalData(days);
      const fallbackMap: { [symbol: string]: { date: string; price: number }[] } = {};
      
      REAL_STOCKS.forEach(stockInfo => {
        fallbackMap[stockInfo.displaySymbol] = fallbackData;
      });

      return fallbackMap;
    }
  }

  async getTechHistoricalData(days: number = 7): Promise<{ date: string; price: number }[]> {
    const allHistorical = await this.getAllStocksHistoricalData(days);
    return allHistorical['TECH'] || this.getFallbackHistoricalData(days);
  }

  private getFallbackHistoricalData(days: number): { date: string; price: number }[] {
    const data = [];
    const basePrice = 180;
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate realistic price movement
      const change = (Math.random() - 0.5) * 0.05 * currentPrice; // 5% daily volatility
      currentPrice = Math.max(50, currentPrice + change);

      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice * 100) / 100
      });
    }

    return data;
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }
}

export const marketDataService = MarketDataService.getInstance();
