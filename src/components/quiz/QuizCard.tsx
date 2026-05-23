'use client';

import { motion } from 'framer-motion';
import { Brain, Trophy, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import { ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  index?: number;
}

const difficultyColors = {
  easy: { bg: 'bg-[#00D4AA]/10', text: 'text-[#00D4AA]', label: 'Facile' },
  medium: { bg: 'bg-[#FFB547]/10', text: 'text-[#FFB547]', label: 'Moyen' },
  hard: { bg: 'bg-[#FF5470]/10', text: 'text-[#FF5470]', label: 'Difficile' },
};

/**
 * Carte de quiz avec titre, score, difficulté et lien.
 */
const QuizCard = ({ quiz, index = 0 }: QuizCardProps) => {
  const difficulty =
  difficultyColors[quiz.difficulty as keyof typeof difficultyColors] ||
  difficultyColors.medium;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A]/80 backdrop-blur-sm transition-all hover:border-[#6C63FF]/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
            <Brain className="h-6 w-6 text-[#6C63FF]" />
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${difficulty.bg} ${difficulty.text}`}>
            {difficulty.label}
          </span>
        </div>

        {/* Titre */}
        <h3 className="mb-1 text-sm font-semibold text-[#F0F0F8] line-clamp-2">
          {quiz.title}
        </h3>
        <p className="mb-3 text-xs text-[#8888AA]">
          {quiz.documentTitle}
        </p>

        {/* Infos */}
        <div className="mb-4 flex items-center gap-4 text-xs text-[#8888AA]">
          <span className="flex items-center gap-1">
            <Brain className="h-3.5 w-3.5" />
            {quiz.totalQuestions} questions
          </span>
          {quiz.score !== undefined && (
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-[#FFB547]" />
              {quiz.score}%
            </span>
          )}
          {quiz.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {Math.floor(quiz.duration / 60)}min
            </span>
          )}
        </div>

        <p className="mb-4 text-[10px] text-[#8888AA]">{formatDate(quiz.createdAt)}</p>

        {/* Action */}
        <Link href={ROUTES.QUIZ_VIEW(quiz.id)}>
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF]/10 py-2.5 text-xs font-medium text-[#6C63FF] transition-colors hover:bg-[#6C63FF]/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {quiz.score !== undefined ? 'Revoir' : 'Commencer'}
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuizCard;
