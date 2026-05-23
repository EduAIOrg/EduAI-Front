'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar, BookOpen, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Document } from '@/types/document';
import { formatDate, formatFileSize } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  index?: number;
}

/**
 * Carte de document PDF avec aperçu, infos et actions.
 */
const DocumentCard = ({ document, onDelete, index = 0 }: DocumentCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A]/80 backdrop-blur-sm transition-all hover:border-[#6C63FF]/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Gradient subtil en haut */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="p-5">
        {/* Icône + Badge */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10">
            <FileText className="h-6 w-6 text-[#6C63FF]" />
          </div>
          {document.hasSummary && (
            <span className="rounded-full bg-[#00D4AA]/10 px-2.5 py-1 text-[10px] font-semibold text-[#00D4AA]">
              Résumé prêt
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="mb-2 text-sm font-semibold text-[#F0F0F8] line-clamp-2">
          {document.title}
        </h3>

        {/* Métadonnées */}
        <div className="mb-4 flex items-center gap-4 text-xs text-[#8888AA]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(document.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {document.pageCount} pages
          </span>
        </div>

        <p className="mb-4 text-xs text-[#8888AA]">{formatFileSize(document.fileSize)}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={ROUTES.DOCUMENT_VIEW(document.id)} className="flex-1">
            <motion.button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF]/10 py-2.5 text-xs font-medium text-[#6C63FF] transition-colors hover:bg-[#6C63FF]/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="h-3.5 w-3.5" />
              Consulter
            </motion.button>
          </Link>
          {onDelete && (
            <motion.button
              onClick={() => onDelete(document.id)}
              className="rounded-xl p-2.5 text-[#8888AA] transition-colors hover:bg-[#FF5470]/10 hover:text-[#FF5470]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Supprimer le document"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
