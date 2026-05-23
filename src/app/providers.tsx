'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/lib/queryClient';
import ThemeProvider from '@/components/providers/ThemeProvider';

/**
 * Providers globaux de l'application (QueryClient, Theme, etc.).
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
