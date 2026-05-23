'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Lacune } from '@/types/api';

interface LacuneCardProps {
  lacune: Lacune;
  index?: number;
}

const masteryColors = [
  { max: 30, color: '#FF5470', label: 'Faible', bg: 'bg-[#FF5470]' },
  { max: 60, color: '#FFB547', label: 'Moyen', bg: 'bg-[#FFB547]' },
  { max: 100, color: '#00D4AA', label: 'Bon', bg: 'bg-[#00D4AA]' },
];

/**
 * Carte de lacune détectée avec barre de maîtrise et action.
 */
const LacuneCard = ({ lacune, index = 0 }: LacuneCardProps) => {
  const mastery = masteryColors.find((m) => lacune.masteryLevel <= m.max) || masteryColors[2];

  return (
    <motion.div
      className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C63FF]/10">
            <BookOpen className="h-5 w-5 text-[#6C63FF]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F0F0F8]">{lacune.subject}</h4>
            <p className="text-xs text-[#8888AA]">{lacune.topic}</p>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            backgroundColor: `${mastery.color}15`,
            color: mastery.color,
          }}
        >
          {mastery.label}
        </span>
      </div>

      <p className="mb-3 text-xs text-[#8888AA]">{lacune.description}</p>

      {/* Barre de maîtrise */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-[10px] text-[#8888AA]">
          <span>Niveau de maîtrise</span>
          <span>{lacune.masteryLevel}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: mastery.color }}
            initial={{ width: 0 }}
            animate={{ width: `${lacune.masteryLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {lacune.recommendedQuizId && (
        <Link href={`/quiz/${lacune.recommendedQuizId}`}>
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF]/10 py-2 text-xs font-medium text-[#6C63FF] hover:bg-[#6C63FF]/20"
            whileTap={{ scale: 0.98 }}
          >
            Travailler cette notion
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
};

export default LacuneCard;
