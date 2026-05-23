'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { use } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Document } from '@/types/document';
import PDFViewer from '@/components/documents/PDFViewer';
import SummaryPanel from '@/components/documents/SummaryPanel';
import ChatWindow from '@/components/chat/ChatWindow';
import QuizGenerator from '@/components/quiz/QuizGenerator';
import { useChat } from '@/hooks/useChat';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuiz } from '@/hooks/useQuiz';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/constants/routes';

type Tab = 'summary' | 'chat' | 'quiz';

/** Récupère un document par ID */
const useDocument = (id: string) =>
  useQuery({
    queryKey: ['documents', id],
    queryFn: async (): Promise<Document> => {
      const { data } = await api.get(`/api/documents/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export default function DocumentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);

  const { data: document, isLoading } = useDocument(id);
  const { useDocumentSummary, documents } = useDocuments();
  const summaryQuery = useDocumentSummary(id);
  const { sendMessage, activeConversation } = useChat();
  const { generateQuiz, isGenerating } = useQuiz();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'summary', label: 'Résumé' },
    { key: 'chat', label: 'Chat' },
    { key: 'quiz', label: 'Quiz' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement du document..." />
      </div>
    );
  }

  // Fallback document for demo
  const doc = document ?? {
    id,
    title: 'Document PDF',
    fileName: 'document.pdf',
    fileUrl: '',
    fileSize: 0,
    pageCount: 20,
    hasSummary: true,
    summary: 'Ce document traite des concepts fondamentaux...',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '',
  };

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col gap-4">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.DOCUMENTS}>
          <motion.button
            className="rounded-xl p-2 text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        </Link>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#6C63FF]" />
          <h1 className="truncate text-lg font-bold text-[#F0F0F8]">{doc.title}</h1>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* PDF Viewer 60% */}
        <div className="hidden flex-1 overflow-hidden lg:block">
          <PDFViewer fileUrl={doc.fileUrl} pageCount={doc.pageCount} />
        </div>

        {/* Side panel 40% */}
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A] lg:w-[40%]">
          {/* Tabs */}
          <div className="flex border-b border-[#1E1E2E]">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-[#6C63FF] border-b-2 border-[#6C63FF]'
                    : 'text-[#8888AA] hover:text-[#F0F0F8]'
                }`}
                whileTap={{ scale: 0.97 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'summary' && (
              <SummaryPanel
                summary={summaryQuery.data || doc.summary || ''}
                isLoading={summaryQuery.isLoading}
              />
            )}

            {activeTab === 'chat' && (
              <ChatWindow
                messages={activeConversation?.messages || []}
                onSend={(msg) => sendMessage(msg, id)}
                placeholder="Posez une question sur ce document..."
              />
            )}

            {activeTab === 'quiz' && (
              <div className="p-4">
                <p className="mb-4 text-sm text-[#8888AA]">
                  Générez un quiz basé sur ce document pour tester vos connaissances.
                </p>
                <motion.button
                  onClick={() => setShowQuizGenerator(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] py-3 text-sm font-semibold text-white"
                  whileTap={{ scale: 0.98 }}
                >
                  Générer un quiz
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Generator Modal */}
      <QuizGenerator
        documents={[doc]}
        onGenerate={(opts) => {
          generateQuiz(opts);
          setShowQuizGenerator(false);
        }}
        isGenerating={isGenerating}
        isOpen={showQuizGenerator}
        onClose={() => setShowQuizGenerator(false)}
      />
    </div>
  );
}
