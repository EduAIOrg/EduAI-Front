'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage, SendMessageRequest } from '@/types/chat';

/**
 * Hook pour la gestion du chat IA.
 * Supporte l'envoi de messages avec streaming SSE.
 */
export const useChat = () => {
  const {
    activeConversation,
    addMessage,
    updateLastMessage,
    setStreaming,
    createConversation,
    clearHistory,
    setActiveConversation,
    conversations,
  } = useChatStore();

  /** Envoie un message et gère la réponse streamée */
  const sendMessageMutation = useMutation({
    mutationFn: async (request: SendMessageRequest): Promise<void> => {
      // Crée une conversation si aucune n'est active
      let conversationId = activeConversation?.id;
      if (!conversationId) {
        const conv = createConversation('Nouvelle conversation', request.documentId);
        conversationId = conv.id;
      }

      // Ajoute le message utilisateur
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: request.content,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Ajoute un placeholder pour la réponse IA
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };
      addMessage(assistantMessage);
      setStreaming(true);

      try {
        const response = await api.post('/api/chat', {
          ...request,
          conversationId,
        });

        // Si le serveur retourne directement la réponse (pas de streaming)
        if (response.data?.data?.content) {
          updateLastMessage(response.data.data.content);
        }
      } catch {
        updateLastMessage("Désolé, une erreur est survenue. Veuillez réessayer.");
      } finally {
        setStreaming(false);
      }
    },
  });

  /** Envoie un message */
  const sendMessage = useCallback(
    (content: string, documentId?: string) => {
      sendMessageMutation.mutate({ content, documentId });
    },
    [sendMessageMutation]
  );

  /** Crée une nouvelle conversation */
  const newConversation = useCallback(
    (title?: string, documentId?: string) => {
      return createConversation(title || 'Nouvelle conversation', documentId);
    },
    [createConversation]
  );

  return {
    conversations,
    activeConversation,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    newConversation,
    clearHistory,
    setActiveConversation,
  };
};
