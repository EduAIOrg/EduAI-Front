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
  const [reviewMode, setReviewMode] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    duration: number;
    recommendations: string[];
  } | null>(null);

  const { data: quizData, isLoading } = useQuizById(id);
  const { submitQuiz, isSubmitting } = useQuiz();

  const quiz =
    quizData && Array.isArray(quizData.questions)
      ? quizData
      : DEMO_QUIZ;

  const questions = quiz.questions ?? [];
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (reviewMode) return;
    const questionId = currentQuestion.id;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    if (reviewMode) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Return to result screen
        setReviewMode(false);
        setIsFinished(true);
      }
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const finalEndTime = Date.now();
      setEndTime(finalEndTime);
      const timeSpent = Math.round((finalEndTime - startTime) / 1000);

      if (quiz.id === 'demo') {
        const correctAnswers = 2; // Demo mock
        const wrongAnswers = questions.length - correctAnswers;
        const score = Math.round((correctAnswers / questions.length) * 100);
        
        setQuizResult({
          score,
          correctAnswers,
          wrongAnswers,
          duration: timeSpent,
          recommendations: ['Excellent ! Essayez un quiz de niveau Difficile'],
        });
        setIsFinished(true);
      } else {
        try {
          const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
            question_id: qId,
            answer: ans,
          }));

          const res = await submitQuiz({
            quizId: quiz.id,
            submission: {
              answers: formattedAnswers,
              time_spent: timeSpent,
            },
          });

          const correctCount = res.answer_feedback.filter((f) => f.is_correct).length;
          const wrongCount = res.answer_feedback.length - correctCount;
          const percentageScore = Math.round(res.score * 100);

          const recs: string[] = [];
          if (res.lacunes && res.lacunes.length > 0) {
            res.lacunes.forEach((lac) => {
              if (lac.recommendations) {
                recs.push(...lac.recommendations);
              }
            });
          }
          if (recs.length === 0) {
            recs.push(
              percentageScore < 60
                ? 'Relisez les chapitres correspondants aux lacunes identifiées.'
                : 'Excellent travail ! Vous maîtrisez parfaitement ces notions.'
            );
          }

          setQuizResult({
            score: percentageScore,
            correctAnswers: correctCount,
            wrongAnswers: wrongCount,
            duration: timeSpent,
            recommendations: recs,
          });

          const newFeedbacks: Record<string, { isCorrect: boolean; explanation: string }> = {};
          res.answer_feedback.forEach((f) => {
            newFeedbacks[f.question_id] = {
              isCorrect: f.is_correct,
              explanation: f.feedback || `Bonne réponse : ${f.correct_answer}`,
            };
          });
          setFeedbacks(newFeedbacks);
          setIsFinished(true);
        } catch (error) {
          console.error('Failed to submit quiz:', error);
        }
      }
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFeedbacks({});
    setEndTime(null);
    setQuizResult(null);
    setIsFinished(false);
    setReviewMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du quiz..." />
      </div>
    );
  }

  const duration = endTime ? Math.round((endTime - startTime) / 1000) : 0;

  const result = quizResult || {
    quizId: quiz.id,
    score: 0,
    totalQuestions: questions.length,
    correctAnswers: 0,
    wrongAnswers: questions.length,
    duration,
    recommendations: ['Une erreur est survenue lors du calcul des résultats.'],
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
          <p className="text-xs text-[#8888AA]">
            {quiz.quiz_type === 'mcq' ? 'QCM' : quiz.quiz_type === 'open' ? 'Questions ouvertes' : 'Mixte'}
            {reviewMode && ' • Mode correction'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFinished && !reviewMode ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizResult
              result={{
                quizId: quiz.id,
                score: result.score,
                totalQuestions: questions.length,
                correctAnswers: result.correctAnswers,
                wrongAnswers: result.wrongAnswers,
                duration: result.duration,
                recommendations: result.recommendations,
              }}
              onRetry={handleRetry}
              onReviewErrors={() => {
                setReviewMode(true);
                setCurrentIndex(0);
              }}
            />
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
              question={{
                ...currentQuestion,
                userAnswer: answers[currentQuestion.id],
              }}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              isSubmitting={isSubmitting}
              feedback={feedbacks[currentQuestion.id] ?? null}
            />

            {/* Next button — visible after answering or in review mode */}
            {(answers[currentQuestion.id] !== undefined || reviewMode) && (
              <motion.div
                className="mt-6 flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {reviewMode ? (
                  <motion.button
                    onClick={() => {
                      setReviewMode(false);
                      setIsFinished(true);
                    }}
                    className="rounded-xl border border-[#1E1E2E] px-6 py-3 text-sm font-semibold text-[#8888AA] hover:text-[#F0F0F8]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Retour aux résultats
                  </motion.button>
                ) : (
                  <div />
                )}
                <motion.button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-6 py-3 text-sm font-semibold text-white"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {currentIndex < questions.length - 1 ? (
                    <>Question suivante <ChevronRight className="h-4 w-4" /></>
                  ) : reviewMode ? (
                    <>Fin de la correction</>
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
