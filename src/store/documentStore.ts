'use client';

import { create } from 'zustand';
import { DocumentState, Document, DocumentFilters, UploadProgress } from '@/types/document';

/**
 * Store Zustand pour la gestion des documents PDF.
 * Gère la liste, la sélection, les filtres et la progression d'upload.
 */
export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  selectedDocument: null,
  filters: {
    sortBy: 'date',
    sortOrder: 'desc',
  },
  uploadProgress: null,

  setDocuments: (documents: Document[]) => set({ documents }),

  setSelectedDocument: (selectedDocument: Document | null) => set({ selectedDocument }),

  setFilters: (filters: Partial<DocumentFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setUploadProgress: (uploadProgress: UploadProgress | null) => set({ uploadProgress }),

  addDocument: (document: Document) =>
    set((state) => ({
      documents: [document, ...state.documents],
    })),

  removeDocument: (id: string) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
}));
