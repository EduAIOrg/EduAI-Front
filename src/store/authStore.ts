'use client';

import { create } from 'zustand';
import { AuthState, User } from '@/types/auth';

/**
 * Store Zustand pour la gestion de l'authentification.
 * Persiste le token dans localStorage et gère l'état utilisateur.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('eduai_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('eduai_token') : false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduai_token', token);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eduai_token');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setUser: (user: User) => set({ user }),
}));
