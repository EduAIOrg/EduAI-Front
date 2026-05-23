/** Rôle de l'auteur du message */
export type MessageRole = 'user' | 'assistant' | 'system';

/** Un message dans le chat */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  isStreaming?: boolean;
  feedback?: 'up' | 'down' | null;
}

/** Une conversation de chat */
export interface Conversation {
  id: string;
  title: string;
  documentId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/** Requête d'envoi de message */
export interface SendMessageRequest {
  content: string;
  conversationId?: string;
  documentId?: string;
}

/** État du store chat */
export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isStreaming: boolean;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  createConversation: (title: string, documentId?: string) => Conversation;
  clearHistory: () => void;
}
