'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Trophy, BookOpen, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import ProgressChart from '@/components/progress/ProgressChart';
import LacuneCard from '@/components/progress/LacuneCard';
import { formatDate, formatDuration } from '@/lib/utils';
import { ProgressData, Lacune } from '@/types/api';

/** Données de progression mock */
const MOCK_PROGRESS: ProgressData[] = [
  { date: '17/05', score: 45 },
  { date: '18/05', score: 58 },
  { date: '19/05', score: 52 },
  { date: '20/05', score: 67 },
  { date: '21/05', score: 73 },
  { date: '22/05', score: 80 },
  { date: '23/05', score: 78 },
];

/** Lacunes mock */
const MOCK_LACUNES: Lacune[] = [
  {
    id: '1',
    subject: 'Algorithmique',
    topic: 'Complexité temporelle',
    masteryLevel: 35,
    description: 'Difficulté à analyser la complexité des algorithmes récursifs.',
    recommendedQuizId: 'demo',
  },
  {
    id: '2',
    subject: 'Base de données',
    topic: 'Jointures SQL',
    masteryLevel: 55,
    description: 'Les JOIN complexes (LEFT, RIGHT, FULL OUTER) nécessitent encore de la pratique.',
    recommendedQuizId: 'demo',
  },
  {
    id: '3',
    subject: 'Réseaux',
    topic: 'Protocole TCP/IP',
    masteryLevel: 70,
    description: 'Bonne compréhension générale, mais les sockets restent à approfondir.',
    recommendedQuizId: 'demo',
  },
];

/** Historique de quiz mock */
const MOCK_QUIZ_HISTORY = [
  { id: '1', title: 'Structures de données', score: 85, date: '2026-05-22T14:30:00Z', duration: 720 },
  { id: '2', title: 'SQL avancé', score: 62, date: '2026-05-21T10:15:00Z', duration: 540 },
  { id: '3', title: 'Algorithmes de tri', score: 78, date: '2026-05-20T16:45:00Z', duration: 900 },
  { id: '4', title: 'Réseaux — Couche transport', score: 91, date: '2026-05-19T09:00:00Z', duration: 480 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProgressPage() {
  const globalScore = 72;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (globalScore / 100) * circumference;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <PageHeader
        title="Mes Progrès"
        description="Suivez votre évolution et identifiez vos lacunes"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      {/* Score global + Stats */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 lg:grid-cols-[auto,1fr]"
      >
        {/* Score circulaire */}
        <div className="flex items-center justify-center rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-8">
          <div className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              {/* Track */}
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1E1E2E" strokeWidth="8" />
              {/* Progress */}
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-bold gradient-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {globalScore}%
              </motion.span>
              <span className="text-xs text-[#8888AA]">Score global</span>
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Quiz passés', value: '34', icon: Trophy, color: '#FFB547' },
            { label: 'Temps d\'étude', value: '12h', icon: Clock, color: '#6C63FF' },
            { label: 'Documents', value: '12', icon: BookOpen, color: '#00D4AA' },
            { label: 'Streak', value: '5 🔥', icon: TrendingUp, color: '#FF5470' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="flex flex-col justify-between rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5"
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: stat.color + '15' }}
                >
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-[#F0F0F8]">{stat.value}</p>
                <p className="text-xs text-[#8888AA]">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div variants={itemVariants}>
        <ProgressChart data={MOCK_PROGRESS} />
      </motion.div>

      {/* Lacunes */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-base font-semibold text-[#F0F0F8]">
          🎯 Lacunes détectées
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_LACUNES.map((lacune, i) => (
            <LacuneCard key={lacune.id} lacune={lacune} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Historique quiz */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-base font-semibold text-[#F0F0F8]">📋 Historique des quiz</h2>
        <div className="overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E2E] text-left">
                <th className="px-6 py-3 text-xs font-medium text-[#8888AA]">Quiz</th>
                <th className="px-6 py-3 text-xs font-medium text-[#8888AA]">Score</th>
                <th className="hidden px-6 py-3 text-xs font-medium text-[#8888AA] sm:table-cell">Durée</th>
                <th className="hidden px-6 py-3 text-xs font-medium text-[#8888AA] md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_QUIZ_HISTORY.map((quiz, i) => (
                <motion.tr
                  key={quiz.id}
                  className="border-b border-[#1E1E2E]/50 transition-colors hover:bg-[#0A0A0F]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <td className="px-6 py-4 font-medium text-[#F0F0F8]">{quiz.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          quiz.score >= 80
                            ? '#00D4AA15'
                            : quiz.score >= 60
                            ? '#FFB54715'
                            : '#FF547015',
                        color:
                          quiz.score >= 80
                            ? '#00D4AA'
                            : quiz.score >= 60
                            ? '#FFB547'
                            : '#FF5470',
                      }}
                    >
                      {quiz.score}%
                    </span>
                  </td>
                  <td className="hidden px-6 py-4 text-[#8888AA] sm:table-cell">
                    {formatDuration(quiz.duration)}
                  </td>
                  <td className="hidden px-6 py-4 text-[#8888AA] md:table-cell">
                    {formatDate(quiz.date)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recommandations IA */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[#6C63FF]/20 bg-gradient-to-br from-[#6C63FF]/5 to-[#00D4AA]/5 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-[#F0F0F8]">Recommandations personnalisées</h2>
          <span className="ml-auto rounded-full bg-[#6C63FF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C63FF]">
            IA
          </span>
        </div>
        <ul className="space-y-3">
          {[
            'Concentrez-vous sur la complexité algorithmique : c\'est votre lacune principale.',
            'Vous progressez bien en SQL ! Passez maintenant aux requêtes imbriquées.',
            'Votre streak de 5 jours est excellent. Maintenez ce rythme pour consolider vos acquis.',
          ].map((rec, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-sm text-[#8888AA]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="mt-0.5 shrink-0 text-[#6C63FF]">→</span>
              {rec}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
