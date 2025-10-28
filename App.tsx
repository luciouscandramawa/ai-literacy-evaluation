import React, { useState, useCallback } from 'react';
import { SessionData, EvaluationResult, UserAnswers, ReadingMaterial, MaterialContent } from './types';
import { generateReadingSession, evaluateAnswers, getTextFromUrl } from './services/geminiService';
import { extractTextFromPdf, extractTextFromDocx } from './services/fileService';
import ReadingSession from './components/ReadingSession';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import RoleSelector from './components/RoleSelector';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';

type AppState = 'role_selection' | 'student_dashboard' | 'instructor_dashboard' | 'reading_session' | 'results' | 'loading' | 'error';
type Role = 'student' | 'instructor';

const initialMaterials: ReadingMaterial[] = [
  {
    id: 'initial-1',
    title: 'The Rise of Artificial Intelligence',
    content: {
        type: 'text',
        text: `Artificial intelligence (AI) is a transformative field of computer science that has captured the public imagination. At its core, AI involves creating machines that can perform tasks that typically require human intelligence. This includes learning from experience, understanding language, recognizing patterns, and solving complex problems. The roots of AI trace back to the mid-20th century, but recent advancements in computing power and the availability of massive datasets have led to an explosion in its capabilities.

One of the most significant subfields of AI is machine learning, where algorithms are trained on data to make predictions or decisions without being explicitly programmed for the task. For example, a machine learning model can be shown thousands of cat photos to learn how to identify a cat in a new, unseen picture. This technology powers everything from your social media feed to advanced medical diagnostics. Another exciting area is Natural Language Processing (NLP), which enables computers to understand, interpret, and generate human language, making technologies like voice assistants and translation services possible. As AI continues to evolve, it promises to revolutionize industries, though it also raises important ethical questions about privacy, bias, and the future of work that society must address.`
    }
  }
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('role_selection');
  const [loadingMessage, setLoadingMessage] = useState('AI is generating questions...');
  const [readingMaterials, setReadingMaterials] = useState<ReadingMaterial[]>(initialMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRoleSelect = (role: Role) => {
    if (role === 'student') {
      setAppState('student_dashboard');
    } else {
      setAppState('instructor_dashboard');
    }
  };

  const handleMaterialSelect = useCallback(async (material: ReadingMaterial) => {
    setAppState('loading');
    setErrorMessage('');
    setSelectedMaterial(material);
    try {
      let passage = '';
      const content = material.content;

      switch(content.type) {
        case 'text':
          setLoadingMessage('Preparing reading material...');
          passage = content.text;
          break;
        case 'pdf':
          setLoadingMessage('Extracting text from PDF...');
          passage = await extractTextFromPdf(content.file);
          break;
        case 'file':
          setLoadingMessage('Extracting text from file...');
          passage = await extractTextFromDocx(content.file);
          break;
        case 'url':
          setLoadingMessage('Extracting text from URL...');
          passage = await getTextFromUrl(content.url);
          break;
      }

      if (!passage || passage.trim().length < 50) {
        let specificError = "Could not extract sufficient text from the material. The file might be empty, corrupted, or the URL may not contain a readable article."; // Fallback message
        switch(material.content.type) {
            case 'url':
                specificError = "Could not extract readable text from the URL. Please check if the link is correct, publicly accessible, and points to a text-based article.";
                break;
            case 'pdf':
            case 'file':
                specificError = "Could not extract readable text from the file. The file might be empty, password-protected, corrupted, or contain only images.";
                break;
            case 'text':
                 specificError = "The provided text is too short. Please provide a longer passage for analysis.";
                 break;
        }
        throw new Error(specificError);
      }
      
      setLoadingMessage('AI is generating questions...');
      const data = await generateReadingSession(passage);
      setSessionData(data);
      setAppState('reading_session');
    } catch (error) {
      console.error('Failed to generate reading session:', error);
      const message = error instanceof Error ? error.message : 'Sorry, we couldn\'t prepare the reading session. Please try again.';
      setErrorMessage(message);
      setAppState('error');
    }
  }, []);
  
  const handleAddMaterial = (title: string, content: MaterialContent) => {
    const newMaterial: ReadingMaterial = {
      id: `material-${Date.now()}`,
      title,
      content,
    };
    setReadingMaterials(prev => [...prev, newMaterial]);
  };

  const handleSubmitAnswers = useCallback(async (answers: UserAnswers) => {
    if (!sessionData) return;
    setAppState('loading');
    setLoadingMessage('Evaluating your answers...');
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
    setSelectedMaterial(null);
    setAppState('student_dashboard');
  };
  
  const handleGoToRoleSelection = () => {
    setSessionData(null);
    setEvaluationResult(null);
    setErrorMessage('');
    setSelectedMaterial(null);
    setAppState('role_selection');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <div className="flex flex-col items-center justify-center min-h-[80vh]"><LoadingSpinner /><p className="mt-4 text-gray-400">{loadingMessage}</p></div>;
      case 'role_selection':
        return <RoleSelector onSelectRole={handleRoleSelect} />;
      case 'student_dashboard':
        return <StudentDashboard materials={readingMaterials} onSelectMaterial={handleMaterialSelect} />;
      case 'instructor_dashboard':
        return <InstructorDashboard materials={readingMaterials} onAddMaterial={handleAddMaterial} />;
      case 'reading_session':
        if (sessionData && selectedMaterial) {
          return <ReadingSession sessionData={sessionData} material={selectedMaterial} onSubmit={handleSubmitAnswers} />;
        }
        return null;
      case 'results':
        if (evaluationResult) {
          return <ResultsScreen result={evaluationResult} onRestart={handleRestart} />;
        }
        return null;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 bg-brand-container rounded-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-gray-400 mb-6">{errorMessage}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-bg"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <RoleSelector onSelectRole={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-brand-container/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-100 tracking-tight">AI Reading Evaluation</h1>
              {appState !== 'role_selection' && (
                  <button 
                    onClick={handleGoToRoleSelection}
                    className="px-4 py-2 text-sm bg-brand-button-base text-gray-300 font-semibold rounded-lg shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-accent focus:ring-offset-2 focus:ring-offset-brand-bg"
                  >
                    Switch Role
                  </button>
              )}
            </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;