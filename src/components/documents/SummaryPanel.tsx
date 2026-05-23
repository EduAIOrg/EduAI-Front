'use client';

import { motion } from 'framer-motion';
import { Copy, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface SummaryPanelProps {
  summary: string;
  isLoading?: boolean;
}

/**
 * Panel d'affichage du résumé IA avec bouton copier.
 */
const SummaryPanel = ({ summary, isLoading }: SummaryPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded-lg bg-[#1E1E2E]"
            style={{ width: `${80 - i * 8}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Badge IA */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#6C63FF]" />
          <span className="text-xs font-medium text-[#6C63FF]">Généré par IA</span>
        </div>
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#8888AA] transition-colors hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#00D4AA]" />
              <span className="text-[#00D4AA]">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copier
            </>
          )}
        </motion.button>
      </div>

      {/* Contenu du résumé */}
      <div className="prose prose-invert max-w-none">
        <div className="rounded-xl bg-[#0A0A0F] p-4 text-sm leading-relaxed text-[#F0F0F8]/90">
          {summary || 'Aucun résumé disponible. Cliquez sur "Générer" pour créer un résumé de ce document.'}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryPanel;
