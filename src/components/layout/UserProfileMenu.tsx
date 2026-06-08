'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Settings, CreditCard, History, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export default function UserProfileMenu() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getPlanLabel = (plan?: string) => {
    const p = plan?.toLowerCase();
    if (p === 'pro') return 'Pro';
    if (p === 'enterprise') return 'Entreprise';
    return 'Découverte (Gratuit)';
  };

  const getPlanBadgeColor = (plan?: string) => {
    const p = plan?.toLowerCase();
    if (p === 'pro') {
      return 'bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white';
    }
    if (p === 'enterprise') {
      return 'bg-gradient-to-r from-[#FFB938] to-[#FF5470] text-white';
    }
    return 'bg-[#181824] text-[#8888AA] border border-[#1E1E2E]';
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar Button with Active Connection Status Indicator */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-xs font-bold text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu utilisateur"
      >
        {getInitials(user.full_name)}
        {/* Active connection status indicator dot */}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00D4AA] border-2 border-[#0A0A0F]" title="Connecté" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-2 shadow-2xl z-50 flex flex-col"
            role="menu"
            aria-orientation="vertical"
          >
            {/* User Info & Plan Header */}
            <div className="px-3 py-3 border-b border-[#1E1E2E] mb-1.5">
              <p className="text-sm font-semibold text-[#F0F0F8] truncate">{user.full_name}</p>
              <p className="text-xs text-[#8888AA] truncate mb-2">{user.email}</p>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPlanBadgeColor(user.plan)}`}>
                  Forfait : {getPlanLabel(user.plan)}
                </span>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5470]/10 text-[#FF5470] border border-[#FF5470]/20 uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Menu Links */}
            <button
              onClick={() => {
                router.push('/dashboard/profile');
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-[#8888AA] hover:text-[#F0F0F8] hover:bg-[#1E1E2E] transition-colors text-left"
              role="menuitem"
            >
              <UserIcon className="h-4 w-4" />
              Mon profil
            </button>

            <button
              onClick={() => {
                router.push('/dashboard/settings');
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-[#8888AA] hover:text-[#F0F0F8] hover:bg-[#1E1E2E] transition-colors text-left"
              role="menuitem"
            >
              <Settings className="h-4 w-4" />
              Paramètres du compte
            </button>

            <button
              onClick={() => {
                router.push('/dashboard/billing');
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-[#8888AA] hover:text-[#F0F0F8] hover:bg-[#1E1E2E] transition-colors text-left"
              role="menuitem"
            >
              <CreditCard className="h-4 w-4" />
              Facturation
            </button>

            <button
              onClick={() => {
                router.push('/dashboard/history');
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-[#8888AA] hover:text-[#F0F0F8] hover:bg-[#1E1E2E] transition-colors text-left"
              role="menuitem"
            >
              <History className="h-4 w-4" />
              Historique
            </button>

            {/* Divider */}
            <div className="border-t border-[#1E1E2E] my-1.5" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-[#FF5470] hover:bg-[#FF5470]/10 transition-colors text-left"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
