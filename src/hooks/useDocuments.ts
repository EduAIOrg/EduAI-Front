'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useDocumentStore } from '@/store/documentStore';
import { Document } from '@/types/document';

/**
 * Hook pour la gestion des documents PDF.
 * Fournit le CRUD complet avec upload progressif et résumés.
 */
export const useDocuments = () => {
  const queryClient = useQueryClient();
  const { setUploadProgress } = useDocumentStore();

  /** Récupère la liste des documents */
  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: async (): Promise<Document[]> => {
      const { data } = await api.get('/api/documents');
      return data.data;
    },
  });

  /** Upload d'un document avec progression */
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<Document> => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const loaded = progressEvent.loaded;
          setUploadProgress({
            loaded,
            total,
            percentage: Math.round((loaded * 100) / total),
          });
        },
      });

      return data.data;
    },
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploadProgress(null);
      toast.success(`"${doc.title}" uploadé avec succès !`);
    },
    onError: () => {
      setUploadProgress(null);
      toast.error("Erreur lors de l'upload du document.");
    },
  });

  /** Supprime un document */
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document supprimé.');
    },
  });

  /** Récupère le résumé d'un document */
  const useDocumentSummary = (id: string) =>
    useQuery({
      queryKey: ['documents', id, 'summary'],
      queryFn: async (): Promise<string> => {
        const { data } = await api.get(`/api/documents/${id}/summary`);
        return data.data;
      },
      enabled: !!id,
    });

  return {
    documents: documentsQuery.data ?? [],
    isLoading: documentsQuery.isLoading,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    useDocumentSummary,
    refetch: documentsQuery.refetch,
  };
};
