'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationBadge from './NotificationBadge';
import NotificationDropdown from './NotificationDropdown';
import NotificationCenter from './NotificationCenter';

export default function NotificationBell() {
  const { unreadNotifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCenter, setShowCenter] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative rounded-xl p-2.5 text-[#8888AA] transition-colors hover:bg-[#13131A] hover:text-[#F0F0F8]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <NotificationBadge count={unreadNotifications.length} />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <NotificationDropdown
            onClose={() => setShowDropdown(false)}
            onOpenCenter={() => setShowCenter(true)}
          />
        )}
      </AnimatePresence>

      <NotificationCenter
        isOpen={showCenter}
        onClose={() => setShowCenter(false)}
      />
    </div>
  );
}
