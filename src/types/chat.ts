/** Rôle de l'auteur du message */
export type MessageRole = 'user' | 'assistant';

/** Un message dans le chat (aligné avec MessageResponse backend) */
export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  /** Champs locaux uniquement (pas dans le backend) */
  isStreaming?: boolean;
  feedback?: 'up' | 'down' | null;
}

/** Item de liste de conversations (aligné avec ConversationListItem backend) */
export interface ConversationListItem {
  id: string;
  title: string;
  created_at: string;
  last_message?: string | null;
  message_count: number;
}

/** Une conversation de chat complète (aligné avec ConversationResponse backend) */
export interface Conversation {
  id: string;
  user_id?: string;
  document_id?: string | null;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at?: string;
}

/** Requête de création de conversation */
export interface ConversationCreateRequest {
  document_id?: string | null;
  title?: string;
}

/** Requête d'envoi de message */
export interface MessageCreateRequest {
  content: string;
}

/** Requête d'envoi de message (compatibilité interne) */
export interface SendMessageRequest {
  content: string;
  conversationId?: string;
  documentId?: string;
}

/** État du store chat */
export interface ChatState {
  conversations: ConversationListItem[];
  activeConversation: Conversation | null;
  isStreaming: boolean;
  setConversations: (conversations: ConversationListItem[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearHistory: () => void;
}
