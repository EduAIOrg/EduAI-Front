'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessageType[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Fenêtre de chat complète avec messages défilants et champ de saisie.
 */
const ChatWindow = ({ messages, onSend, isLoading, placeholder }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <motion.div
            className="flex h-full flex-col items-center justify-center gap-4 px-4 py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6C63FF]/10">
              <Sparkles className="h-8 w-8 text-[#6C63FF]" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#F0F0F8]">
                Comment puis-je vous aider ?
              </h3>
              <p className="mt-1 max-w-sm text-sm text-[#8888AA]">
                Posez une question sur vos documents, demandez des explications
                ou générez un quiz.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                'Résume ce document',
                'Explique ce concept',
                'Crée un quiz',
                'Traduis en anglais',
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => onSend(suggestion)}
                  className="rounded-xl border border-[#1E1E2E] bg-[#13131A] px-4 py-2 text-xs text-[#8888AA] transition-colors hover:border-[#6C63FF]/30 hover:text-[#F0F0F8]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} isLoading={isLoading} placeholder={placeholder} />
    </div>
  );
};

export default ChatWindow;
