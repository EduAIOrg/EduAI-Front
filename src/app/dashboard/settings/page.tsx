'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Lock, Eye, EyeOff, Bell, Globe, Moon } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { toast } from 'sonner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference states
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('fr');
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs de mot de passe.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }
    toast.success('Votre mot de passe a été modifié avec succès.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePreferences = () => {
    toast.success('Préférences système sauvegardées avec succès.');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 max-w-4xl"
    >
      <PageHeader
        title="Paramètres du compte"
        description="Configurez vos préférences système, d'affichage et de sécurité"
        icon={<Settings className="h-5 w-5" />}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* System Settings card */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6 space-y-6"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E1E2E] pb-3">
            <Globe className="h-4.5 w-4.5 text-[#6C63FF]" />
            Préférences régionales & d'affichage
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Langue de l'interface
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Thème graphique
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    theme === 'dark'
                      ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]'
                      : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA]'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Sombre (Recommandé)
                </button>
                <button
                  onClick={() => {
                    setTheme('light');
                    toast.info('Le mode clair sera disponible lors d\'une prochaine mise à jour.');
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]'
                      : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA]'
                  }`}
                >
                  Mode Clair
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E1E2E] pb-3 pt-4">
            <Bell className="h-4.5 w-4.5 text-[#00D4AA]" />
            Notifications & alertes
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]/50 cursor-pointer">
              <div className="text-xs">
                <p className="font-semibold text-white">Alertes email</p>
                <p className="text-[#8888AA] mt-0.5">Recevoir un récapitulatif par mail des quiz terminés</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="h-4 w-4 accent-[#6C63FF]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[#1E1E2E] bg-[#0A0A0F]/50 cursor-pointer">
              <div className="text-xs">
                <p className="font-semibold text-white">Notifications push</p>
                <p className="text-[#8888AA] mt-0.5">Être alerté instantanément de la fin des analyses PDF</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotify}
                onChange={(e) => setPushNotify(e.target.checked)}
                className="h-4 w-4 accent-[#6C63FF]"
              />
            </label>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full bg-[#6C63FF] text-white rounded-xl py-3 text-xs font-bold hover:bg-[#6C63FF]/90 transition-colors"
          >
            Sauvegarder les préférences
          </button>
        </motion.div>

        {/* Security Password Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E1E2E] pb-3 mb-6">
            <Lock className="h-4.5 w-4.5 text-[#FF5470]" />
            Sécurité du compte
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Ancien mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl pl-4 pr-10 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF5470]/10 border border-[#FF5470]/20 hover:bg-[#FF5470]/20 text-[#FF5470] rounded-xl py-3 text-xs font-bold transition-colors"
            >
              Changer le mot de passe
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
