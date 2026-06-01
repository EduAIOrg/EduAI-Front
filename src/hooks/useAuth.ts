'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData, TokenResponse, User } from '@/types/auth';
import { ROUTES } from '@/constants/routes';

/**
 * Hook d'authentification complet.
 * Gère login, register, logout et récupération du profil.
 * 
 * Le backend FastAPI utilise :
 * - POST /api/auth/login : form-data (username + password) → TokenResponse
 * - POST /api/auth/register : JSON (email, password, full_name) → TokenResponse
 * - GET /api/auth/me : → UserResponse
 */
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, setLoading, setUser, token } = useAuthStore();

  /** Récupère le profil de l'utilisateur connecté */
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      const { data } = await api.get('/api/auth/me');
      return data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('eduai_token'),
    retry: false,
  });

  /** Mutation de connexion */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<TokenResponse> => {
      // Le backend attend application/x-www-form-urlencoded avec username (pas email)
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const { data } = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return data;
    },
    onSuccess: async (data) => {
      // Stocker le token puis récupérer le profil
      if (typeof window !== 'undefined') {
        localStorage.setItem('eduai_token', data.access_token);
      }
      try {
        const { data: user } = await api.get('/api/auth/me');
        setAuth(user, data.access_token);
        toast.success(`Bienvenue, ${user.full_name} ! 🎉`);
        router.push(ROUTES.DASHBOARD);
      } catch {
        toast.error('Erreur lors de la récupération du profil.');
      }
    },
    onError: () => {
      toast.error('Email ou mot de passe incorrect.');
    },
  });

  /** Mutation d'inscription */
  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData): Promise<TokenResponse> => {
      const { data } = await api.post('/api/auth/register', {
        email: registerData.email,
        password: registerData.password,
        full_name: registerData.full_name,
      });
      return data;
    },
    onSuccess: async (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('eduai_token', data.access_token);
      }
      try {
        const { data: user } = await api.get('/api/auth/me');
        setAuth(user, data.access_token);
        toast.success('Compte créé avec succès ! 🎉');
        router.push(ROUTES.DASHBOARD);
      } catch {
        toast.error('Erreur lors de la récupération du profil.');
      }
    },
    onError: () => {
      toast.error("Erreur lors de l'inscription.");
    },
  });

  /** Déconnexion */
  const logout = () => {
    clearAuth();
    queryClient.clear();
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
