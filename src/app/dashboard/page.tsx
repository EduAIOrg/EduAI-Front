'use client';

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
import { ROUTES } from '@/constants/routes';
import { formatRelativeDate } from '@/lib/utils';

/** Stats mock data */
const STATS = [
  { label: 'Documents uploadés', value: '12', icon: FileText, color: '#6C63FF', bg: '#6C63FF15' },
  { label: 'Quiz passés', value: '34', icon: Brain, color: '#00D4AA', bg: '#00D4AA15' },
  { label: 'Score moyen', value: '78%', icon: Trophy, color: '#FFB547', bg: '#FFB54715' },
  { label: 'Streak', value: '5 jours 🔥', icon: Flame, color: '#FF5470', bg: '#FF547015' },
];

/** Activité récente mock */
const RECENT_ACTIVITY = [
  { id: '1', type: 'upload', title: 'Cours d\'Algorithmes.pdf', description: 'Document uploadé', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), icon: Upload, color: '#6C63FF' },
  { id: '2', type: 'quiz', title: 'Quiz Structures de données', description: 'Score : 85%', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), icon: Brain, color: '#00D4AA' },
  { id: '3', type: 'chat', title: 'Chat IA — Complexité', description: '12 messages échangés', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), icon: MessageSquare, color: '#FFB547' },
  { id: '4', type: 'translation', title: 'Traduction FR→EN', description: 'Introduction au Machine Learning', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), icon: Languages, color: '#FF5470' },
];

/** Documents récents mock */
const RECENT_DOCS = [
  { id: '1', title: 'Cours d\'Algorithmes.pdf', pages: 48, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: '2', title: 'Base de données relationnelles', pages: 72, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: '3', title: 'Réseaux informatiques — Couche Transport', pages: 34, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

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
          <span className="gradient-text">{user?.name?.split(' ')[0] || 'Étudiant'}</span>{' '}
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
        {STATS.map((stat) => {
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
            {RECENT_DOCS.map((doc, i) => (
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
                      {doc.pages} pages · {formatRelativeDate(doc.createdAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8888AA]" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
        >
          <h2 className="mb-4 text-sm font-semibold text-[#F0F0F8]">Activité récente</h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity, i) => {
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
                    {i < RECENT_ACTIVITY.length - 1 && (
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
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
