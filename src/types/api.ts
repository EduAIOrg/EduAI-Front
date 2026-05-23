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

/** Erreur API standard */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
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

/** Requête de traduction */
export interface TranslateRequest {
  text: string;
  from: 'fr' | 'en';
  to: 'fr' | 'en';
  keepContext: boolean;
}

/** Réponse de traduction */
export interface TranslateResponse {
  translatedText: string;
  from: string;
  to: string;
}

/** Historique de traduction */
export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  from: string;
  to: string;
  createdAt: string;
}
