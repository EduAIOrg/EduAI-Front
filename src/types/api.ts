/** Réponse API paginée générique */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Réponse API standard */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/** Erreur API FastAPI */
export interface ApiError {
  detail: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
}

/** Stats du dashboard */
export interface DashboardStats {
  documentsCount: number;
  quizzesTaken: number;
  averageScore: number;
  revisionStreak: number;
}

/** Activité récente */
export interface RecentActivity {
  id: string;
  type: 'upload' | 'quiz' | 'chat' | 'translation';
  title: string;
  description: string;
  createdAt: string;
}

/** Données de progression */
export interface ProgressData {
  date: string;
  score: number;
}

/** Lacune détectée */
export interface Lacune {
  id: string;
  subject: string;
  topic: string;
  masteryLevel: number;
  recommendedQuizId?: string;
  description: string;
}

/** Requête de traduction (aligné avec TranslateRequest backend) */
export interface TranslateRequest {
  text: string;
  source_lang: 'fr' | 'en';
  target_lang: 'fr' | 'en';
  preserve_pedagogical_context?: boolean;
}

/** Réponse de traduction (aligné avec TranslateResponse backend) */
export interface TranslateResponse {
  translated_text: string;
  source_lang: string;
  target_lang: string;
}

/** Historique de traduction (local) */
export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  from: string;
  to: string;
  createdAt: string;
}
