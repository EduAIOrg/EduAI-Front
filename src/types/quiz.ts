/** Niveau de difficulté d'un quiz */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/** Type de quiz */
export type QuizType = 'mcq' | 'open' | 'mixed';

/** Une option de réponse QCM */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Une question de quiz */
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'open';
  options?: QuizOption[];
  correctAnswer?: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

/** Un quiz complet */
export interface Quiz {
  id: string;
  title: string;
  documentId: string;
  documentTitle: string;
  difficulty: QuizDifficulty;
  type: QuizType;
  questions: QuizQuestion[];
  score?: number;
  totalQuestions: number;
  completedAt?: string;
  createdAt: string;
  duration?: number;
}

/** Options pour générer un quiz */
export interface GenerateQuizOptions {
  documentId: string;
  type: QuizType;
  difficulty: QuizDifficulty;
  questionCount: number;
}

/** Résultats d'un quiz terminé */
export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  recommendations: string[];
  questions: QuizQuestion[];
}
