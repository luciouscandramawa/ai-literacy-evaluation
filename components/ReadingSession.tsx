import React, { useState } from 'react';
import { SessionData, UserAnswers, ReadingMaterial } from '../types';
import QuestionCard from './QuestionCard';
import PdfViewer from './PdfViewer';

interface ReadingSessionProps {
  sessionData: SessionData;
  material: ReadingMaterial;
  onSubmit: (answers: UserAnswers) => void;
}

const ReadingSession: React.FC<ReadingSessionProps> = ({ sessionData, material, onSubmit }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = sessionData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === sessionData.questions.length - 1;

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < sessionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const renderPassage = () => {
    switch (material.content.type) {
      case 'text':
      case 'url':
      case 'file': // File content is also pre-fetched as text.
        return (
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed whitespace-pre-wrap">
            {sessionData.passage}
          </div>
        );
      case 'pdf':
        return <PdfViewer file={material.content.file} />;
      default:
        return <p>Unsupported material type.</p>;
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="lg:w-1/2 bg-brand-container p-6 sm:p-8 rounded-lg shadow-lg lg:max-h-[80vh] lg:overflow-y-auto">
          <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-text-accent/20 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                   <h2 className="text-2xl font-bold text-white">Reading Passage</h2>
                   <p className="text-white font-medium">{material.title}</p>
              </div>
          </div>
          {renderPassage()}
        </article>
        
        <div className="lg:w-1/2">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              onAnswerChange={handleAnswerChange}
              userAnswer={answers[currentQuestion.id] || ''}
            />
        </div>
      </div>
      
      <div className="bg-brand-container p-4 rounded-lg flex justify-between items-center">
          <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-brand-button-base text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-container disabled:opacity-50 disabled:cursor-not-allowed"
          >
              &lt; Prev
          </button>
          <p className="font-semibold">{currentQuestionIndex + 1} / {sessionData.questions.length}</p>
          {isLastQuestion ? (
               <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== sessionData.questions.length}
                  className="px-6 py-2 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-container disabled:bg-brand-accent-disabled disabled:cursor-not-allowed"
               >
                  Submit Answers
              </button>
          ) : (
              <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="px-6 py-2 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-container disabled:bg-brand-accent-disabled disabled:cursor-not-allowed"
              >
                  Next &gt;
              </button>
          )}
      </div>
    </div>
  );
};

export default ReadingSession;