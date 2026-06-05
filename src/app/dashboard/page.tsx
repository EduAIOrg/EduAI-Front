'use client';

import { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Brain,
  Trophy,
  Flame,
  Plus,
  MessageSquare,
  Upload,
  ArrowRight,
  BookOpen,
  Clock,
  Languages,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuiz } from '@/hooks/useQuiz';
import { ROUTES } from '@/constants/routes';
import { formatRelativeDate } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { documents, isLoading: isDocsLoading } = useDocuments();
  const { quizzes, isLoading: isQuizzesLoading } = useQuiz();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const isLoading = isDocsLoading || isQuizzesLoading;

  // Process Stats
  const totalDocs = documents.length;
  const completedQuizzes = quizzes.filter(q => q.last_score !== null && q.last_score !== undefined);
  const totalQuizzes = completedQuizzes.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.last_score || 0), 0) / totalQuizzes)
    : 0;
  
  // Streak based on items count
  const streak = totalDocs > 0 ? `${Math.min(totalDocs + totalQuizzes, 5)} jours 🔥` : '0 jours ❄️';

  const stats = [
    { label: 'Documents uploadés', value: String(totalDocs), icon: FileText, color: '#6C63FF', bg: '#6C63FF15' },
    { label: 'Quiz passés', value: String(totalQuizzes), icon: Brain, color: '#00D4AA', bg: '#00D4AA15' },
    { label: 'Score moyen', value: totalQuizzes > 0 ? `${avgScore}%` : '—', icon: Trophy, color: '#FFB547', bg: '#FFB54715' },
    { label: 'Streak', value: streak, icon: Flame, color: '#FF5470', bg: '#FF547015' },
  ];

  // Process Recent Documents
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const activities: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
  }[] = [];

  documents.forEach(doc => {
    activities.push({
      id: doc.id,
      type: 'upload',
      title: doc.title,
      description: 'Document uploadé',
      createdAt: doc.created_at,
      icon: Upload,
      color: '#6C63FF'
    });
  });

  quizzes.forEach(quiz => {
    if (quiz.last_score !== null && quiz.last_score !== undefined) {
      activities.push({
        id: quiz.id,
        type: 'quiz',
        title: quiz.title,
        description: `Quiz complété — Score : ${quiz.last_score}%`,
        createdAt: quiz.created_at,
        icon: Brain,
        color: '#00D4AA'
      });
    } else {
      activities.push({
        id: quiz.id,
        type: 'quiz_created',
        title: quiz.title,
        description: 'Quiz généré',
        createdAt: quiz.created_at,
        icon: Brain,
        color: '#FFB547'
      });
    }
  });

  const recentActivity = activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de votre tableau de bord..." />
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
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-[#F0F0F8]">
          {greeting},{' '}
          <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Étudiant'}</span>{' '}
          👋
        </h1>
        <p className="mt-1 text-sm text-[#8888AA]">
          Continuez votre apprentissage là où vous vous êtes arrêté.
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5"
              whileHover={{ scale: 1.02, borderColor: stat.color + '40' }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[#F0F0F8]">{stat.value}</p>
              <p className="mt-0.5 text-xs text-[#8888AA]">{stat.label}</p>
              {/* Decorative glow */}
              <div
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-xl"
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-sm font-semibold text-[#8888AA] uppercase tracking-wider">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Uploader un PDF', href: ROUTES.DOCUMENTS, icon: Upload, color: 'from-[#6C63FF] to-[#5A52E0]' },
            { label: 'Nouveau Chat', href: ROUTES.CHAT, icon: MessageSquare, color: 'from-[#00D4AA] to-[#00B896]' },
            { label: 'Créer un Quiz', href: ROUTES.QUIZ, icon: Brain, color: 'from-[#FFB547] to-[#F0A030]' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <motion.button
                  className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${action.color} px-5 py-2.5 text-sm font-medium text-white shadow-lg`}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Documents récents */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#F0F0F8]">Documents récents</h2>
            <Link
              href={ROUTES.DOCUMENTS}
              className="flex items-center gap-1 text-xs text-[#6C63FF] hover:text-[#00D4AA] transition-colors"
            >
              Voir tout
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc, i) => (
                <Link key={doc.id} href={ROUTES.DOCUMENT_VIEW(doc.id)}>
                  <motion.div
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[#0A0A0F]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6C63FF]/10">
                      <FileText className="h-4 w-4 text-[#6C63FF]" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-[#F0F0F8]">{doc.title}</p>
                      <p className="text-xs text-[#8888AA]">
                        {doc.page_count} pages · {formatRelativeDate(doc.created_at)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#8888AA]" />
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-[#8888AA] opacity-50" />
                <p className="mt-2 text-sm text-[#8888AA]">Aucun document récent.</p>
                <Link href={ROUTES.DOCUMENTS} className="mt-2 text-xs text-[#6C63FF] hover:underline">
                  Uploadez votre premier cours
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
        >
          <h2 className="mb-4 text-sm font-semibold text-[#F0F0F8]">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Timeline line */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: activity.color + '15' }}
                      >
                        <Icon className="h-4 w-4" style={{ color: activity.color }} />
                      </div>
                      {i < recentActivity.length - 1 && (
                        <div className="mt-1 h-6 w-px bg-[#1E1E2E]" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F0F0F8]">{activity.title}</p>
                      <p className="text-xs text-[#8888AA]">
                        {activity.description} · {formatRelativeDate(activity.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-[#8888AA] opacity-50" />
                <p className="mt-2 text-sm text-[#8888AA]">Aucune activité récente.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
