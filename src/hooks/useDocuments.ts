'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useDocumentStore } from '@/store/documentStore';
import { Document, DocumentSummaryResponse, DocumentStatusResponse } from '@/types/document';

/**
 * Hook pour la gestion des documents PDF.
 * Fournit le CRUD complet avec upload progressif et résumés.
 * 
 * Endpoints backend :
 * - GET /api/documents/          → liste des documents
 * - POST /api/documents/         → upload (multipart/form-data)
 * - GET /api/documents/{id}      → détails document
 * - GET /api/documents/{id}/status  → statut de traitement
 * - GET /api/documents/{id}/summary → résumé du document
 * - DELETE /api/documents/{id}   → suppression
 */
export const useDocuments = () => {
  const queryClient = useQueryClient();
  const { setUploadProgress } = useDocumentStore();

  /** Récupère la liste des documents */
  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: async (): Promise<Document[]> => {
      const { data } = await api.get('/api/documents/');
      return data;
    },
  });

  /** Récupère un document par ID */
  const useDocument = (id: string) =>
    useQuery({
      queryKey: ['documents', id],
      queryFn: async (): Promise<Document> => {
        const { data } = await api.get(`/api/documents/${id}`);
        return data;
      },
      enabled: !!id,
    });

  /** Upload d'un document avec progression */
  const uploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File; title?: string }): Promise<Document> => {
      const formData = new FormData();
      formData.append('file', file);
      if (title) {
        formData.append('title', title);
      }

      const { data } = await api.post('/api/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 0;
          const loaded = progressEvent.loaded;
          setUploadProgress({
            loaded,
            total,
            percentage: total > 0 ? Math.round((loaded * 100) / total) : 0,
          });
        },
      });

      return data;
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

  /** Vérifie le statut de traitement d'un document */
  const useDocumentStatus = (id: string, enabled = true) =>
    useQuery({
      queryKey: ['documents', id, 'status'],
      queryFn: async (): Promise<DocumentStatusResponse> => {
        const { data } = await api.get(`/api/documents/${id}/status`);
        return data;
      },
      enabled: !!id && enabled,
      refetchInterval: (query) => {
        // Polling toutes les 3 secondes tant que le document est en traitement
        const status = query.state.data?.status;
        return status === 'processing' || status === 'uploading' ? 3000 : false;
      },
    });

  /** Récupère le résumé d'un document */
  const useDocumentSummary = (id: string) =>
    useQuery({
      queryKey: ['documents', id, 'summary'],
      queryFn: async (): Promise<DocumentSummaryResponse> => {
        const { data } = await api.get(`/api/documents/${id}/summary`);
        return data;
      },
      enabled: !!id,
    });

  return {
    documents: documentsQuery.data ?? [],
    isLoading: documentsQuery.isLoading,
    uploadDocument: (file: File, title?: string) => uploadMutation.mutate({ file, title }),
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    useDocument,
    useDocumentStatus,
    useDocumentSummary,
    refetch: documentsQuery.refetch,
  };
};
