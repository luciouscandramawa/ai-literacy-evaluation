import React, { useState } from 'react';
import { SessionData, UserAnswers, QuestionType } from '../types';
import QuestionCard from './QuestionCard';

interface ReadingSessionProps {
  sessionData: SessionData;
  onSubmit: (answers: UserAnswers) => void;
}

const ReadingSession: React.FC<ReadingSessionProps> = ({ sessionData, onSubmit }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length === sessionData.questions.length) {
      onSubmit(answers);
    } else {
      alert('Please answer all questions before submitting.');
    }
  };
  
  return (
    <div className="space-y-12">
      <article className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
            <div className="p-3 bg-violet-500/20 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
                 <h2 className="text-2xl font-bold font-serif text-gray-100">Reading Passage</h2>
                 <p className="text-violet-400 font-medium">Topic: Science</p>
            </div>
        </div>
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed font-serif">
          {sessionData.passage.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <form onSubmit={handleSubmit} className="space-y-8">
        {sessionData.questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionNumber={index + 1}
            onAnswerChange={handleAnswerChange}
            userAnswer={answers[q.id] || ''}
          />
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={Object.keys(answers).length !== sessionData.questions.length}
          >
            Submit Answers
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingSession;