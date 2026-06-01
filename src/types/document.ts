/** Statut de traitement d'un document */
export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';

/** Représente un document PDF uploadé (aligné avec DocumentResponse backend) */
export interface Document {
  id: string;
  user_id: string;
  title: string;
  filename: string;
  file_size: number;
  page_count: number;
  status: DocumentStatus;
  summary?: string | null;
  chroma_collection_id?: string | null;
  created_at: string;
}

/** Réponse de statut de traitement */
export interface DocumentStatusResponse {
  status: DocumentStatus;
  progress_message: string;
}

/** Réponse de résumé de document */
export interface DocumentSummaryResponse {
  summary: string | null;
  status: DocumentStatus;
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
