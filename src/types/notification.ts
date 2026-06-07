export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'document' | 'ia' | 'compte' | 'system';
  is_read: boolean;
  created_at: string;
}
