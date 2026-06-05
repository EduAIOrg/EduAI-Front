'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Quiz } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/constants/routes';

/** Récupère un quiz par ID */
const useQuizById = (id: string) =>
  useQuery({
    queryKey: ['quizzes', id],
    queryFn: async (): Promise<Quiz> => {
      const { data } = await api.get(`/api/quiz/${id}`);
      return data;
    },
    enabled: !!id,
  });

/** Quiz de démonstration */
const DEMO_QUIZ: Quiz = {
  id: 'demo',
  title: 'Quiz démo — Algorithmes',
  document_id: '1',
  user_id: 'demo',
  difficulty: 'medium',
  quiz_type: 'mcq',
  status: 'ready',
  created_at: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      quiz_id: 'demo',
      content: 'Quelle est la complexité temporelle du tri fusion (Merge Sort) dans le pire des cas ?',
      question_type: 'mcq',
      order_index: 0,
      options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'],
    },
    {
      id: 'q2',
      quiz_id: 'demo',
      content: 'Quelle structure de données utilise le principe LIFO (Last In, First Out) ?',
      question_type: 'mcq',
      order_index: 1,
      options: ['File (Queue)', 'Liste chaînée', 'Pile (Stack)', 'Tableau dynamique'],
    },
    {
      id: 'q3',
      quiz_id: 'demo',
      content: 'Qu\'est-ce qu\'un arbre binaire de recherche (ABR) ?',
      question_type: 'mcq',
      order_index: 2,
      options: [
        'Un arbre où chaque nœud a exactement 2 enfants',
        'Un arbre où les valeurs gauches < nœud < valeurs droites',
        'Un arbre équilibré à chaque niveau',
        'Un arbre dont la hauteur est log n',
      ],
    },
  ],
};

export default function QuizViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const { data: quizData, isLoading } = useQuizById(id);
  const { submitQuiz, isSubmitting } = useQuiz();

  const quiz =
  quizData && Array.isArray(quizData.questions)
    ? quizData
    : DEMO_QUIZ;

const questions = quiz.questions ?? [];

const currentQuestion = questions[currentIndex];

  const handleAnswer = async (answer: string) => {
    const questionId = currentQuestion.id;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Feedback local pour l'affichage immédiat
    const selectedIdx = answer.charCodeAt(0) - 65;
    const fb = {
      isCorrect: false, // Will be determined by backend on submit
      explanation: 'La réponse sera vérifiée à la soumission finale.',
    };
    setFeedbacks((prev) => ({ ...prev, [questionId]: fb }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setEndTime(Date.now());
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFeedbacks({});
    setEndTime(null);
    setIsFinished(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du quiz..." />
      </div>
    );
  }

  /** Calcule le score final */
  const correctCount = Object.values(feedbacks).filter((f) => f.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const duration = endTime ? Math.round((endTime - startTime) / 1000) : 0;

  const result = {
    quizId: quiz.id,
    score,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    wrongAnswers: questions.length - correctCount,
    duration,
    recommendations:
      score < 60
        ? ['Relisez le chapitre sur les algorithmes', 'Refaites ce quiz après révision']
        : ['Excellent ! Essayez un quiz de niveau Difficile'],
    questions,
  };

  if (!currentQuestion) {
  return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-sm text-[#8888AA]">
        Impossible de charger les questions du quiz.
      </p>
    </div>
  );
}

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href={ROUTES.QUIZ}>
          <motion.button
            className="rounded-xl p-2 text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#F0F0F8]">{quiz.title}</h1>
          <p className="text-xs text-[#8888AA]">{quiz.quiz_type === 'mcq' ? 'QCM' : quiz.quiz_type === 'open' ? 'Questions ouvertes' : 'Mixte'}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizResult result={result} onRetry={handleRetry} />
          </motion.div>
        ) : (
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              isSubmitting={isSubmitting}
              feedback={feedbacks[currentQuestion.id] ?? null}
            />

            {/* Next button — visible after answering */}
            {feedbacks[currentQuestion.id] && (
              <motion.div
                className="mt-6 flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-6 py-3 text-sm font-semibold text-white"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {currentIndex < questions.length - 1 ? (
                    <>Question suivante <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>Voir les résultats <Trophy className="h-4 w-4" /></>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
