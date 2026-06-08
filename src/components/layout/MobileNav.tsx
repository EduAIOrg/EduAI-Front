'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Brain,
  Languages,
  Mic,
  TrendingUp,
  Sparkles,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { NAV_ITEMS } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Brain,
  Languages,
  Mic,
  TrendingUp,
  CreditCard,
};

/**
 * Navigation mobile (drawer) visible uniquement sur petits écrans.
 * Se superpose avec un overlay semi-transparent.
 */
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden">
      {/* Bouton hamburger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="rounded-xl p-2 text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8]"
        whileTap={{ scale: 0.9 }}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-[280px] border-r border-[#1E1E2E] bg-[#0A0A0F] p-0"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA]">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[#F0F0F8]">EduAI</h1>
                    <p className="text-[10px] font-medium tracking-wider text-[#8888AA] uppercase">
                      Africa
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-[#8888AA] hover:text-[#F0F0F8]"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Navigation items */}
              <nav className="px-3 py-4">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item, index) => {
                    const Icon = iconMap[item.icon];
                    const active = isActive(item.href);

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={item.href} onClick={() => setIsOpen(false)}>
                          <div
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                              active
                                ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                                : 'text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8]'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                            {'badge' in item && item.badge && (
                              <span className="ml-auto rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-2 py-0.5 text-[10px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* User profile */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-[#1E1E2E] px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-xs font-bold text-white">
                    {user ? getInitials(user.full_name) : 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-[#F0F0F8]">
                      {user?.full_name || 'Utilisateur'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="rounded-lg p-2 text-[#8888AA] hover:bg-[#1E1E2E] hover:text-[#FF5470]"
                    aria-label="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
