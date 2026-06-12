import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface FinancialQuestionCardProps {
  question: Question | null;
  onAnswer: (effect: Option['effect']) => void;
  disabled?: boolean;
}

export function FinancialQuestionCard({ question, onAnswer, disabled = false }: FinancialQuestionCardProps) {
  if (!question) {
    return (
      <Card className="glass-panel-bright">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-center">No questions left!</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel-bright">
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options.map((opt, idx) => (
          <Button
            key={idx}
            onClick={() => onAnswer(opt.effect)}
            disabled={disabled}
            className="w-full justify-start h-auto p-4 text-left"
            variant="outline"
          >
            {opt.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
