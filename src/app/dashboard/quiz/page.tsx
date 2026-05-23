'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { useDocuments } from '@/hooks/useDocuments';
import QuizCard from '@/components/quiz/QuizCard';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';

/** Skeleton loader pour les cartes quiz */
const QuizSkeleton = () => (
  <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5">
    <div className="mb-4 flex justify-between">
      <div className="skeleton h-12 w-12 rounded-xl" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="mb-2 skeleton h-4 w-3/4 rounded" />
    <div className="mb-4 skeleton h-3 w-1/2 rounded" />
    <div className="skeleton h-9 w-full rounded-xl" />
  </div>
);

export default function QuizPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const { quizzes, isLoading, generateQuiz, isGenerating } = useQuiz();
  const { documents } = useDocuments();

  return (
    <div>
      <PageHeader
        title="Quiz"
        description="Testez vos connaissances et identifiez vos lacunes"
        icon={<Brain className='h-5 w-5'/>}
        action={
          <motion.button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="h-4 w-4" />
            Générer un quiz
          </motion.button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <QuizSkeleton key={i} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="Aucun quiz"
          description="Générez votre premier quiz à partir d'un document PDF pour tester vos connaissances."
          action={{ label: 'Générer un quiz', onClick: () => setShowGenerator(true) }}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
        >
          {quizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </motion.div>
      )}

      <QuizGenerator
        documents={documents}
        onGenerate={(opts) => {
          generateQuiz(opts);
          setShowGenerator(false);
        }}
        isGenerating={isGenerating}
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
      />
    </div>
  );
}
