'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckSquare, Eye } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  onClose: () => void;
  onOpenCenter: () => void;
}

export default function NotificationDropdown({ onClose, onOpenCenter }: NotificationDropdownProps) {
  const { notifications, unreadNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const displayNotifications = notifications.slice(0, 5);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-4 shadow-2xl z-50 flex flex-col max-h-[480px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3 mb-3">
        <h3 className="text-sm font-semibold text-[#F0F0F8] flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#6C63FF]" />
          Notifications
        </h3>
        {unreadNotifications.length > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-[11px] font-medium text-[#6C63FF] hover:text-[#00D4AA] flex items-center gap-1 transition-colors"
          >
            <CheckSquare className="h-3 w-3" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {displayNotifications.length > 0 ? (
          displayNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[#8888AA]">
            <Bell className="h-8 w-8 text-[#1E1E2E] mb-2" />
            <p className="text-xs">Aucune notification pour le moment.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[#1E1E2E] pt-3 mt-3">
          <button
            onClick={() => {
              onOpenCenter();
              onClose();
            }}
            className="w-full text-center py-2 rounded-xl bg-[#0A0A0F] hover:bg-[#1E1E2E] text-xs font-semibold text-[#F0F0F8] hover:text-[#6C63FF] flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <Eye className="h-3.5 w-3.5" />
            Voir toutes les notifications
          </button>
        </div>
      )}
    </motion.div>
  );
}
