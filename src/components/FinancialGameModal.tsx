import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FinancialDashboard } from "./FinancialDashboard";
import { FinancialQuestionCard } from "./FinancialQuestionCard";
import { FinancialLeaderboard } from "./FinancialLeaderboard";
import { StockNewsQuiz } from "./StockNewsQuiz";
import { TenYearBetGame } from "./TenYearBetGame";
import playerData from "../data/player.json";
import studentEvents from "../data/student_events.json";
import adultQuestions from "../data/adult-question.json";

interface Player {
  name: string;
  cash: number;
  happiness: number;
  literacy: number;
  health: number;
  debt: number;
}

interface Option {
  text: string;
  effect: {
    cash?: number;
    happiness?: number;
    literacy?: number;
    health?: number;
    debt?: number;
  };
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface FinancialGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatMs(ms: number) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function FinancialGameModal({ isOpen, onClose }: FinancialGameModalProps) {
  const [player, setPlayer] = useState<Player>(playerData);
  const [events, setEvents] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [phase, setPhase] = useState<"student" | "adult">("student");
  const [showCongrats, setShowCongrats] = useState(false);
  const [showDailyLimit, setShowDailyLimit] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [currentMode, setCurrentMode] = useState<"main" | "stock-quiz" | "ten-year-bet">("main");

  useEffect(() => {
    if (isOpen) {
      // Reset game state when modal opens
      setPlayer(playerData);
      setPhase("student");
      setShowCongrats(false);
      setShowDailyLimit(false);
      setDailyCount(0);
      setResetAt(null);
      setCountdown(0);
      setCurrentMode("main");
      
      // Pick 10 unique random student events for the initial phase
      const shuffled = [...studentEvents].sort(() => Math.random() - 0.5);
      const initialTen = shuffled.slice(0, 10);
      setEvents(initialTen);
      loadNextQuestion(initialTen);
    }
  }, [isOpen]);

  // countdown tick
  useEffect(() => {
    if (!resetAt) return;
    const id = setInterval(() => {
      const diff = Math.max(0, resetAt - Date.now());
      setCountdown(diff);
      if (diff === 0) {
        // reset window
        const next = Date.now() + 24 * 60 * 60 * 1000;
        setDailyCount(0);
        setShowDailyLimit(false);
        setResetAt(next);
        localStorage.setItem("stockverse_daily_limit", JSON.stringify({ count: 0, resetAt: next }));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [resetAt]);

  const loadNextQuestion = (eventList: Question[]) => {
    const length = eventList?.length || 0;
    if (phase === "student" && length === 0) {
      setCurrentQuestion(null);
      setShowCongrats(true);
      return;
    }

    const pool = (length > 0)
      ? eventList
      : [...adultQuestions]; // for adult, recycle when empty

    const randomIndex = Math.floor(Math.random() * pool.length);
    const next = pool[randomIndex];
    const newList = pool.filter((_, i) => i !== randomIndex);
    setEvents(newList);
    setCurrentQuestion(next);
  };

  const handleAnswer = (effect: Option['effect']) => {
    // enforce daily limit only in adult phase
    if (phase === "adult" && dailyCount >= 10) {
      setShowDailyLimit(true);
      return;
    }
    
    const updated = { ...player };
    for (const key in effect) {
      if (updated[key as keyof Player] !== undefined) {
        (updated[key as keyof Player] as number) += effect[key as keyof typeof effect] || 0;
      }
    }
    updated.cash = Math.max(0, updated.cash);
    updated.happiness = Math.min(100, Math.max(0, updated.happiness));
    updated.health = Math.min(100, Math.max(0, updated.health));
    updated.literacy = Math.max(0, updated.literacy);
    updated.debt = Math.max(0, updated.debt || 0);

    setPlayer(updated);
    
    // increment daily count only if in adult phase
    if (phase === "adult") {
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      if (resetAt) {
        localStorage.setItem("stockverse_daily_limit", JSON.stringify({ count: newCount, resetAt }));
      }
      if (newCount >= 10) {
        setShowDailyLimit(true);
      }
    }
    
    loadNextQuestion(events);
  };

  const handleContinueToAdult = () => {
    setShowCongrats(false);
    setPhase("adult");
    setEvents([...adultQuestions]);
    loadNextQuestion(adultQuestions);
    // Start tracking daily limit only when entering adult phase
    const next = Date.now() + 24 * 60 * 60 * 1000;
    setDailyCount(0);
    setResetAt(next);
    localStorage.setItem("stockverse_daily_limit", JSON.stringify({ count: 0, resetAt: next }));
  };

  const handleStockQuizAnswer = (isCorrect: boolean) => {
    // Only affect literacy, not money
    const updated = { ...player };
    if (isCorrect) {
      updated.literacy = Math.min(100, updated.literacy + 2); // +2 literacy for correct answer
    } else {
      updated.literacy = Math.max(0, updated.literacy - 1); // -1 literacy for wrong answer
    }
    setPlayer(updated);
  };

  const handleTenYearBetAnswer = (isCorrect: boolean) => {
    // Only affect literacy, not money
    const updated = { ...player };
    if (isCorrect) {
      updated.literacy = Math.min(100, updated.literacy + 1); // +1 literacy for correct answer
    } else {
      updated.literacy = Math.max(0, updated.literacy - 1); // -1 literacy for wrong answer
    }
    setPlayer(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            📈 Stockverse Financial Literacy Game
          </DialogTitle>
          
          {/* Mode Selector */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Button
              onClick={() => setCurrentMode("main")}
              variant={currentMode === "main" ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              🎯 Decision Game
            </Button>
            <Button
              onClick={() => setCurrentMode("stock-quiz")}
              variant={currentMode === "stock-quiz" ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              📰 Stock News Quiz
            </Button>
            <Button
              onClick={() => setCurrentMode("ten-year-bet")}
              variant={currentMode === "ten-year-bet" ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              🎯 10-Year Bet
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <FinancialDashboard player={player} />
          
          {currentMode === "main" ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialQuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  disabled={phase === "adult" && dailyCount >= 10}
                />
              </div>
              <div>
                <FinancialLeaderboard player={player} />
              </div>
            </div>
          ) : currentMode === "stock-quiz" ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StockNewsQuiz
                  onAnswer={handleStockQuizAnswer}
                  onClose={() => setCurrentMode("main")}
                />
              </div>
              <div>
                <FinancialLeaderboard player={player} />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TenYearBetGame
                  onAnswer={handleTenYearBetAnswer}
                  onClose={() => setCurrentMode("main")}
                />
              </div>
              <div>
                <FinancialLeaderboard player={player} />
              </div>
            </div>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-panel-bright p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">🎉 Congratulations!</h3>
              <p className="text-muted-foreground mb-6">
                You've completed the initial phase. Ready for the adult scenarios?
              </p>
              <Button onClick={handleContinueToAdult} className="w-full">
                Continue to Adult Mode
              </Button>
            </div>
          </div>
        )}

        {/* Daily Limit Modal */}
        {showDailyLimit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-panel-bright p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">⏳ Daily Limit Reached</h3>
              <p className="text-muted-foreground mb-6">
                You've answered 10 questions for today. New questions unlock in{" "}
                <strong>{formatMs(countdown)}</strong>.
              </p>
              <Button onClick={() => setShowDailyLimit(false)} className="w-full">
                Okay
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
