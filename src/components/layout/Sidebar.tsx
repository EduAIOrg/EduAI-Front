'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Brain,
  Languages,
  Mic,
  TrendingUp,
  LogOut,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { NAV_ITEMS } from '@/constants/routes';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

/** Map des icônes par nom */
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
 * Sidebar de navigation principale (260px, fixe sur desktop).
 * Affiche le logo, les liens de navigation, et le profil utilisateur.
 */
const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[#1E1E2E] bg-[#0A0A0F] lg:flex">
      {/* Logo */}
      <Link href={"/"}>
        <div className="flex items-center gap-3 px-6 py-6">
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
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                        : 'text-[#8888AA] hover:bg-[#13131A] hover:text-[#F0F0F8]'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Indicateur actif */}
                    {active && (
                      <motion.div
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#6C63FF]"
                        layoutId="sidebar-indicator"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className="ml-auto rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profil utilisateur */}
      <div className="border-t border-[#1E1E2E] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-xs font-bold text-white">
            {user ? getInitials(user.full_name) : 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-[#F0F0F8]">
              {user?.full_name || 'Utilisateur'}
            </p>
            <p className="truncate text-xs text-[#8888AA]">
              {user?.email || 'user@eduai.africa'}
            </p>
          </div>
          <motion.button
            onClick={logout}
            className="rounded-lg p-2 text-[#8888AA] transition-colors hover:bg-[#1E1E2E] hover:text-[#FF5470]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
