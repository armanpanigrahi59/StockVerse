import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BookOpen, CheckCircle, XCircle } from "lucide-react";
import stocksData from "../data/stocks.json";

interface StockQuestion {
  id: number;
  news: string;
  question: string;
  correct_answer: string;
  explanation: string;
}

interface StockNewsQuizProps {
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export function StockNewsQuiz({ onAnswer, onClose }: StockNewsQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<StockQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadRandomQuestion();
  }, []);

  const loadRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * stocksData.questions.length);
    const question = stocksData.questions[randomIndex];
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    setQuestionCount(prev => prev + 1);
    onAnswer(correct);
  };

  const handleNextQuestion = () => {
    loadRandomQuestion();
  };

  const handleFinish = () => {
    onClose();
  };

  if (!currentQuestion) {
    return (
      <Card className="glass-panel-bright">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading question...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Stock News Quiz
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Questions: {questionCount}</Badge>
              <Badge variant="outline" className="text-green-600">
                Correct: {correctCount}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* News Card */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Market News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm leading-relaxed">{currentQuestion.news}</p>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            <Button
              onClick={() => handleAnswer("Yes")}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start h-auto p-4 text-left ${
                selectedAnswer === "Yes"
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {selectedAnswer === "Yes" && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )
                )}
                <span>Yes - Invest</span>
              </div>
            </Button>

            <Button
              onClick={() => handleAnswer("No")}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start h-auto p-4 text-left ${
                selectedAnswer === "No"
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {selectedAnswer === "No" && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )
                )}
                <span>No - Don't Invest</span>
              </div>
            </Button>
          </div>

          {selectedAnswer && (
            <div className="mt-4 flex gap-3">
              <Button onClick={handleNextQuestion} className="flex-1">
                Next Question
              </Button>
              <Button onClick={handleFinish} variant="outline" className="flex-1">
                Finish Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explanation Modal */}
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-600">Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-red-600">Incorrect Answer</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📰 News Recap:</h4>
              <p className="text-sm text-muted-foreground">{currentQuestion.news}</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Explanation:</h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">✅ Correct Answer:</h4>
              <Badge 
                variant={currentQuestion.correct_answer === "Yes" ? "default" : "secondary"}
                className="text-lg px-4 py-2"
              >
                {currentQuestion.correct_answer === "Yes" ? "Yes - Invest" : "No - Don't Invest"}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleNextQuestion} className="flex-1">
              Next Question
            </Button>
            <Button onClick={handleFinish} variant="outline" className="flex-1">
              Finish Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
