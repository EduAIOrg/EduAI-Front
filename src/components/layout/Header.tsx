'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import MobileNav from './MobileNav';
import NotificationBell from './notifications/NotificationBell';
import UserProfileMenu from './UserProfileMenu';

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
        <NotificationBell />

        {/* Profile menu */}
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default Header;
