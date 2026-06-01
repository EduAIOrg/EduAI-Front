'use client';

import { create } from 'zustand';
import { ChatState, ChatMessage, Conversation, ConversationListItem } from '@/types/chat';

/**
 * Store Zustand pour la gestion du chat IA.
 * Gère les conversations, messages et état de streaming.
 */
export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isStreaming: false,

  setConversations: (conversations: ConversationListItem[]) => set({ conversations }),

  setActiveConversation: (conversation: Conversation | null) => set({ activeConversation: conversation }),

  addMessage: (message: ChatMessage) => {
    const { activeConversation } = get();
    if (!activeConversation) return;

    const updated = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
      updated_at: new Date().toISOString(),
    };

    set({ activeConversation: updated });
  },

  updateLastMessage: (content: string) => {
    const { activeConversation } = get();
    if (!activeConversation || activeConversation.messages.length === 0) return;

    const messages = [...activeConversation.messages];
    const lastMsg = messages[messages.length - 1];
    messages[messages.length - 1] = { ...lastMsg, content, isStreaming: false };

    const updated = { ...activeConversation, messages };
    set({ activeConversation: updated });
  },

  setStreaming: (isStreaming: boolean) => set({ isStreaming }),

  clearHistory: () => set({ conversations: [], activeConversation: null }),
}));
