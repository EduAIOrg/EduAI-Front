'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileUp, X } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

/**
 * Zone d'upload drag-and-drop pour les documents PDF.
 * Affiche une barre de progression pendant l'upload.
 */
const DocumentUploader = ({ onUpload, isUploading }: DocumentUploaderProps) => {
  const { uploadProgress } = useDocumentStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    disabled: isUploading,
  });

  const { ref, ...rootProps } = getRootProps();

  return (
    <div className="w-full">
      <motion.div
        ref={ref}
        onClick={rootProps.onClick}
        onKeyDown={rootProps.onKeyDown}
        onDragEnter={rootProps.onDragEnter}
        onDragOver={rootProps.onDragOver}
        onDragLeave={rootProps.onDragLeave}
        onDrop={rootProps.onDrop}
        tabIndex={rootProps.tabIndex}
        role={rootProps.role}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
          isDragActive
            ? 'border-[#6C63FF] bg-[#6C63FF]/5'
            : 'border-[#1E1E2E] bg-[#13131A]/50 hover:border-[#6C63FF]/30 hover:bg-[#13131A]'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        whileHover={!isUploading ? { scale: 1.01 } : {}}
      >
        <input {...getInputProps()} aria-label="Upload un fichier PDF" />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              className="flex w-full flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FileUp className="h-10 w-10 text-[#6C63FF]" />
              <div className="w-full max-w-xs">
                <div className="mb-2 flex justify-between text-xs text-[#8888AA]">
                  <span>Upload en cours...</span>
                  <span>{uploadProgress?.percentage || 0}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress?.percentage || 0}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C63FF]/10">
                <Upload className="h-7 w-7 text-[#6C63FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#F0F0F8]">
                  {isDragActive ? 'Déposez votre fichier ici' : 'Glissez votre PDF ici'}
                </p>
                <p className="mt-1 text-xs text-[#8888AA]">
                  ou cliquez pour parcourir • PDF uniquement, max 50 Mo
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DocumentUploader;
