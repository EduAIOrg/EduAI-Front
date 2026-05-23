'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Quiz, QuizResult, GenerateQuizOptions } from '@/types/quiz';

/**
 * Hook pour la gestion des quiz.
 * Permet de générer, lister, passer et consulter les résultats des quiz.
 */
export const useQuiz = () => {
  const queryClient = useQueryClient();

  /** Récupère la liste des quiz */
  const quizzesQuery = useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<Quiz[]> => {
      const { data } = await api.get('/api/quiz');
      return data.data;
    },
  });

  /** Génère un nouveau quiz */
  const generateMutation = useMutation({
    mutationFn: async (options: GenerateQuizOptions): Promise<Quiz> => {
      const { data } = await api.post('/api/quiz/generate', options);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz généré avec succès !');
    },
    onError: () => {
      toast.error('Erreur lors de la génération du quiz.');
    },
  });

  /** Soumet une réponse à une question */
  const submitAnswerMutation = useMutation({
    mutationFn: async ({
      quizId,
      questionId,
      answer,
    }: {
      quizId: string;
      questionId: string;
      answer: string;
    }): Promise<{ isCorrect: boolean; explanation: string }> => {
      const { data } = await api.post(`/api/quiz/${quizId}/answer`, {
        questionId,
        answer,
      });
      return data.data;
    },
  });

  /** Récupère les résultats d'un quiz */
  const useQuizResults = (quizId: string) =>
    useQuery({
      queryKey: ['quizzes', quizId, 'results'],
      queryFn: async (): Promise<QuizResult> => {
        const { data } = await api.get(`/api/quiz/${quizId}/results`);
        return data.data;
      },
      enabled: !!quizId,
    });

  return {
    quizzes: quizzesQuery.data ?? [],
    isLoading: quizzesQuery.isLoading,
    generateQuiz: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    submitAnswer: submitAnswerMutation.mutateAsync,
    isSubmitting: submitAnswerMutation.isPending,
    useQuizResults,
  };
};
