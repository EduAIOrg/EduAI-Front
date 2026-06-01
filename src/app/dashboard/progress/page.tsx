'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Trophy, BookOpen, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ProgressChart from '@/components/progress/ProgressChart';
import LacuneCard from '@/components/progress/LacuneCard';
import { formatDate, formatDuration } from '@/lib/utils';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuiz } from '@/hooks/useQuiz';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProgressPage() {
  const { documents, isLoading: isDocsLoading } = useDocuments();
  const { quizzes, isLoading: isQuizzesLoading } = useQuiz();

  const isLoading = isDocsLoading || isQuizzesLoading;

  // Process data
  const totalDocs = documents.length;
  const completedQuizzes = quizzes
    .filter(q => q.last_score !== null && q.last_score !== undefined)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  const totalQuizzes = completedQuizzes.length;
  
  const globalScore = totalQuizzes > 0
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.last_score || 0), 0) / totalQuizzes)
    : 0;

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (globalScore / 100) * circumference;

  // Study time approximation (estimating 1 minute per question)
  const totalStudyMinutes = completedQuizzes.reduce((acc, q) => acc + (q.question_count || 10), 0);
  const studyTimeString = totalStudyMinutes >= 60 
    ? `${Math.round(totalStudyMinutes / 60)}h` 
    : `${totalStudyMinutes}m`;

  const streak = totalDocs > 0 ? `${Math.min(totalDocs + totalQuizzes, 5)} 🔥` : '0 ❄️';

  const stats = [
    { label: 'Quiz passés', value: String(totalQuizzes), icon: Trophy, color: '#FFB547' },
    { label: "Temps d'étude", value: studyTimeString, icon: Clock, color: '#6C63FF' },
    { label: 'Documents', value: String(totalDocs), icon: BookOpen, color: '#00D4AA' },
    { label: 'Streak', value: streak, icon: TrendingUp, color: '#FF5470' },
  ];

  // Dynamic Progress Chart Data
  const progressData = completedQuizzes.length > 0
    ? completedQuizzes.map(q => ({
        date: new Date(q.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        score: q.last_score || 0,
      }))
    : [{ date: 'Début', score: 0 }];

  // Dynamic Lacunes
  const lacunes = quizzes
    .filter(q => q.last_score !== null && q.last_score !== undefined && q.last_score < 80)
    .map((q) => ({
      id: q.id,
      subject: q.title.split('—')[0] || 'Quiz',
      topic: 'Concepts clés du document',
      masteryLevel: q.last_score || 0,
      description: `Score de ${q.last_score}% obtenu. Révisez le document associé pour combler cette lacune.`,
      recommendedQuizId: q.id,
    }));

  // Dynamic Quiz History
  const quizHistory = [...completedQuizzes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(q => ({
      id: q.id,
      title: q.title,
      score: q.last_score || 0,
      date: q.created_at,
      duration: q.time_spent || 600,
    }));

  // Dynamic IA Recommendations
  const recommendations = [];
  if (totalDocs === 0) {
    recommendations.push("Uploadez votre premier document de cours pour lancer l'analyse pédagogique par l'IA.");
  } else if (totalQuizzes === 0) {
    recommendations.push("Générez et passez votre premier quiz à partir de vos documents pour évaluer vos connaissances.");
  } else {
    if (globalScore >= 80) {
      recommendations.push("Excellent niveau général ! Vous maîtrisez vos sujets actuels. Continuez à uploader de nouveaux documents.");
    } else if (globalScore >= 60) {
      recommendations.push("Bonne progression globale. Concentrez-vous sur les sujets avec un score inférieur à 70% pour consolider vos acquis.");
    } else {
      recommendations.push("Nous vous recommandons de relire attentivement les résumés générés par l'IA avant de repasser les quiz.");
    }
    if (totalQuizzes > 0) {
      recommendations.push("Votre régularité est excellente ! Maintenez ce rythme quotidien d'apprentissage.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de vos statistiques..." />
      </div>
    );
  }

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
          {stats.map((stat) => {
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
        <ProgressChart data={progressData} />
      </motion.div>

      {/* Lacunes */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-base font-semibold text-[#F0F0F8]">
          🎯 Lacunes détectées
        </h2>
        {lacunes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lacunes.map((lacune, i) => (
              <LacuneCard key={lacune.id} lacune={lacune} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-8 text-center">
            <Trophy className="h-8 w-8 text-[#00D4AA] opacity-80" />
            <p className="mt-2 text-sm text-[#8888AA]">Aucune lacune détectée. Excellent travail ! 🎉</p>
          </div>
        )}
      </motion.div>

      {/* Historique quiz */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-base font-semibold text-[#F0F0F8]">📋 Historique des quiz</h2>
        {quizHistory.length > 0 ? (
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
                {quizHistory.map((quiz, i) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-8 text-center">
            <AlertCircle className="h-8 w-8 text-[#8888AA] opacity-50" />
            <p className="mt-2 text-sm text-[#8888AA]">Aucun quiz passé pour le moment.</p>
          </div>
        )}
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
          {recommendations.map((rec, i) => (
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
