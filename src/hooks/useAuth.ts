'use client';

import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';
import { ROUTES } from '@/constants/routes';

/**
 * Hook d'authentification complet.
 * Gère login, register, logout et récupération du profil.
 */
export const useAuth = () => {
  const router = useRouter();
  const { setAuth, clearAuth, setLoading, setUser } = useAuthStore();

  /** Récupère le profil de l'utilisateur connecté */
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      const { data } = await api.get('/api/auth/me');
      return data.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('eduai_token'),
    retry: false,
  });

  /** Mutation de connexion */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      // MOCK DATA FOR TESTING
      if (credentials.email === 'test@eduai.africa') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              token: 'mock-jwt-token-12345',
              refreshToken: 'mock-refresh-token-12345',
              user: { 
                id: 'test-123', 
                name: 'Utilisateur Test', 
                email: 'test@eduai.africa', 
                role: 'student', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
              }
            });
          }, 1000);
        });
      }
      
      const { data } = await api.post('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Bienvenue, ${data.user.name} ! 🎉`);
      router.push(ROUTES.DASHBOARD);
    },
    onError: () => {
      toast.error('Email ou mot de passe incorrect.');
    },
  });

  /** Mutation d'inscription */
  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData): Promise<AuthResponse> => {
      // MOCK DATA FOR TESTING
      if (registerData.email === 'test@eduai.africa') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              token: 'mock-jwt-token-12345',
              refreshToken: 'mock-refresh-token-12345',
              user: { 
                id: 'test-123', 
                name: registerData.name, 
                email: 'test@eduai.africa', 
                role: 'student', 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
              }
            });
          }, 1000);
        });
      }

      const { data } = await api.post('/api/auth/register', registerData);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Compte créé avec succès ! 🎉');
      router.push(ROUTES.DASHBOARD);
    },
    onError: () => {
      toast.error("Erreur lors de l'inscription.");
    },
  });

  /** Déconnexion */
  const logout = () => {
    clearAuth();
    toast.success('Déconnexion réussie.');
    router.push(ROUTES.LOGIN);
  };

  /** Met à jour l'état après le fetch du profil */
  useEffect(() => {
    if (meQuery.data && !meQuery.isLoading) {
      setUser(meQuery.data);
      setLoading(false);
    }
    if (meQuery.isError) {
      clearAuth();
    }
  }, [meQuery.data, meQuery.isLoading, meQuery.isError, setUser, setLoading, clearAuth]);

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    meQuery,
  };
};
