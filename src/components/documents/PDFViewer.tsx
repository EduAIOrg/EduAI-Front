'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  pageCount: number;
}

/**
 * Visionneuse PDF avec navigation, zoom et mode plein écran.
 * Utilise un iframe pour le rendu PDF natif du navigateur.
 */
const PDFViewer = ({ fileUrl, pageCount }: PDFViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(pageCount, prev + 1));
  const zoomIn = () => setZoom((prev) => Math.min(200, prev + 25));
  const zoomOut = () => setZoom((prev) => Math.max(50, prev - 25));

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      className={`flex flex-col overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A] ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[#1E1E2E] px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="rounded-lg p-1.5 text-[#8888AA] transition-colors hover:bg-[#1E1E2E] hover:text-[#F0F0F8] disabled:opacity-30"
            whileTap={{ scale: 0.9 }}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <span className="min-w-[80px] text-center text-xs text-[#F0F0F8]">
            Page {currentPage} / {pageCount}
          </span>
          <motion.button
            onClick={goToNextPage}
            disabled={currentPage === pageCount}
            className="rounded-lg p-1.5 text-[#8888AA] transition-colors hover:bg-[#1E1E2E] hover:text-[#F0F0F8] disabled:opacity-30"
            whileTap={{ scale: 0.9 }}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={zoomOut}
            className="rounded-lg p-1.5 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Zoom arrière"
          >
            <ZoomOut className="h-4 w-4" />
          </motion.button>
          <span className="text-xs text-[#8888AA]">{zoom}%</span>
          <motion.button
            onClick={zoomIn}
            className="rounded-lg p-1.5 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Zoom avant"
          >
            <ZoomIn className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={toggleFullscreen}
            className="rounded-lg p-1.5 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Plein écran"
          >
            <Maximize className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-[#0A0A0F] p-4">
        <div
          className="mx-auto transition-transform"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <iframe
            src={`${fileUrl}#page=${currentPage}`}
            className="mx-auto h-[800px] w-full max-w-[680px] rounded-lg border border-[#1E1E2E] bg-white"
            title="PDF Viewer"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PDFViewer;
