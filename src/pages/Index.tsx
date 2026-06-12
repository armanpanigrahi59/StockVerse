import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { NewsTicker } from "@/components/NewsTicker";
import { StockCard } from "@/components/StockCard";
import { StockChart } from "@/components/StockChart";
import { RandomGraph } from "@/components/RandomGraph";
import { FinancialLeaderboard } from "@/components/FinancialLeaderboard";
import { XPBar } from "@/components/XPBar";
import { FinancialGameModal } from "@/components/FinancialGameModal";
import { PortfolioManager } from "@/components/PortfolioManager";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { NewsFlashModal } from "@/components/NewsFlashModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { TechStockCard } from "@/components/TechStockCard";
import { LiveStockCard } from "@/components/LiveStockCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, TrendingUp, RefreshCw } from "lucide-react";
import { useTechStock } from "@/hooks/useTechStock";
import { useAllStocks } from "@/hooks/useAllStocks";
import heroBg from "@/assets/hero-bg.jpg";
import doremonBg from "@/assets/Doremon.jpg";
import pikachuBg from "@/assets/Pikachu.jpg";
import shinchanBg from "@/assets/Shinchan.jpg";

// All stocks will now be live data from Yahoo Finance

const themes = {
  default: {
    glass: 'bg-card/40 backdrop-blur-xl border border-border/50',
    button: 'glass-panel-bright hover:scale-105 transition-transform text-white',
    active: 'ring-2 ring-primary',
    text: 'text-foreground',
    heading: 'font-heading text-2xl font-bold',
    highlight: 'text-primary',
    border: 'border-border/50',
    hover: 'hover:bg-card/60 hover:shadow-lg',
    success: 'text-success',
    error: 'text-destructive',
    animation: 'animate-slide-up',
  },
  doremon: {
    glass: 'bg-blue-900/70 shadow-lg shadow-blue-500/20',
    button: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50',
    active: 'ring-2 ring-blue-400',
    text: 'text-blue-100 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]',
    heading: 'text-blue-200 font-bold drop-shadow-[0_0_5px_rgba(59,130,246,0.7)]',
    highlight: 'text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.7)]',
    border: 'border-blue-400/30 hover:border-blue-400/50',
    hover: 'hover:bg-blue-400/20 hover:shadow-lg hover:shadow-blue-500/30',
    success: 'text-cyan-400 drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]',
    error: 'text-red-400 drop-shadow-[0_0_2px_rgba(248,113,113,0.5)]',
    animation: 'animate-fade-in',
  },
  pikachu: {
    glass: 'bg-yellow-900/80 shadow-lg shadow-yellow-500/20',
    button: 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/50',
    active: 'ring-2 ring-yellow-400',
    text: 'text-yellow-100 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]',
    heading: 'text-yellow-200 font-bold drop-shadow-[0_0_5px_rgba(234,179,8,0.7)]',
    highlight: 'text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.7)]',
    border: 'border-yellow-400/30 hover:border-yellow-400/50',
    hover: 'hover:bg-yellow-400/20 hover:shadow-lg hover:shadow-yellow-500/30',
    success: 'text-green-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]',
    error: 'text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]',
    animation: 'animate-bounce-in',
  },
  shinchan: {
    glass: 'bg-red-900/80 shadow-lg shadow-red-500/20',
    button: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50',
    active: 'ring-2 ring-red-400',
    text: 'text-red-100 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]',
    heading: 'text-red-200 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.7)]',
    highlight: 'text-orange-400 drop-shadow-[0_0_3px_rgba(251,146,60,0.7)]',
    border: 'border-red-400/30 hover:border-red-400/50',
    hover: 'hover:bg-red-400/20 hover:shadow-lg hover:shadow-red-500/30',
    success: 'text-green-500 drop-shadow-[0_0_2px_rgba(34,197,94,0.5)]',
    error: 'text-purple-400 drop-shadow-[0_0_2px_rgba(192,132,252,0.5)]',
    animation: 'animate-slide-up'
  }
} as const;

type ThemeType = keyof typeof themes;

const Index = () => {
  const [showEvent, setShowEvent] = useState(false);
  const [showFinancialGame, setShowFinancialGame] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNewsFlash, setShowNewsFlash] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userName, setUserName] = useState("You");
  const [userMoney, setUserMoney] = useState(10000);
  const [currentBg, setCurrentBg] = useState(heroBg);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(userMoney);
  const [techInvestments, setTechInvestments] = useState({ shares: 0, avgPrice: 0 });
  
  // Live stock data for all stocks
  const { stocks: allStocks, loading: allStocksLoading, error: allStocksError, refreshData: refreshAllStocks } = useAllStocks();
  const { techStock, loading: techLoading, error: techError, refreshData: refreshTechData } = useTechStock();
  
  // Separate TECH stock from other stocks
  const techStockData = allStocks.find(stock => stock.symbol === 'TECH');
  const otherStocks = allStocks.filter(stock => stock.symbol !== 'TECH');
  
  // Calculate portfolio value including TECH investments
  useEffect(() => {
    if (techStockData && techInvestments.shares > 0) {
      const techValue = techInvestments.shares * techStockData.price;
      const techProfitLoss = techValue - (techInvestments.shares * techInvestments.avgPrice);
      const newPortfolioValue = userMoney + techProfitLoss;
      setPortfolioValue(newPortfolioValue);
    } else {
      setPortfolioValue(userMoney);
    }
  }, [techStockData, techInvestments, userMoney]);

  // Handle TECH stock trading
  const handleTechTrade = (action: 'buy' | 'sell', shares: number) => {
    if (!techStockData) return;

    const currentPrice = techStockData.price;
    const totalCost = shares * currentPrice;

    if (action === 'buy') {
      if (totalCost > userMoney) {
        alert('Insufficient funds!');
        return;
      }

      const newShares = techInvestments.shares + shares;
      const newAvgPrice = techInvestments.shares > 0 
        ? ((techInvestments.shares * techInvestments.avgPrice) + totalCost) / newShares
        : currentPrice;

      setTechInvestments({
        shares: newShares,
        avgPrice: newAvgPrice
      });

      setUserMoney(prev => prev - totalCost);
    } else {
      if (shares > techInvestments.shares) {
        alert('Insufficient shares!');
        return;
      }

      setTechInvestments(prev => ({
        shares: prev.shares - shares,
        avgPrice: prev.avgPrice // Keep average price unchanged
      }));

      setUserMoney(prev => prev + totalCost);
    }
  };
  // Stock data is now live and updates automatically via the useAllStocks hook
  
  const handleThemeChange = (theme: ThemeType, bg: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBg(bg);
      setCurrentTheme(theme);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 300);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEvent(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div 
        className={`fixed inset-0 transition-all duration-700 ${
          isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
        }`}
        style={{
          backgroundImage: `url(${currentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }}
      />
      
      {/* Content Layer */}
      <div className={`min-h-screen ${themes[currentTheme].text} `}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6" data-tour="welcome">
          {/* Header */}
          <div className={`${themes[currentTheme].glass} backdrop-blur-md p-2 sm:p-4 rounded-xl mb-3 sm:mb-6 
            ${themes[currentTheme].border} border transition-all duration-500 
            hover:shadow-2xl ${themes[currentTheme].animation}`} data-tour="header">
            <Header 
              onArcadeClick={() => setShowFinancialGame(true)} 
              onLeaderboardClick={() => setShowLeaderboard(true)}
              onNotificationClick={() => setShowNewsFlash(true)}
              onProfileClick={() => setShowUserProfile(true)}
            />
          </div>
          
          {/* Theme Buttons */}
          <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-6 flex-wrap" data-tour="themes">
            <Button 
              onClick={() => handleThemeChange('default', heroBg)}
              className={`${themes.default.button} ${currentTheme === 'default' ? themes.default.active : ''} 
                transform transition-all duration-300 hover:scale-105 relative overflow-hidden text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
            >
              <span className="">Default</span>
            </Button>
            <Button 
              onClick={() => handleThemeChange('doremon', doremonBg)}
              className={`${themes.doremon.button} ${currentTheme === 'doremon' ? themes.doremon.active : ''} 
                transform transition-all duration-300 hover:scale-105 relative overflow-hidden text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
            >
              <span className="">Doremon</span>
            </Button>
            <Button 
              onClick={() => handleThemeChange('pikachu', pikachuBg)}
              className={`${themes.pikachu.button} ${currentTheme === 'pikachu' ? themes.pikachu.active : ''} 
                transform transition-all duration-300 hover:scale-105 relative overflow-hidden text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
            >
              <span className="">Pikachu</span>
            </Button>
            <Button 
              onClick={() => handleThemeChange('shinchan', shinchanBg)}
              className={`${themes.shinchan.button} ${currentTheme === 'shinchan' ? themes.shinchan.active : ''} 
                transform transition-all duration-300 hover:scale-105 relative overflow-hidden text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
            >
              <span className="">Shinchan</span>
            </Button>
          </div>
          
          {/* XP Bar and Portfolio Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
            <div className={`${themes[currentTheme].glass} backdrop-blur-md p-3 sm:p-4 rounded-xl transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`}>
              <h3 className={`${themes[currentTheme].heading} text-lg sm:text-2xl mb-2 animate-pulse`}>Experience Level</h3>
              <XPBar level={7} currentXP={850} maxXP={1000} />
            </div>
            <div className={`${themes[currentTheme].glass} backdrop-blur-md p-3 sm:p-4 rounded-xl transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`} data-tour="portfolio">
              <h3 className={`${themes[currentTheme].heading} text-lg sm:text-2xl mb-2 animate-pulse`}>Portfolio Value</h3>
              <div className="text-2xl sm:text-3xl font-bold text-center">
                ₹{portfolioValue.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground text-center mt-1">
                Total Investment Value
              </div>
            </div>
          </div>
          
          {/* News Ticker */}
          <div className="mb-3 sm:mb-6" data-tour="news">
            <div className={`${themes[currentTheme].glass} backdrop-blur-md rounded-xl overflow-hidden transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`}>
              <div className={`p-2 sm:p-3 text-sm sm:text-base ${themes[currentTheme].highlight} font-semibold bg-gradient-to-r from-transparent 
                via-current to-transparent animate-pulse`}>Market News</div>
              <NewsTicker />
            </div>
          </div>
          
          {/* Charts and Portfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
            <div className={`lg:col-span-2 ${themes[currentTheme].glass} backdrop-blur-md rounded-xl p-3 sm:p-6 transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`} data-tour="charts">
              <RandomGraph />
            </div>
            <div className={`${themes[currentTheme].glass} backdrop-blur-md rounded-xl p-3 sm:p-6 transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`}>
              <h3 className={`${themes[currentTheme].heading} text-lg sm:text-2xl mb-4 animate-pulse`}>Portfolio Manager</h3>
              <PortfolioManager 
                onPortfolioUpdate={setPortfolioValue}
                techStock={techStockData}
                techInvestments={techInvestments}
                onTechTrade={handleTechTrade}
                userMoney={userMoney}
              />
            </div>
          </div>
          
          {/* Stock Cards */}
          <div className="mb-3 sm:mb-6" data-tour="stocks">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className={`${themes[currentTheme].heading} text-xl sm:text-2xl animate-pulse`}>Live Market Data</h2>
            </div>
            
            {allStocksLoading && allStocks.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin mx-auto mb-4">
                  <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <p className={`${themes[currentTheme].text} text-sm sm:text-base`}>Loading live market data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {allStocks.map((stock, index) => (
                  <LiveStockCard
                    key={stock.symbol}
                    stock={stock}
                    theme={themes[currentTheme]}
                    isConnected={!allStocksError}
                    onRefresh={undefined}
                    loading={false}
                  />
                ))}
              </div>
            )}
            
            {allStocksError && (
              <div className="text-center py-4">
                <p className="text-red-500 text-xs sm:text-sm">Failed to load some market data. Using cached data.</p>
              </div>
            )}
          </div>
          
          {/* Additional Market Analysis */}
          <div className="mb-3 sm:mb-6">
            <div className={`${themes[currentTheme].glass} backdrop-blur-md rounded-xl transition-all duration-500 
              ${themes[currentTheme].border} border transform hover:scale-[1.02] ${themes[currentTheme].animation}`}>
              <RandomGraph />
            </div>
          </div>
        </div>
        
        {/* Modals */}
        <FinancialGameModal isOpen={showFinancialGame} onClose={() => setShowFinancialGame(false)} />
        <LeaderboardModal 
          isOpen={showLeaderboard} 
          onClose={() => setShowLeaderboard(false)} 
          portfolioValue={portfolioValue}
          userName={userName}
        />
        <NewsFlashModal 
          isOpen={showNewsFlash} 
          onClose={() => setShowNewsFlash(false)} 
        />
        <UserProfileModal 
          isOpen={showUserProfile} 
          onClose={() => setShowUserProfile(false)}
          currentName={userName}
          currentMoney={userMoney}
          onSave={(name, money) => {
            setUserName(name);
            setUserMoney(money);
            setPortfolioValue(money);
          }}
        />
        
        {/* Finish Tour Target */}
        <div data-tour="finish" className="hidden"></div>
      </div>
    </div>
  );
};

export default Index;
