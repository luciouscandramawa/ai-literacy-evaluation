import React from 'react';
import { Question, QuestionType } from '../types';

const ICONS: { [key in QuestionType]: React.ReactNode } = {
  [QuestionType.Explicit]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  [QuestionType.Implicit]: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  [QuestionType.Critical]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  ),
  [QuestionType.Vocabulary]: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
};

const ICON_COLORS: { [key in QuestionType]: string } = {
    [QuestionType.Explicit]: 'text-blue-400 bg-blue-500/10',
    [QuestionType.Implicit]: 'text-purple-400 bg-purple-500/10',
    [QuestionType.Critical]: 'text-orange-400 bg-orange-500/10',
    [QuestionType.Vocabulary]: 'text-green-400 bg-green-500/10',
};

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  userAnswer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, onAnswerChange, userAnswer }) => {
  const isCriticalThinking = question.type === QuestionType.Critical;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 p-3 rounded-full ${ICON_COLORS[question.type]}`}>
          {ICONS[question.type]}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">{question.type}</p>
          <p className="text-lg font-semibold text-gray-100 mt-1">
            {questionNumber}. {question.questionText}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pl-16">
        {isCriticalThinking ? (
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition bg-gray-700 text-gray-200 placeholder-gray-500"
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
                    ? 'bg-violet-500/10 border-violet-500 ring-1 ring-violet-500'
                    : 'bg-gray-700/50 border-gray-700 hover:border-violet-500 hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  className="h-5 w-5 text-violet-600 bg-gray-600 border-gray-500 focus:ring-violet-500 focus:ring-2"
                />
                <span className="ml-4 text-gray-200">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;