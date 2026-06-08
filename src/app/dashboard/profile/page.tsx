'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Check, Edit2, Camera } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!fullName || !email) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    if (user) {
      setUser({ ...user, full_name: fullName, email });
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12 max-w-4xl"
    >
      <PageHeader
        title="Mon profil"
        description="Gérez vos informations personnelles et votre statut d'utilisateur"
        icon={<User className="h-5 w-5" />}
      />

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#6C63FF]/30 to-[#00D4AA]/30 relative" />

        {/* Profile Details Container */}
        <div className="px-8 pb-8 relative">
          {/* Avatar Container */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-8 gap-4">
            <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] text-3xl font-extrabold text-white flex items-center justify-center border-4 border-[#13131A] shadow-xl">
              {getInitials(user.full_name)}
              <button 
                onClick={() => toast.info('Modification de photo de profil bientôt disponible !')}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#1E1E2E] border border-[#3E3E52] text-[#8888AA] hover:text-white transition-colors"
                title="Changer de photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1E1E2E] border border-[#3E3E52] text-[#F0F0F8] hover:bg-[#3E3E52]/20 transition-all self-start sm:self-auto"
            >
              {isEditing ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#00D4AA]" />
                  Enregistrer
                </>
              ) : (
                <>
                  <Edit2 className="h-3.5 w-3.5" />
                  Modifier le profil
                </>
              )}
            </button>
          </div>

          {/* Form details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Nom complet
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2.5 bg-[#0A0A0F]/50 rounded-xl px-4 py-3 border border-[#1E1E2E] text-sm text-[#F0F0F8]">
                  <User className="h-4 w-4 text-[#8888AA]" />
                  <span>{user.full_name}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Adresse email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-3 text-sm text-[#F0F0F8] focus:border-[#6C63FF] focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2.5 bg-[#0A0A0F]/50 rounded-xl px-4 py-3 border border-[#1E1E2E] text-sm text-[#F0F0F8]">
                  <Mail className="h-4 w-4 text-[#8888AA]" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Rôle utilisateur
              </label>
              <div className="flex items-center gap-2.5 bg-[#0A0A0F]/30 rounded-xl px-4 py-3 border border-[#1E1E2E]/60 text-sm text-[#8888AA]">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role || 'Étudiant'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                Statut du compte
              </label>
              <div className="flex items-center gap-2.5 bg-[#0A0A0F]/30 rounded-xl px-4 py-3 border border-[#1E1E2E]/60 text-sm text-[#8888AA]">
                <Check className="h-4 w-4 text-[#00D4AA]" />
                <span className="text-[#00D4AA] font-semibold">Actif / Vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
