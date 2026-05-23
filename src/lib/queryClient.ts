import { QueryClient } from '@tanstack/react-query';

/**
 * Instance QueryClient configurée avec des valeurs par défaut optimisées.
 * - staleTime: 5 minutes pour limiter les re-fetches
 * - retry: 2 tentatives max en cas d'erreur réseau
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
