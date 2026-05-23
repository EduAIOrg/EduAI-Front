import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/types/api';

/**
 * Instance Axios configurée avec intercepteurs pour l'authentification
 * et la gestion globale des erreurs.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Intercepteur de requête : ajoute le token JWT */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('eduai_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Intercepteur de réponse : gère les erreurs 401 et affiche les toasts */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Check if we are in mock mode
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('eduai_token');
      if (token === 'mock-jwt-token-12345') {
        const config = error.config;
        const url = config?.url || '';
        let mockData: any = null;

        if (url.endsWith('/api/auth/me')) {
          mockData = { data: { id: 'test-123', name: 'Utilisateur Test', email: 'test@eduai.africa', role: 'student', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
        } else if (url.includes('/api/documents')) {
          if (url.endsWith('/summary')) {
            mockData = { data: "Ceci est un résumé mocké pour le document de test." };
          } else if (url.match(/\/api\/documents\/\w+/)) {
            mockData = { data: { id: 'doc-1', title: 'Cours d\'Algorithmique.pdf', fileName: 'cours_algo.pdf', fileUrl: '', fileSize: 1024 * 1024 * 2.5, pageCount: 15, hasSummary: true, summary: 'Résumé du cours d\'algorithmique...', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: 'test-123' } };
          } else {
            mockData = { data: [
              { id: 'doc-1', title: 'Cours d\'Algorithmique.pdf', fileName: 'cours_algo.pdf', fileUrl: '', fileSize: 1024 * 1024 * 2.5, pageCount: 15, hasSummary: true, summary: 'Résumé du cours d\'algorithmique...', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: 'test-123' },
              { id: 'doc-2', title: 'Introduction à l\'IA.pdf', fileName: 'intro_ia.pdf', fileUrl: '', fileSize: 1024 * 1024 * 4.1, pageCount: 22, hasSummary: true, summary: 'Résumé d\'introduction à l\'IA...', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId: 'test-123' }
            ] };
          }
        } else if (url.includes('/api/quiz')) {
          if (url.endsWith('/results')) {
            mockData = { data: { quizId: 'quiz-1', score: 85, totalQuestions: 10, correctAnswers: 8, recommendations: ['Révisez les structures de données complexes.', 'Faites plus de quiz sur les arbres binaires.'] } };
          } else if (url.endsWith('/answer')) {
            mockData = { data: { isCorrect: true, explanation: "Bonne réponse ! La complexité est bien O(n log n)." } };
          } else {
            mockData = { data: [
              { id: 'quiz-1', title: 'Quiz d\'Algorithmique', description: 'Testez vos bases en complexité.', questionsCount: 5, difficulty: 'Medium', createdAt: new Date().toISOString() }
            ] };
          }
        } else if (url.includes('/api/chat')) {
          mockData = { data: { content: "Ceci est une réponse automatique de l'IA (Mock) pour vous aider dans vos révisions." } };
        }

        if (mockData !== null) {
          return Promise.resolve({
            data: mockData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          } as any);
        }
      }
    }

    const message = error.response?.data?.message || 'Une erreur est survenue';
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eduai_token');
        window.location.href = '/login';
      }
      toast.error('Session expirée. Veuillez vous reconnecter.');
    } else if (status === 403) {
      toast.error('Accès refusé.');
    } else if (status === 500) {
      toast.error('Erreur serveur. Réessayez plus tard.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
