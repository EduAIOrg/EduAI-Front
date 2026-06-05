'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import MobileNav from './MobileNav';

/** Map de noms de pages pour le breadcrumb */
const pageNames: Record<string, string> = {
  '/dashboard': 'Accueil',
  '/dashboard/documents': 'Documents',
  '/dashboard/chat': 'Chat IA',
  '/dashboard/quiz': 'Quiz',
  '/dashboard/translate': 'Traduction',
  '/dashboard/voice': 'Mode Vocal',
  '/dashboard/progress': 'Mes Progrès',
};

/**
 * En-tête du dashboard avec breadcrumb, recherche, notifications et avatar.
 */
const Header = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  /** Génère le breadcrumb à partir du pathname */
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const href = '/' + arr.slice(0, index + 1).join('/');
      const label = pageNames[href] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1E1E2E] bg-[#0A0A0F]/80 px-4 backdrop-blur-xl lg:px-8">
      {/* Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-4">
        <MobileNav />

        <nav className="hidden items-center gap-2 text-sm sm:flex" aria-label="Breadcrumb">
          <span className="text-[#8888AA]">EduAI</span>
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-[#8888AA]/50" />
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'font-medium text-[#F0F0F8]'
                      : 'text-[#8888AA]'
                  }
                >
                  {crumb.label}
                </span>
              </span>
            ))
          ) : (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#8888AA]/50" />
              <span className="font-medium text-[#F0F0F8]">Accueil</span>
            </>
          )}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Barre de recherche */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8888AA]" />
                <input
                  type="text"
                  placeholder="Rechercher... (⌘K)"
                  className="w-full rounded-xl border border-[#1E1E2E] bg-[#13131A] py-2 pl-10 pr-4 text-sm text-[#F0F0F8] placeholder-[#8888AA] outline-none focus:border-[#6C63FF] transition-colors"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                  aria-label="Recherche globale"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-xl p-2.5 text-[#8888AA] transition-colors hover:bg-[#13131A] hover:text-[#F0F0F8]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Rechercher"
        >
          {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-[#8888AA] transition-colors hover:bg-[#13131A] hover:text-[#F0F0F8]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF5470]" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-4 shadow-2xl"
              >
                <h3 className="mb-3 text-sm font-semibold text-[#F0F0F8]">Notifications</h3>
                <div className="space-y-2">
                  <div className="rounded-xl bg-[#0A0A0F] p-3">
                    <p className="text-xs text-[#F0F0F8]">Votre résumé est prêt !</p>
                    <p className="mt-1 text-[10px] text-[#8888AA]">Il y a 5 min</p>
                  </div>
                  <div className="rounded-xl bg-[#0A0A0F] p-3">
                    <p className="text-xs text-[#F0F0F8]">Quiz &quot;Algorithmes&quot; terminé</p>
                    <p className="mt-1 text-[10px] text-[#8888AA]">Il y a 1h</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <motion.div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-xs font-bold text-white cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {user ? getInitials(user.full_name) : 'U'}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
