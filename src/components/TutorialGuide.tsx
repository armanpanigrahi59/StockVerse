import React, { useState, useEffect, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride';
import { Button } from '@/components/ui/button';
import { Rocket, Star, Gamepad2, TrendingUp, User, Bell, Trophy } from 'lucide-react';

interface TutorialGuideProps {
  onTutorialComplete?: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onTutorialComplete }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Check if tutorial has been completed before
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      // Start tutorial after a short delay to let the page load
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('tutorialCompleted', 'true');
      onTutorialComplete?.();
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(data.index + (data.action === 'prev' ? -1 : 1));
    }
  }, [onTutorialComplete]);

  const handleSkipTutorial = () => {
    setRun(false);
    localStorage.setItem('tutorialCompleted', 'true');
    onTutorialComplete?.();
  };

  const steps: Step[] = [
    {
      target: '[data-tour="welcome"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <Rocket className="w-8 h-8 text-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-bold mb-2">🚀 Welcome to StockVerse!</h3>
          <p className="text-sm">
            Hey there, future investor! 🌟 Get ready to learn about stocks and money in the most fun way possible! 
            Let's take a quick tour to show you all the amazing features.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: true,
    },
    {
      target: '[data-tour="header"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">📊 Your Trading Hub</h3>
          <p className="text-sm">
            This is your main control center! Here you'll find your portfolio value, 
            experience level, and quick access to all the fun features.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="themes"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-lg font-bold mb-2">🎨 Choose Your Adventure!</h3>
          <p className="text-sm">
            Pick your favorite theme! You can be in Doraemon's world, Pikachu's land, 
            or Shinchan's neighborhood. Each theme has its own special colors and magic!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="portfolio"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">💰 Your Virtual Money</h3>
          <p className="text-sm">
            This shows your total portfolio value! Start with ₹10,000 and watch it grow 
            as you make smart investment decisions. The more you learn, the more you earn!
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="news"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <span className="text-2xl">📰</span>
          </div>
          <h3 className="text-lg font-bold mb-2">📰 Market News</h3>
          <p className="text-sm">
            Stay updated with the latest market news! This scrolling ticker shows 
            what's happening in the stock world. Knowledge is power! 💪
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="charts"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-lg font-bold mb-2">📈 Live Charts</h3>
          <p className="text-sm">
            Watch stock prices move in real-time! These colorful charts help you 
            understand how stock prices change and make better investment choices.
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="stocks"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="text-lg font-bold mb-2">🏢 Stock Cards</h3>
          <p className="text-sm">
            These are the companies you can invest in! Each card shows the current price, 
            how much it changed, and the percentage. Green means it went up, red means it went down!
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="arcade"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <Gamepad2 className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">🎮 Game Arena</h3>
          <p className="text-sm">
            Time to play and earn! Click the Arcade button to access fun mini-games 
            where you can win extra virtual money and learn about finance in a super fun way!
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '[data-tour="notifications"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">🔔 Breaking News Flash</h3>
          <p className="text-sm">
            Click here to see live breaking news! Get instant updates about market changes, 
            stock movements, and important financial news that could affect your investments.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="trophy"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">🏆 Achievements</h3>
          <p className="text-sm">
            Track your progress and unlock awesome achievements! The more you learn 
            and invest wisely, the more trophies you'll earn. Show off your skills!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="settings"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <User className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">👤 Your Profile</h3>
          <p className="text-sm">
            Customize your name and starting money! Set your display name for the 
            leaderboard and choose how much virtual money you want to start with.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="finish"]',
      content: (
        <div className="text-center p-2">
          <div className="flex justify-center mb-3">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-lg font-bold mb-2">🎉 You're All Set!</h3>
          <p className="text-sm">
            Awesome! You've completed the tour and you're ready to become a stock market expert! 
            Remember: Start small, learn lots, and have fun! Happy investing! 💰✨
          </p>
          <div className="mt-3">
            <Button 
              onClick={handleSkipTutorial}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Start Trading! 🚀
            </Button>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const joyrideStyles = {
    options: {
      primaryColor: '#3b82f6',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.4)',
      spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
      beaconSize: 36,
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: 12,
      fontSize: 14,
      padding: 16,
    },
    tooltipContainer: {
      textAlign: 'center' as const,
    },
    tooltipTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 8,
    },
    tooltipContent: {
      padding: '8px 16px',
      fontSize: 14,
      lineHeight: 1.4,
    },
    buttonNext: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      padding: '8px 16px',
    },
    buttonBack: {
      color: '#6b7280',
      fontSize: 14,
      marginRight: 8,
    },
    buttonSkip: {
      color: '#ef4444',
      fontSize: 14,
    },
    beacon: {
      inner: '#3b82f6',
      outer: '#3b82f6',
    },
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      disableCloseOnEsc
      styles={joyrideStyles}
      locale={{
        back: '← Back',
        close: '✕',
        last: 'Finish! 🎉',
        next: 'Next →',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default TutorialGuide;
