'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Search, FileText, Brain, MessageSquare, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuiz } from '@/hooks/useQuiz';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HistoryPage() {
  const { documents, isLoading: isDocsLoading } = useDocuments();
  const { quizzes, isLoading: isQuizzesLoading } = useQuiz();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'document' | 'quiz'>('all');

  const isLoading = isDocsLoading || isQuizzesLoading;

  // Combine data
  const combinedHistory = [
    ...documents.map((doc) => ({
      id: doc.id,
      type: 'document' as const,
      title: doc.title || doc.filename,
      subtitle: `${doc.file_size ? Math.round(doc.file_size / 1024) : 0} KB`,
      date: doc.created_at,
    })),
    ...quizzes.map((q) => ({
      id: q.id,
      type: 'quiz' as const,
      title: q.title,
      subtitle: q.last_score !== null && q.last_score !== undefined ? `Score : ${q.last_score}%` : 'Non terminé',
      date: q.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter history
  const filteredHistory = combinedHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de votre historique d'apprentissage..." />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 max-w-4xl"
    >
      <PageHeader
        title="Historique d'activité"
        description="Consultez la liste de vos révisions, documents importés et quiz réalisés"
        icon={<History className="h-5 w-5" />}
      />

      {/* Controls */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-between items-center"
      >
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8888AA]" />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13131A] border border-[#1E1E2E] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {(['all', 'document', 'quiz'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === t
                  ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]'
                  : 'bg-[#13131A] border-[#1E1E2E] text-[#8888AA] hover:border-[#8888AA]/30'
              }`}
            >
              {t === 'all' ? 'Tout' : t === 'document' ? 'Documents' : 'Quiz'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-[#1E1E2E] bg-[#13131A] transition-all hover:border-[#6C63FF]/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    item.type === 'document' ? 'bg-[#00D4AA]/10 text-[#00D4AA]' : 'bg-[#6C63FF]/10 text-[#6C63FF]'
                  }`}
                >
                  {item.type === 'document' ? <FileText className="h-4.5 w-4.5" /> : <Brain className="h-4.5 w-4.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-[#8888AA] mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <span className="text-[10px] text-[#8888AA] shrink-0 font-medium ml-4">
                {formatDate(item.date)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-12 text-center">
            <AlertCircle className="h-8 w-8 text-[#8888AA] opacity-50 mb-2" />
            <p className="text-xs text-[#8888AA]">Aucune activité trouvée correspondant à vos critères.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
