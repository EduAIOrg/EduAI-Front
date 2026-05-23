'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Composant d'état vide avec icône, texte et action optionnelle.
 */
const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E1E2E]">
        <Icon className="h-8 w-8 text-[#6C63FF]" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#F0F0F8]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[#8888AA]">{description}</p>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-6 py-2.5 text-sm font-medium text-white transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
