'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/** Error boundary pour le dashboard */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-96 flex-col items-center justify-center gap-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5470]/10"
      >
        <AlertTriangle className="h-8 w-8 text-[#FF5470]" />
      </motion.div>
      <div>
        <h2 className="text-xl font-bold text-[#F0F0F8]">Une erreur est survenue</h2>
        <p className="mt-2 text-sm text-[#8888AA]">
          {error.message || 'Quelque chose s\'est mal passé. Réessayez.'}
        </p>
      </div>
      <motion.button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-[#6C63FF] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#5A52E0]"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <RefreshCw className="h-4 w-4" />
        Réessayer
      </motion.button>
    </div>
  );
}
