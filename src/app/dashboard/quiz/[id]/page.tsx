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
      return data.data;
    },
    enabled: !!id,
  });

/** Quiz de démonstration */
const DEMO_QUIZ: Quiz = {
  id: 'demo',
  title: 'Quiz démo — Algorithmes',
  documentId: '1',
  documentTitle: 'Cours d\'Algorithmes.pdf',
  difficulty: 'medium',
  type: 'mcq',
  totalQuestions: 3,
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      question: 'Quelle est la complexité temporelle du tri fusion (Merge Sort) dans le pire des cas ?',
      type: 'mcq',
      explanation: 'Le tri fusion divise le tableau en deux à chaque étape (log n) et fusionne en O(n), donnant O(n log n).',
      options: [
        { id: 'a', text: 'O(n²)', isCorrect: false },
        { id: 'b', text: 'O(n log n)', isCorrect: true },
        { id: 'c', text: 'O(log n)', isCorrect: false },
        { id: 'd', text: 'O(n)', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      question: 'Quelle structure de données utilise le principe LIFO (Last In, First Out) ?',
      type: 'mcq',
      explanation: 'Une Pile (Stack) suit le principe LIFO : le dernier élément ajouté est le premier à être retiré.',
      options: [
        { id: 'a', text: 'File (Queue)', isCorrect: false },
        { id: 'b', text: 'Liste chaînée', isCorrect: false },
        { id: 'c', text: 'Pile (Stack)', isCorrect: true },
        { id: 'd', text: 'Tableau dynamique', isCorrect: false },
      ],
    },
    {
      id: 'q3',
      question: 'Qu\'est-ce qu\'un arbre binaire de recherche (ABR) ?',
      type: 'mcq',
      explanation: 'Dans un ABR, pour chaque nœud, tous les nœuds du sous-arbre gauche sont inférieurs et tous ceux du sous-arbre droit sont supérieurs.',
      options: [
        { id: 'a', text: 'Un arbre où chaque nœud a exactement 2 enfants', isCorrect: false },
        { id: 'b', text: 'Un arbre où les valeurs gauches < nœud < valeurs droites', isCorrect: true },
        { id: 'c', text: 'Un arbre équilibré à chaque niveau', isCorrect: false },
        { id: 'd', text: 'Un arbre dont la hauteur est log n', isCorrect: false },
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
  const [startTime] = useState(Date.now());

  const { data: quizData, isLoading } = useQuizById(id);
  const { submitAnswer, isSubmitting } = useQuiz();

  const quiz =
  quizData && Array.isArray(quizData.questions)
    ? quizData
    : DEMO_QUIZ;

const questions = quiz.questions ?? [];

const currentQuestion = questions[currentIndex];

  const handleAnswer = async (answer: string) => {
    const questionId = currentQuestion.id;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Demo feedback (appel API réel en prod)
    const isCorrect = currentQuestion.options
      ? currentQuestion.options.find((o) => o.id === answer)?.isCorrect ?? false
      : true;

    const fb = {
      isCorrect,
      explanation: currentQuestion.explanation,
    };
    setFeedbacks((prev) => ({ ...prev, [questionId]: fb }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFeedbacks({});
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
  const duration = Math.round((Date.now() - startTime) / 1000);

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
          <p className="text-xs text-[#8888AA]">{quiz.documentTitle}</p>
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
