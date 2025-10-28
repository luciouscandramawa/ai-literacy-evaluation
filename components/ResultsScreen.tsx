import React from 'react';
import { EvaluationResult, Feedback } from '../types';

interface ResultsScreenProps {
  result: EvaluationResult;
  onRestart: () => void;
}

const FeedbackCard: React.FC<{ feedbackItem: Feedback }> = ({ feedbackItem }) => {
  const isCorrect = feedbackItem.isCorrect;
  return (
    <div className={`p-4 border-l-4 rounded-md ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
      <p className="font-semibold text-gray-100">{feedbackItem.questionText}</p>
      <p className={`mt-2 text-sm ${isCorrect ? 'text-gray-300' : 'text-gray-300'}`}>
        <span className="font-bold">Your answer: </span>
        {feedbackItem.userAnswer} {isCorrect ? <span className="text-green-400">✅ Correct</span> : <span className="text-red-400">❌ Incorrect</span>}
      </p>
      <p className="mt-2 text-sm text-gray-400">{feedbackItem.explanation}</p>
    </div>
  );
};


const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center bg-brand-container p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-gray-100">Your Results</h2>
        <p className="text-6xl font-bold my-4 text-brand-accent">
          {result.score} <span className="text-4xl text-gray-500">/ {result.totalQuestions}</span>
        </p>
        <p className="text-xl text-gray-300">
          {result.score > 2 ? "Great job! You're making excellent progress." : "Keep practicing, you'll get there!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-container p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-brand-accent mb-3">Strengths</h3>
          <p className="text-gray-300">{result.strengths}</p>
        </div>
        <div className="bg-brand-container p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-brand-accent mb-3">Areas for Growth</h3>
          <p className="text-gray-300">{result.areasForGrowth}</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-100">Detailed Feedback</h3>
        <div className="space-y-4">
          {result.feedback.map(fb => (
            <FeedbackCard key={fb.questionId} feedbackItem={fb} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-100">Next Steps</h3>
        <div className="bg-brand-container p-6 rounded-lg shadow-md">
          <p className="font-semibold text-gray-100 mb-3">Here are some recommended topics to practice your skills:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {result.recommendations.map((rec, index) => (
              <li key={index}>
                <span className="font-semibold text-brand-accent">{rec.title}:</span> {rec.reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center pt-8">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-bg transition-colors"
        >
          Try Another Topic
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;