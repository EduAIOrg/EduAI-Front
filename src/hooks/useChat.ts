'use client';

import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage, Conversation, ConversationListItem, SendMessageRequest } from '@/types/chat';

/**
 * Hook pour la gestion du chat IA.
 * Supporte l'envoi de messages avec streaming SSE via le backend.
 * 
 * Endpoints backend :
 * - GET  /api/chat/conversations                          → liste conversations
 * - POST /api/chat/conversations                          → créer conversation
 * - GET  /api/chat/conversations/{id}/messages             → messages d'une conversation
 * - POST /api/chat/conversations/{id}/messages             → envoyer message (SSE stream)
 * - DELETE /api/chat/conversations/{id}                    → supprimer conversation
 */
export const useChat = () => {
  const queryClient = useQueryClient();
  const {
    activeConversation,
    addMessage,
    updateLastMessage,
    setStreaming,
    clearHistory,
    setActiveConversation,
    setConversations,
    conversations,
  } = useChatStore();

  /** Récupère la liste des conversations */
  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<ConversationListItem[]> => {
      const { data } = await api.get('/api/chat/conversations');
      return data;
    },
  });

  /** Met à jour le store quand les conversations sont chargées */
  useEffect(() => {
    if (conversationsQuery.data) {
      setConversations(conversationsQuery.data);
    }
  }, [conversationsQuery.data, setConversations]);

  /** Charge les messages d'une conversation */
  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const [convResponse, msgsResponse] = await Promise.all([
        api.get(`/api/chat/conversations`),
        api.get(`/api/chat/conversations/${conversationId}/messages`),
      ]);
      
      const convList: ConversationListItem[] = convResponse.data;
      const convItem = convList.find(c => c.id === conversationId);
      const messages: ChatMessage[] = msgsResponse.data;

      const conversation: Conversation = {
        id: conversationId,
        title: convItem?.title || 'Conversation',
        messages,
        created_at: convItem?.created_at || new Date().toISOString(),
      };

      setActiveConversation(conversation);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  }, [setActiveConversation]);

  /** Envoie un message et gère la réponse streamée via SSE */
  const sendMessageMutation = useMutation({
    mutationFn: async (request: SendMessageRequest): Promise<void> => {
      let conversationId = request.conversationId || activeConversation?.id;

      // Crée une conversation côté backend si aucune n'est active
      if (!conversationId) {
        const { data: newConv } = await api.post('/api/chat/conversations', {
          title: 'Nouvelle conversation',
          document_id: request.documentId || null,
        });
        conversationId = newConv.id;
        
        // Initialise la conversation active
        setActiveConversation({
          id: newConv.id,
          title: newConv.title,
          document_id: newConv.document_id,
          user_id: newConv.user_id,
          messages: [],
          created_at: newConv.created_at,
        });
        
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }

      // Ajoute le message utilisateur localement
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: conversationId!,
        role: 'user',
        content: request.content,
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Ajoute un placeholder pour la réponse IA
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversation_id: conversationId!,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
        isStreaming: true,
      };
      addMessage(assistantMessage);
      setStreaming(true);

      try {
        // Utilise fetch pour le SSE streaming (axios ne supporte pas bien SSE)
        const token = typeof window !== 'undefined' ? localStorage.getItem('eduai_token') : null;
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://eduai-back.onrender.com';
        
        const response = await fetch(`${baseURL}/api/chat/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content: request.content }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('text/event-stream')) {
          // Streaming SSE
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let fullContent = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const jsonStr = line.slice(6).trim();
                  if (!jsonStr) continue;
                  
                  try {
                    const parsed = JSON.parse(jsonStr);
                    
                    if (parsed.done) {
                      // Streaming terminé
                      break;
                    }
                    
                    if (parsed.token) {
                      fullContent += parsed.token;
                      updateLastMessage(fullContent);
                    }
                  } catch {
                    // JSON parse error, skip
                  }
                }
              }
            }
          }
          
          if (fullContent) {
            updateLastMessage(fullContent);
          }
        } else {
          // Réponse JSON directe (pas de streaming)
          const data = await response.json();
          const content = data.content || data.data?.content || JSON.stringify(data);
          updateLastMessage(content);
        }

        // Rafraîchir la liste des conversations
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      } catch (error) {
        updateLastMessage("Désolé, une erreur est survenue. Veuillez réessayer.");
      } finally {
        setStreaming(false);
      }
    },
  });

  /** Supprime une conversation */
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string): Promise<void> => {
      await api.delete(`/api/chat/conversations/${conversationId}`);
    },
    onSuccess: () => {
      setActiveConversation(null);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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
    async (title?: string, documentId?: string) => {
      const { data } = await api.post('/api/chat/conversations', {
        title: title || 'Nouvelle conversation',
        document_id: documentId || null,
      });
      
      setActiveConversation({
        id: data.id,
        title: data.title,
        document_id: data.document_id,
        user_id: data.user_id,
        messages: data.messages || [],
        created_at: data.created_at,
      });
      
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      return data;
    },
    [setActiveConversation, queryClient]
  );

  return {
    conversations: conversationsQuery.data ?? [],
    activeConversation,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    newConversation,
    loadConversation,
    deleteConversation: deleteConversationMutation.mutate,
    clearHistory,
    setActiveConversation,
    isConversationsLoading: conversationsQuery.isLoading,
  };
};
