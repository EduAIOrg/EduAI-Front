'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useDocuments } from '@/hooks/useDocuments';
import ChatWindow from '@/components/chat/ChatWindow';
import PageHeader from '@/components/shared/PageHeader';
import { formatRelativeDate, truncateText } from '@/lib/utils';

export default function ChatPage() {
  const {
    conversations,
    activeConversation,
    sendMessage,
    isLoading,
    newConversation,
    loadConversation,
    clearHistory,
    setActiveConversation,
  } = useChat();

  const { documents } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<string>('');

  const handleNewConversation = () => {
    newConversation('Nouvelle conversation', selectedDocId || undefined);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0 overflow-hidden rounded-2xl border border-[#1E1E2E]">
      {/* Sidebar conversations */}
      <div className="flex w-64 flex-col border-r border-[#1E1E2E] bg-[#13131A]">
        {/* Header */}
        <div className="border-b border-[#1E1E2E] p-4">
          <h2 className="mb-3 text-sm font-semibold text-[#F0F0F8]">Conversations</h2>
          <motion.button
            onClick={handleNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C63FF]/10 py-2 text-xs font-medium text-[#6C63FF] hover:bg-[#6C63FF]/20 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="h-4 w-4" />
            Nouvelle conversation
          </motion.button>
        </div>

        {/* Document selector */}
        <div className="border-b border-[#1E1E2E] p-3">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full rounded-xl border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2 text-xs text-[#F0F0F8] outline-none focus:border-[#6C63FF]"
            aria-label="Sélectionner un document source"
          >
            <option value="">Aucun document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {truncateText(doc.title, 28)}
              </option>
            ))}
          </select>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {conversations.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#8888AA]">
              Aucune conversation
            </p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <motion.button
                    onClick={() => loadConversation(conv.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                      activeConversation?.id === conv.id
                        ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                        : 'text-[#8888AA] hover:bg-[#0A0A0F] hover:text-[#F0F0F8]'
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{conv.title}</p>
                      <p className="text-[10px] opacity-70">{formatRelativeDate(conv.created_at)}</p>
                    </div>
                  </motion.button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Clear history */}
        {conversations.length > 0 && (
          <div className="border-t border-[#1E1E2E] p-3">
            <motion.button
              onClick={clearHistory}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs text-[#8888AA] hover:text-[#FF5470] transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Effacer l&apos;historique
            </motion.button>
          </div>
        )}
      </div>

      {/* Chat window */}
      <div className="flex flex-1 flex-col bg-[#0A0A0F]">
        {activeConversation ? (
          <>
            {/* Conversation header */}
            <div className="flex items-center gap-3 border-b border-[#1E1E2E] px-6 py-3">
              <MessageSquare className="h-4 w-4 text-[#6C63FF]" />
              <span className="text-sm font-medium text-[#F0F0F8]">
                {activeConversation.title}
              </span>
              {activeConversation.document_id && (
                <span className="flex items-center gap-1 rounded-full bg-[#6C63FF]/10 px-2 py-0.5 text-[10px] text-[#6C63FF]">
                  <FileText className="h-3 w-3" />
                  Document lié
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                messages={activeConversation.messages}
                onSend={(msg) => sendMessage(msg, activeConversation.document_id || undefined)}
                isLoading={isLoading}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6C63FF]/10">
              <MessageSquare className="h-8 w-8 text-[#6C63FF]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#F0F0F8]">Chat IA</h2>
              <p className="mt-1 max-w-sm text-sm text-[#8888AA]">
                Sélectionnez une conversation ou créez-en une nouvelle pour commencer.
              </p>
            </div>
            <motion.button
              onClick={handleNewConversation}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-6 py-2.5 text-sm font-semibold text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="h-4 w-4" />
              Nouvelle conversation
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
