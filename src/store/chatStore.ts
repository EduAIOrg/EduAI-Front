'use client';

import { create } from 'zustand';
import { ChatState, ChatMessage, Conversation } from '@/types/chat';

/**
 * Store Zustand pour la gestion du chat IA.
 * Gère les conversations, messages et état de streaming.
 */
export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  isStreaming: false,

  setConversations: (conversations: Conversation[]) => set({ conversations }),

  setActiveConversation: (conversation: Conversation | null) => set({ activeConversation: conversation }),

  addMessage: (message: ChatMessage) => {
    const { activeConversation } = get();
    if (!activeConversation) return;

    const updated = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      activeConversation: updated,
      conversations: state.conversations.map((c) =>
        c.id === updated.id ? updated : c
      ),
    }));
  },

  updateLastMessage: (content: string) => {
    const { activeConversation } = get();
    if (!activeConversation || activeConversation.messages.length === 0) return;

    const messages = [...activeConversation.messages];
    const lastMsg = messages[messages.length - 1];
    messages[messages.length - 1] = { ...lastMsg, content };

    const updated = { ...activeConversation, messages };
    set((state) => ({
      activeConversation: updated,
      conversations: state.conversations.map((c) =>
        c.id === updated.id ? updated : c
      ),
    }));
  },

  setStreaming: (isStreaming: boolean) => set({ isStreaming }),

  createConversation: (title: string, documentId?: string) => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title,
      documentId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversation: newConversation,
    }));

    return newConversation;
  },

  clearHistory: () => set({ conversations: [], activeConversation: null }),
}));
