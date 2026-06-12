import { useEffect, useState } from "react";

const newsItems = [
  "🚀 Tesla shares surge 8% after new EV policy announcement",
  "📱 Tech stocks rally as AI innovation drives market optimism",
  "💰 Banking sector sees massive growth in Q4 earnings",
  "⚡ Renewable energy stocks hit all-time high",
  "🏭 Manufacturing index shows strongest growth in 5 years",
  "💼 Indian startups raise record ₹10B in funding this quarter"
];

export const NewsTicker = () => {
  const [displayedNews, setDisplayedNews] = useState(newsItems);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedNews(prev => {
        const newArray = [...prev];
        const first = newArray.shift();
        if (first) newArray.push(first);
        return newArray;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="glass-panel overflow-hidden py-3 px-4">
      <div className="flex items-center gap-4">
        <span className="font-heading font-bold text-primary flex-shrink-0">
          BREAKING NEWS
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="animate-slide-left flex gap-8">
            {[...displayedNews, ...displayedNews].map((news, i) => (
              <span key={i} className="whitespace-nowrap text-sm">
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
