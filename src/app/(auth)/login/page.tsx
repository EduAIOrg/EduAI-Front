'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (6 caractères min.)'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/** Variantes d'animation Framer Motion */
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -24 },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#6C63FF]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#00D4AA]/5 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
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
            <p className="text-sm text-[#8888AA]">L'apprentissage intelligent pour tous</p>
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
            <h2 className="text-xl font-bold text-[#F0F0F8]">Connexion</h2>
            <p className="mt-1 text-sm text-[#8888AA]">
              Bienvenue ! Entrez vos identifiants pour continuer.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-medium text-[#8888AA]"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                {...register('email')}
                className={`w-full rounded-xl border bg-[#0A0A0F] px-4 py-3 text-sm text-[#F0F0F8] placeholder-[#8888AA]/60 outline-none transition-colors ${
                  errors.email
                    ? 'border-[#FF5470] focus:border-[#FF5470]'
                    : 'border-[#1E1E2E] focus:border-[#6C63FF]'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[#FF5470]">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-medium text-[#8888AA]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-[#0A0A0F] px-4 py-3 pr-12 text-sm text-[#F0F0F8] placeholder-[#8888AA]/60 outline-none transition-colors ${
                    errors.password
                      ? 'border-[#FF5470] focus:border-[#FF5470]'
                      : 'border-[#1E1E2E] focus:border-[#6C63FF]'
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-[#F0F0F8]"
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#FF5470]">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#5A52E0] py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              whileHover={{ scale: isLoginLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoginLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Switch */}
        <motion.p
          className="mt-6 text-center text-sm text-[#8888AA]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Pas encore de compte ?{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-[#6C63FF] transition-colors hover:text-[#00D4AA]"
          >
            Créer un compte
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
