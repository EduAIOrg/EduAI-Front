'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Champ de saisie du chat avec support multiline (Shift+Enter).
 */
const ChatInput = ({ onSend, isLoading, placeholder = 'Posez votre question...' }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="border-t border-[#1E1E2E] bg-[#0A0A0F] p-4">
      <div className="flex items-end gap-3 rounded-2xl border border-[#1E1E2E] bg-[#13131A] px-4 py-3 transition-colors focus-within:border-[#6C63FF]/50">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          className="max-h-[150px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-[#F0F0F8] placeholder-[#8888AA] outline-none"
          rows={1}
          disabled={isLoading}
          aria-label="Message"
        />

        <div className="flex items-center gap-2">
          <motion.button
            className="rounded-lg p-1.5 text-[#8888AA] hover:text-[#F0F0F8]"
            whileTap={{ scale: 0.9 }}
            aria-label="Joindre un fichier"
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C63FF] text-white transition-colors hover:bg-[#5A52E0] disabled:opacity-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-[#8888AA]/60">
        Shift + Entrée pour un saut de ligne
      </p>
    </div>
  );
};

export default ChatInput;
