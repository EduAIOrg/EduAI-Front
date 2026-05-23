'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import TypingIndicator from './TypingIndicator';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Bulle de message dans le chat IA.
 * Affiche l'avatar, le contenu (avec markdown), et les actions (copier, feedback).
 */
const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(message.feedback || null);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={`flex gap-3 px-4 py-4 ${isUser ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? 'bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-white'
            : 'bg-[#6C63FF]/10 text-[#6C63FF]'
        }`}
      >
        {isUser ? (
          user ? getInitials(user.name) : 'U'
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>

      {/* Message content */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-[#6C63FF] text-white'
              : 'bg-[#13131A] border border-[#1E1E2E] text-[#F0F0F8]'
          }`}
        >
          {message.isStreaming && !message.content ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {/* Actions (uniquement pour les messages IA) */}
        {!isUser && message.content && !message.isStreaming && (
          <div className="mt-2 flex items-center gap-1">
            <motion.button
              onClick={handleCopy}
              className="rounded-lg p-1.5 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
              whileTap={{ scale: 0.9 }}
              aria-label="Copier le message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#00D4AA]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </motion.button>
            <motion.button
              onClick={() => setFeedback('up')}
              className={`rounded-lg p-1.5 transition-colors ${
                feedback === 'up'
                  ? 'text-[#00D4AA]'
                  : 'text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label="Utile"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              onClick={() => setFeedback('down')}
              className={`rounded-lg p-1.5 transition-colors ${
                feedback === 'down'
                  ? 'text-[#FF5470]'
                  : 'text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label="Pas utile"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              className="rounded-lg p-1.5 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#F0F0F8]"
              whileTap={{ scale: 0.9 }}
              aria-label="Régénérer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
