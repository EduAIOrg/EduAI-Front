/** Représente un document PDF uploadé */
export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  hasSummary: boolean;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/** Options de filtrage/tri des documents */
export interface DocumentFilters {
  sortBy: 'name' | 'date' | 'pages';
  sortOrder: 'asc' | 'desc';
  search?: string;
}

/** Progrès d'upload de document */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/** État du store documents */
export interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  filters: DocumentFilters;
  uploadProgress: UploadProgress | null;
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document | null) => void;
  setFilters: (filters: Partial<DocumentFilters>) => void;
  setUploadProgress: (progress: UploadProgress | null) => void;
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
}
