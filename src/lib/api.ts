import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '@/types/api';

/**
 * Instance Axios configurée avec intercepteurs pour l'authentification
 * et la gestion globale des erreurs.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://eduai-back-production.up.railway.app/',
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
    const detail = error.response?.data?.detail;
    const message = typeof detail === 'string'
      ? detail
      : Array.isArray(detail)
        ? detail.map(e => e.msg).join(', ')
        : 'Une erreur est survenue';
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eduai_token');
        // Ne pas rediriger si on est déjà sur une page d'auth
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
      toast.error('Session expirée. Veuillez vous reconnecter.');
    } else if (status === 403) {
      toast.error('Accès refusé.');
    } else if (status === 500) {
      toast.error('Erreur serveur. Réessayez plus tard.');
    } else if (status === 422) {
      toast.error(`Validation : ${message}`);
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
