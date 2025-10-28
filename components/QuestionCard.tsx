import React from 'react';
import { Question, QuestionType } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  userAnswer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, onAnswerChange, userAnswer }) => {
  const isCriticalThinking = question.type === QuestionType.Critical;

  return (
    <div className="bg-brand-container p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex-grow">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">{question.type}</p>
        <p className="text-lg font-semibold text-gray-100 mt-2">
          {questionNumber}. {question.questionText}
        </p>
        
        <div className="mt-6">
          {isCriticalThinking ? (
            <textarea
              rows={6}
              className="w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-text-accent focus:border-brand-text-accent transition bg-brand-input-base text-gray-200 placeholder-gray-500"
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
            />
          ) : (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    userAnswer === option
                      ? 'bg-brand-accent/10 border-brand-text-accent ring-1 ring-brand-text-accent'
                      : 'bg-brand-button-base border-gray-700 hover:border-brand-text-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    className="h-5 w-5 text-brand-accent bg-gray-600 border-gray-500 focus:ring-brand-text-accent focus:ring-2"
                  />
                  <span className="ml-4 text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;