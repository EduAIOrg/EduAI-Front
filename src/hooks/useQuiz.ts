'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  Quiz,
  QuizListItem,
  QuizResult,
  QuizCreateRequest,
  QuizSubmitRequest,
  QuizStatusResponse,
} from '@/types/quiz';

/**
 * Hook pour la gestion des quiz.
 * Permet de générer, lister, passer et consulter les résultats des quiz.
 * 
 * Endpoints backend :
 * - GET  /api/quiz/                → liste des quiz
 * - POST /api/quiz/generate        → générer un quiz
 * - GET  /api/quiz/{id}            → détails d'un quiz avec questions
 * - GET  /api/quiz/{id}/status     → statut de génération
 * - POST /api/quiz/{id}/submit     → soumettre toutes les réponses
 * - GET  /api/quiz/{id}/results    → résultats du quiz
 */
export const useQuiz = () => {
  const queryClient = useQueryClient();

  /** Récupère la liste des quiz */
  const quizzesQuery = useQuery({
    queryKey: ['quizzes'],
    queryFn: async (): Promise<QuizListItem[]> => {
      const { data } = await api.get('/api/quiz/');
      return data;
    },
  });

  /** Récupère un quiz complet avec ses questions */
  const useQuizDetail = (quizId: string) =>
    useQuery({
      queryKey: ['quizzes', quizId],
      queryFn: async (): Promise<Quiz> => {
        const { data } = await api.get(`/api/quiz/${quizId}`);
        return data;
      },
      enabled: !!quizId,
    });

  /** Vérifie le statut de génération d'un quiz */
  const useQuizStatus = (quizId: string, enabled = true) =>
    useQuery({
      queryKey: ['quizzes', quizId, 'status'],
      queryFn: async (): Promise<QuizStatusResponse> => {
        const { data } = await api.get(`/api/quiz/${quizId}/status`);
        return data;
      },
      enabled: !!quizId && enabled,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === 'generating' ? 3000 : false;
      },
    });

  /** Génère un nouveau quiz */
  const generateMutation = useMutation({
    mutationFn: async (options: QuizCreateRequest): Promise<Quiz> => {
      const { data } = await api.post('/api/quiz/generate', options);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz en cours de génération...');
    },
    onError: () => {
      toast.error('Erreur lors de la génération du quiz.');
    },
  });

  /** Soumet toutes les réponses d'un quiz */
  const submitMutation = useMutation({
    mutationFn: async ({
      quizId,
      submission,
    }: {
      quizId: string;
      submission: QuizSubmitRequest;
    }): Promise<QuizResult> => {
      const { data } = await api.post(`/api/quiz/${quizId}/submit`, submission);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz soumis avec succès !');
    },
    onError: () => {
      toast.error('Erreur lors de la soumission du quiz.');
    },
  });

  /** Récupère les résultats d'un quiz */
  const useQuizResults = (quizId: string) =>
    useQuery({
      queryKey: ['quizzes', quizId, 'results'],
      queryFn: async (): Promise<QuizResult[]> => {
        const { data } = await api.get(`/api/quiz/${quizId}/results`);
        return data;
      },
      enabled: !!quizId,
    });

  return {
    quizzes: quizzesQuery.data ?? [],
    isLoading: quizzesQuery.isLoading,
    generateQuiz: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    submitQuiz: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    useQuizDetail,
    useQuizStatus,
    useQuizResults,
    refetch: quizzesQuery.refetch,
  };
};
