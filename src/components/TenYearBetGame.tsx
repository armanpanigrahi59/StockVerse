import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, Trophy, Target } from "lucide-react";
import tenYearBetQuestions from "../data/tenYearBetQuestions.json";

interface TenYearBetQuestion {
  id: number;
  company: string;
  yearStart: number;
  priceStart: number;
  headline: string;
  correctAnswer: "Outperform" | "Average" | "Underperform";
  explanation: string;
}

interface TenYearBetGameProps {
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

type AnswerChoice = "Outperform" | "Average" | "Underperform";

export function TenYearBetGame({ onAnswer, onClose }: TenYearBetGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerChoice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answers, setAnswers] = useState<Array<{question: TenYearBetQuestion, answer: AnswerChoice, isCorrect: boolean}>>([]);

  const currentQuestion = tenYearBetQuestions[currentQuestionIndex] as TenYearBetQuestion;
  const totalQuestions = tenYearBetQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: AnswerChoice) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      answer,
      isCorrect: correct
    }]);
    
    onAnswer(correct);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(null);
    } else {
      setGameCompleted(true);
    }
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "🏆 You're an Investment Visionary!";
    if (percentage >= 60) return "📈 Great Market Insight!";
    if (percentage >= 40) return "📊 Decent Understanding!";
    return "📚 Keep Learning!";
  };

  const getAnswerIcon = (answer: AnswerChoice) => {
    switch (answer) {
      case "Outperform":
        return <TrendingUp className="w-5 h-5" />;
      case "Underperform":
        return <TrendingDown className="w-5 h-5" />;
      case "Average":
        return <Minus className="w-5 h-5" />;
    }
  };

  const getAnswerColor = (answer: AnswerChoice) => {
    switch (answer) {
      case "Outperform":
        return "text-green-600 bg-green-100";
      case "Underperform":
        return "text-red-600 bg-red-100";
      case "Average":
        return "text-yellow-600 bg-yellow-100";
    }
  };

  if (gameCompleted) {
    return (
      <div className="space-y-6">
        {/* Final Score Card */}
        <Card className="glass-panel-bright">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Game Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-lg text-muted-foreground mb-4">
                {getScoreMessage(correctCount, totalQuestions)}
              </div>
              <Progress value={(correctCount / totalQuestions) * 100} className="h-3 mb-4" />
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">📊 Answer Summary</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {answers.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      item.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.question.company}</span>
                      {item.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>Your answer:</span>
                      <Badge className={getAnswerColor(item.answer)}>
                        {getAnswerIcon(item.answer)}
                        <span className="ml-1">{item.answer}</span>
                      </Badge>
                      <span>Correct:</span>
                      <Badge className={getAnswerColor(item.question.correctAnswer)}>
                        {getAnswerIcon(item.question.correctAnswer)}
                        <span className="ml-1">{item.question.correctAnswer}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} className="flex-1">
                Back to Arcade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              The 10-Year Bet
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                Correct: {correctCount}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Company Info Card */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.company}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Starting Year</div>
              <div className="font-semibold">{currentQuestion.yearStart}</div>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Starting Price</div>
              <div className="font-semibold">₹{currentQuestion.priceStart}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">📰 Market Headline</div>
            <p className="text-sm text-blue-700">{currentQuestion.headline}</p>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="glass-panel-bright">
        <CardHeader>
          <CardTitle className="text-lg">
            How did {currentQuestion.company} perform over the next 10 years?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            <Button
              onClick={() => handleAnswer("Outperform")}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start h-auto p-4 text-left ${
                selectedAnswer === "Outperform"
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {selectedAnswer === "Outperform" && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )
                )}
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Outperform - Stock grew significantly above market average</span>
              </div>
            </Button>

            <Button
              onClick={() => handleAnswer("Average")}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start h-auto p-4 text-left ${
                selectedAnswer === "Average"
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {selectedAnswer === "Average" && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )
                )}
                <Minus className="w-5 h-5 text-yellow-600" />
                <span>Average - Stock performed in line with market</span>
              </div>
            </Button>

            <Button
              onClick={() => handleAnswer("Underperform")}
              disabled={selectedAnswer !== null}
              className={`w-full justify-start h-auto p-4 text-left ${
                selectedAnswer === "Underperform"
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {selectedAnswer === "Underperform" && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )
                )}
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span>Underperform - Stock grew below market average or declined</span>
              </div>
            </Button>
          </div>

          {selectedAnswer && (
            <div className="mt-4">
              <Button onClick={handleNext} className="w-full">
                {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Finish Game"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
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
              <h4 className="font-semibold mb-2">🏢 Company: {currentQuestion.company}</h4>
              <p className="text-sm text-muted-foreground">
                Started at ₹{currentQuestion.priceStart} in {currentQuestion.yearStart}
              </p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Explanation:</h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">✅ Correct Answer:</h4>
              <Badge className={`${getAnswerColor(currentQuestion.correctAnswer)} text-lg px-4 py-2`}>
                {getAnswerIcon(currentQuestion.correctAnswer)}
                <span className="ml-2">{currentQuestion.correctAnswer}</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleNext} className="flex-1">
              {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Finish Game"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
