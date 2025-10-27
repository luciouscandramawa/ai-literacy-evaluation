import React, { useState, useCallback } from 'react';
import { SessionData, EvaluationResult, UserAnswers } from './types';
import { generateReadingSession, evaluateAnswers } from './services/geminiService';
import TopicSelector from './components/TopicSelector';
import ReadingSession from './components/ReadingSession';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';

type AppState = 'topic_selection' | 'reading_session' | 'results' | 'loading' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('topic_selection');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleTopicSelect = useCallback(async (topic: string) => {
    setAppState('loading');
    setErrorMessage('');
    try {
      const data = await generateReadingSession(topic);
      setSessionData(data);
      setAppState('reading_session');
    } catch (error) {
      console.error('Failed to generate reading session:', error);
      setErrorMessage('Sorry, we couldn\'t generate a reading session. Please try again.');
      setAppState('error');
    }
  }, []);

  const handleSubmitAnswers = useCallback(async (answers: UserAnswers) => {
    if (!sessionData) return;
    setAppState('loading');
    setErrorMessage('');
    try {
      const result = await evaluateAnswers(sessionData.passage, sessionData.questions, answers);
      setEvaluationResult(result);
      setAppState('results');
    } catch (error) {
      console.error('Failed to evaluate answers:', error);
      setErrorMessage('There was an issue evaluating your answers. Please try submitting again.');
      setAppState('error');
    }
  }, [sessionData]);

  const handleRestart = () => {
    setSessionData(null);
    setEvaluationResult(null);
    setErrorMessage('');
    setAppState('topic_selection');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <div className="flex flex-col items-center justify-center min-h-[80vh]"><LoadingSpinner /><p className="mt-4 text-gray-400">AI is thinking...</p></div>;
      case 'topic_selection':
        return <TopicSelector onTopicSelect={handleTopicSelect} />;
      case 'reading_session':
        if (sessionData) {
          return <ReadingSession sessionData={sessionData} onSubmit={handleSubmitAnswers} />;
        }
        return null; // Should not happen
      case 'results':
        if (evaluationResult) {
          return <ResultsScreen result={evaluationResult} onRestart={handleRestart} />;
        }
        return null; // Should not happen
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-gray-400 mb-6">{errorMessage}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <TopicSelector onTopicSelect={handleTopicSelect} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900">
      <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">AI Reading Evaluation</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;