'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckSquare } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, unreadNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = activeTab === 'all' ? notifications : unreadNotifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0A0A0F] border-l border-[#1E1E2E] shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#13131A] border border-[#1E1E2E]">
                  <Bell className="h-5 w-5 text-[#6C63FF]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#F0F0F8]">Centre de Notifications</h2>
                  <p className="text-xs text-[#8888AA]">Gérez vos alertes et activités</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8] transition-colors border border-transparent hover:border-[#1E1E2E]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs & Bulk actions */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex bg-[#13131A] p-1 rounded-xl border border-[#1E1E2E]">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#6C63FF] text-white shadow-md'
                      : 'text-[#8888AA] hover:text-[#F0F0F8]'
                  }`}
                >
                  Toutes ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'unread'
                      ? 'bg-[#6C63FF] text-white shadow-md'
                      : 'text-[#8888AA] hover:text-[#F0F0F8]'
                  }`}
                >
                  Non lues ({unreadNotifications.length})
                </button>
              </div>

              {unreadNotifications.length > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs font-medium text-[#6C63FF] hover:text-[#00D4AA] flex items-center gap-1 transition-colors"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Tout lire
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#8888AA]">
                  <Bell className="h-12 w-12 text-[#1E1E2E] mb-3" />
                  <p className="text-sm font-medium">Aucune notification</p>
                  <p className="text-xs mt-1 text-[#8888AA]/70">
                    {activeTab === 'unread'
                      ? "Vous n'avez pas de notifications non lues."
                      : "Vous n'avez reçu aucune notification."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
