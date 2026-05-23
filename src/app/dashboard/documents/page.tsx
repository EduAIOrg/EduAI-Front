'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Search, SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentUploader from '@/components/documents/DocumentUploader';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import { useDocumentStore } from '@/store/documentStore';

/** Skeleton loader pour les cartes de documents */
const DocumentSkeleton = () => (
  <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-5">
    <div className="mb-4 skeleton h-12 w-12 rounded-xl" />
    <div className="mb-2 skeleton h-4 w-3/4 rounded" />
    <div className="mb-4 skeleton h-3 w-1/2 rounded" />
    <div className="skeleton h-9 w-full rounded-xl" />
  </div>
);

export default function DocumentsPage() {
  const [showUploader, setShowUploader] = useState(false);
  const [search, setSearch] = useState('');
  const { documents, isLoading, uploadDocument, isUploading, deleteDocument } = useDocuments();
  const { filters, setFilters } = useDocumentStore();

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Gérez vos cours et supports de révision"
        icon={<FileText className="h-5 w-5" />}
        action={
          <motion.button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#5A52E0] px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Upload className="h-4 w-4" />
            Uploader un PDF
          </motion.button>
        }
      />

      {/* Upload zone */}
      {showUploader && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DocumentUploader
            onUpload={(file) => {
              uploadDocument(file);
              setShowUploader(false);
            }}
            isUploading={isUploading}
          />
        </motion.div>
      )}

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8888AA]" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#1E1E2E] bg-[#13131A] py-2.5 pl-11 pr-4 text-sm text-[#F0F0F8] placeholder-[#8888AA] outline-none focus:border-[#6C63FF] transition-colors"
            aria-label="Rechercher un document"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as 'name' | 'date' | 'pages' })}
            className="rounded-xl border border-[#1E1E2E] bg-[#13131A] px-4 py-2.5 text-sm text-[#F0F0F8] outline-none focus:border-[#6C63FF]"
            aria-label="Trier par"
          >
            <option value="date">Date</option>
            <option value="name">Nom</option>
            <option value="pages">Pages</option>
          </select>
          <motion.button
            onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            className="rounded-xl border border-[#1E1E2E] bg-[#13131A] px-3 py-2.5 text-[#8888AA] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.95 }}
            aria-label="Changer l'ordre"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <DocumentSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? 'Aucun résultat' : 'Aucun document'}
          description={
            search
              ? `Aucun document ne correspond à "${search}".`
              : 'Uploadez votre premier PDF pour commencer à étudier avec l\'IA.'
          }
          action={
            !search
              ? { label: 'Uploader un PDF', onClick: () => setShowUploader(true) }
              : undefined
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
        >
          {filtered.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={deleteDocument}
              index={i}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
