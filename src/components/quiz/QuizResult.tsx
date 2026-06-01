'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Clock, RotateCcw, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
/** Type local pour les résultats calculés côté client */
interface QuizResultData {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  recommendations: string[];
}
import { formatDuration } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

interface QuizResultProps {
  result: QuizResultData;
  onRetry?: () => void;
  onReviewErrors?: () => void;
}

/**
 * Écran de résultat final d'un quiz avec score, stats et recommandations.
 */
const QuizResult = ({ result, onRetry, onReviewErrors }: QuizResultProps) => {
  const scoreColor =
    result.score >= 80 ? '#00D4AA' : result.score >= 50 ? '#FFB547' : '#FF5470';

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  return (
    <motion.div
      className="mx-auto max-w-lg text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Score circulaire */}
      <div className="relative mx-auto mb-6 h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="#1E1E2E" strokeWidth="8" />
          <motion.circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke={scoreColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: scoreColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {result.score}%
          </motion.span>
          <span className="text-xs text-[#8888AA]">Score</span>
        </div>
      </div>

      {/* Message */}
      <h2 className="mb-2 text-xl font-bold text-[#F0F0F8]">
        {result.score >= 80 ? 'Excellent travail ! 🎉' : result.score >= 50 ? 'Pas mal ! 💪' : 'Continuez à réviser 📚'}
      </h2>

      {/* Stats */}
      <div className="mb-6 mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#1E1E2E] bg-[#13131A] p-4">
          <Target className="mx-auto mb-2 h-5 w-5 text-[#00D4AA]" />
          <p className="text-lg font-bold text-[#F0F0F8]">{result.correctAnswers}</p>
          <p className="text-[10px] text-[#8888AA]">Correctes</p>
        </div>
        <div className="rounded-xl border border-[#1E1E2E] bg-[#13131A] p-4">
          <Trophy className="mx-auto mb-2 h-5 w-5 text-[#FF5470]" />
          <p className="text-lg font-bold text-[#F0F0F8]">{result.wrongAnswers}</p>
          <p className="text-[10px] text-[#8888AA]">Incorrectes</p>
        </div>
        <div className="rounded-xl border border-[#1E1E2E] bg-[#13131A] p-4">
          <Clock className="mx-auto mb-2 h-5 w-5 text-[#FFB547]" />
          <p className="text-lg font-bold text-[#F0F0F8]">{formatDuration(result.duration)}</p>
          <p className="text-[10px] text-[#8888AA]">Durée</p>
        </div>
      </div>

      {/* Recommandations */}
      {result.recommendations.length > 0 && (
        <div className="mb-6 rounded-xl border border-[#1E1E2E] bg-[#13131A] p-4 text-left">
          <h3 className="mb-3 text-sm font-semibold text-[#F0F0F8]">📋 Recommandations</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#8888AA]">
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#6C63FF]" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {onReviewErrors && (
          <motion.button
            onClick={onReviewErrors}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#1E1E2E] py-3 text-sm font-medium text-[#8888AA] transition-colors hover:bg-[#13131A] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="h-4 w-4" />
            Revoir les erreurs
          </motion.button>
        )}
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6C63FF] py-3 text-sm font-medium text-white transition-colors hover:bg-[#5A52E0]"
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="h-4 w-4" />
            Retenter
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizResult;
