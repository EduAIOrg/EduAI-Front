/** Niveau de difficulté d'un quiz */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/** Type de quiz */
export type QuizType = 'mcq' | 'open' | 'mixed';

/** Statut de génération du quiz */
export type QuizStatus = 'generating' | 'ready' | 'error';

/** Type de question */
export type QuestionType = 'mcq' | 'open';

/** Une question de quiz (aligné avec QuestionResponse backend) */
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  content: string;
  question_type: QuestionType;
  options?: string[] | null;
  order_index: number;
  /** Champs locaux pour l'UI */
  userAnswer?: string;
  isCorrect?: boolean;
}

/** Item de liste de quiz (aligné avec QuizListItem backend) */
export interface QuizListItem {
  time_spent: number;
  id: string;
  title: string;
  quiz_type: QuizType;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  created_at: string;
  question_count: number;
  last_score?: number | null;
}

/** Un quiz complet avec questions (aligné avec QuizResponse backend) */
export interface Quiz {
  id: string;
  user_id: string;
  document_id: string;
  title: string;
  quiz_type: QuizType;
  difficulty: QuizDifficulty;
  status: QuizStatus;
  created_at: string;
  questions: QuizQuestion[];
}

/** Options pour générer un quiz (aligné avec QuizCreate backend) */
export interface QuizCreateRequest {
  document_id: string;
  quiz_type: QuizType;
  difficulty: QuizDifficulty;
  num_questions?: number;
  title?: string;
}

/** Soumission de réponse individuelle */
export interface AnswerSubmit {
  question_id: string;
  answer: string;
}

/** Requête de soumission de quiz (aligné avec QuizSubmit backend) */
export interface QuizSubmitRequest {
  answers: AnswerSubmit[];
  time_spent: number;
}

/** Feedback d'une réponse (aligné avec AnswerFeedback backend) */
export interface AnswerFeedback {
  question_id: string;
  is_correct: boolean;
  score: number;
  user_answer: string;
  correct_answer: string;
  feedback: string;
}

/** Lacune identifiée (aligné avec LacuneItem backend) */
export interface LacuneItem {
  notion: string;
  level: string;
  last_seen: string;
  recommendations?: string[];
}

/** Résultat d'un quiz (aligné avec QuizResultResponse backend) */
export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  time_spent: number;
  created_at: string;
  answer_feedback: AnswerFeedback[];
  lacunes?: LacuneItem[];
}

/** Statut de génération du quiz */
export interface QuizStatusResponse {
  status: QuizStatus;
  progress_message: string;
}
