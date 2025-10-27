export enum QuestionType {
  Explicit = 'Explicit Information',
  Implicit = 'Implicit Information',
  Critical = 'Critical Thinking',
  Vocabulary = 'Vocabulary/Sentence Appropriateness',
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

export interface SessionData {
  passage: string;
  questions: Question[];
}

export interface UserAnswers {
  [questionId: string]: string;
}

export interface Feedback {
  questionId: string;
  questionText: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface EvaluationResult {
  score: number;
  totalQuestions: number;
  strengths: string;
  areasForGrowth: string;
  feedback: Feedback[];
  recommendations: {
    title: string;
    reason: string;
  }[];
}

export type MaterialContent =
  | { type: 'text'; text: string }
  | { type: 'pdf'; file: File }
  | { type: 'file'; file: File }
  | { type: 'url'; url: string };

export interface ReadingMaterial {
  id: string;
  title: string;
  content: MaterialContent;
}