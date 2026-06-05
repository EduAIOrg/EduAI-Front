'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe trop court (8 caractères min.)'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  const fields = [
    {
      id: 'reg-name',
      name: 'full_name' as const,
      label: 'Nom complet',
      type: 'text',
      placeholder: 'Samuel Diallo',
      autoComplete: 'name',
      icon: User,
    },
    {
      id: 'reg-email',
      name: 'email' as const,
      label: 'Email',
      type: 'email',
      placeholder: 'vous@exemple.com',
      autoComplete: 'email',
      icon: Mail,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4 py-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#6C63FF]/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-[#00D4AA]/5 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img src="/images/logo.png" alt="EduAI Logo" className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-[#6C63FF]/30 border border-[#1E1E2E]" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#F0F0F8]">EduAI Africa</h1>
            <p className="text-sm text-[#8888AA]">Rejoignez des milliers d&apos;étudiants</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-2xl border border-[#1E1E2E] bg-[#13131A]/90 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#F0F0F8]">Créer un compte</h2>
            <p className="mt-1 text-sm text-[#8888AA]">
              Commencez votre aventure pédagogique avec l&apos;IA.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Static fields */}
            {fields.map(({ id, name, label, type, placeholder, autoComplete, icon: Icon }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-[#8888AA]">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8888AA]" />
                  <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    {...register(name)}
                    className={`w-full rounded-xl border bg-[#0A0A0F] py-3 pl-11 pr-4 text-sm text-[#F0F0F8] placeholder-[#8888AA]/60 outline-none transition-colors ${
                      errors[name]
                        ? 'border-[#FF5470]'
                        : 'border-[#1E1E2E] focus:border-[#6C63FF]'
                    }`}
                  />
                </div>
                {errors[name] && (
                  <p className="mt-1 text-xs text-[#FF5470]">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-xs font-medium text-[#8888AA]">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8888AA]" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="8 caractères minimum"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-[#0A0A0F] py-3 pl-11 pr-12 text-sm text-[#F0F0F8] placeholder-[#8888AA]/60 outline-none transition-colors ${
                    errors.password ? 'border-[#FF5470]' : 'border-[#1E1E2E] focus:border-[#6C63FF]'
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-[#F0F0F8]"
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#FF5470]">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="mb-1.5 block text-xs font-medium text-[#8888AA]">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8888AA]" />
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Répétez votre mot de passe"
                  {...register('confirmPassword')}
                  className={`w-full rounded-xl border bg-[#0A0A0F] py-3 pl-11 pr-12 text-sm text-[#F0F0F8] placeholder-[#8888AA]/60 outline-none transition-colors ${
                    errors.confirmPassword
                      ? 'border-[#FF5470]'
                      : 'border-[#1E1E2E] focus:border-[#6C63FF]'
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-[#F0F0F8]"
                  whileTap={{ scale: 0.9 }}
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-[#FF5470]">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isRegisterLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              whileHover={{ scale: isRegisterLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRegisterLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-sm text-[#8888AA]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Déjà un compte ?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-[#6C63FF] transition-colors hover:text-[#00D4AA]"
          >
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
