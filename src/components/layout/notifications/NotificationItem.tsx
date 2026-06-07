'use client';

import { FileText, Sparkles, User, Info, Check, Trash2 } from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'document':
        return <FileText className="h-4 w-4 text-[#6C63FF]" />;
      case 'ia':
        return <Sparkles className="h-4 w-4 text-[#00D4AA]" />;
      case 'compte':
        return <User className="h-4 w-4 text-[#FFB938]" />;
      default:
        return <Info className="h-4 w-4 text-[#8888AA]" />;
    }
  };

  const getBgColor = () => {
    if (!notification.is_read) {
      return 'bg-[#13131A] border-l-2 border-l-[#6C63FF]';
    }
    return 'bg-[#0A0A0F] hover:bg-[#13131A]';
  };

  const formattedDate = () => {
    try {
      const now = new Date();
      const date = new Date(notification.created_at);
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      return `Il y a ${diffDays} j`;
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl p-3 border border-[#1E1E2E] transition-all duration-200 ${getBgColor()}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#181824] border border-[#1E1E2E]/50">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs font-semibold truncate ${!notification.is_read ? 'text-[#F0F0F8]' : 'text-[#8888AA]'}`}>
            {notification.title}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!notification.is_read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="rounded p-1 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#00D4AA] transition-colors"
                title="Marquer comme lu"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="rounded p-1 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#FF5470] transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-[#8888AA] leading-normal break-words">
          {notification.message}
        </p>
        <span className="mt-2 block text-[9px] text-[#8888AA]/60 font-medium">
          {formattedDate()}
        </span>
      </div>
    </div>
  );
}
