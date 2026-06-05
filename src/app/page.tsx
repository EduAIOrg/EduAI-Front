'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Brain, Languages, Shield, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { ROUTES } from '@/constants/routes';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const ctaLink = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN;
  const ctaText = isAuthenticated ? 'Accéder au Dashboard' : 'Commencer gratuitement';
  const heroBg = theme === 'light' ? '/images/hero_light.png' : '/images/hero.png';

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
      {/* Background Blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--bg-border)] bg-[var(--bg-base)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="EduAI Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg border border-[var(--bg-border)]" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">EduAI</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Africa
              </p>
            </div>
          </div>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="hover:text-[var(--text-primary)] transition-colors">Témoignages</a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Tarifs</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Link href={ctaLink}>
              <motion.button
                className="hidden md:flex items-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-base)] transition-transform hover:scale-105"
                whileTap={{ scale: 0.95 }}
              >
                {isAuthenticated ? 'Dashboard' : 'Connexion'}
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20 pb-20">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden text-center border-b border-[var(--bg-border)] min-h-[85vh] flex items-center justify-center">
          {/* Background Image & Overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-all duration-700"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)]/80 via-[var(--bg-base)]/40 to-[var(--bg-base)]" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center px-6 py-24 md:py-32 max-w-5xl mx-auto"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--text-primary)] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              L&apos;IA au service de l&apos;éducation africaine
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl drop-shadow-xl">
              Votre assistant <span className="gradient-text">pédagogique</span> personnel
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-[var(--text-primary)] opacity-90 md:text-xl leading-relaxed drop-shadow-md font-medium">
              Analysez vos cours, générez des quiz sur mesure, traduisez vos documents et interagissez avec notre IA vocale pour un apprentissage 10 fois plus rapide.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link href={ctaLink}>
                <motion.button
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[var(--primary)]/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ctaText}
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button
                  className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-semibold text-[var(--text-primary)] transition-colors hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Découvrir
                </motion.button>
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-[var(--text-primary)] font-medium drop-shadow-md">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--accent)] drop-shadow" /> Gratuit pour commencer</div>
              <div className="hidden sm:flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--accent)] drop-shadow" /> Sans carte bancaire</div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--accent)] drop-shadow" /> Conçu pour l&apos;Afrique</div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto mt-32 max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">Tout ce dont vous avez besoin <br />pour <span className="gradient-text">exceller</span></h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Analyse de Documents", desc: "Uploadez vos PDF de cours et obtenez des résumés instantanés générés par IA.", icon: BookOpen, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
              { title: "Génération de Quiz", desc: "Créez des QCM et questions ouvertes pour tester vos connaissances sur vos propres cours.", icon: Brain, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
              { title: "Traduction Intelligente", desc: "Traduisez vos textes du Français à l'Anglais tout en conservant le contexte pédagogique.", icon: Languages, color: "text-[var(--warning)]", bg: "bg-[var(--warning)]/10" },
              { title: "Assistant Vocal", desc: "Posez vos questions à haute voix et recevez des explications claires et détaillées.", icon: Shield, color: "text-[var(--danger)]", bg: "bg-[var(--danger)]/10" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group rounded-3xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-8 transition-all hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto mt-32 max-w-7xl px-6">
          <div className="rounded-3xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-12 text-center md:p-16">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-4xl font-extrabold gradient-text">10k+</p>
                <p className="mt-2 text-[var(--text-secondary)] font-medium">Étudiants actifs</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold gradient-text">50k+</p>
                <p className="mt-2 text-[var(--text-secondary)] font-medium">Documents analysés</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold gradient-text">98%</p>
                <p className="mt-2 text-[var(--text-secondary)] font-medium">Taux de satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mx-auto mt-32 max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">Des tarifs adaptés aux <span className="gradient-text">étudiants</span></h2>
            <p className="mt-4 text-[var(--text-secondary)]">Commencez gratuitement, passez à la vitesse supérieure quand vous le souhaitez.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Découverte</h3>
              <p className="mt-2 text-[var(--text-secondary)]">Pour tester l&apos;IA pédagogique.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">0 FCFA</span>
                <span className="text-[var(--text-secondary)]"> / mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Analyse de 3 PDF par mois', '10 Quiz générés', 'Traduction basique', 'Support communautaire'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={ROUTES.REGISTER}>
                <button className="w-full rounded-xl border border-[var(--bg-border)] py-3 font-semibold transition-colors hover:bg-[var(--bg-border)]">
                  Commencer
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-3xl border-2 border-[var(--primary)] bg-[var(--bg-surface)] p-8 shadow-2xl shadow-[var(--primary)]/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Le plus populaire
              </div>
              <h3 className="text-2xl font-bold">Excellence</h3>
              <p className="mt-2 text-[var(--text-secondary)]">Pour les étudiants exigeants.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">2500 FCFA</span>
                <span className="text-[var(--text-secondary)]"> / mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Documents PDF illimités', 'Quiz illimités + corrections détaillées', 'Traduction avec contexte', 'Assistant Vocal IA', 'Statistiques de progression'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[var(--primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={ROUTES.REGISTER}>
                <button className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                  Devenir Premium
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto mt-32 max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">Questions <span className="gradient-text">fréquentes</span></h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Comment l'IA analyse-t-elle mes cours ?", a: "Notre IA utilise des modèles de traitement du langage naturel avancés pour extraire les concepts clés de vos PDF et les transformer en résumés ou en quiz structurés." },
              { q: "Puis-je utiliser l'application sur mon téléphone ?", a: "Oui, EduAI Africa est entièrement responsive et fonctionne parfaitement sur tous les smartphones, tablettes et ordinateurs." },
              { q: "Quelles langues sont supportées ?", a: "Actuellement, nous supportons le Français et l'Anglais pour la traduction, avec une compréhension parfaite du jargon académique." },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-6">
                <h3 className="text-lg font-bold">{faq.q}</h3>
                <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--bg-border)] bg-[var(--bg-surface)] pb-12 pt-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="EduAI Logo" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-lg font-bold">EduAI Africa</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              L&apos;assistant pédagogique nouvelle génération conçu spécifiquement pour les étudiants africains. Révélez votre potentiel.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)]">Produit</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#features" className="hover:text-[var(--primary)] transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-[var(--primary)] transition-colors">Tarifs</a></li>
              <li><a href="#testimonials" className="hover:text-[var(--primary)] transition-colors">Témoignages</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Mises à jour</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)]">Ressources</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Tutoriels & Guides</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Centre d&apos;aide</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Nous contacter</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)]">Newsletter</h4>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Recevez nos dernières astuces pour optimiser vos révisions avec l&apos;IA.</p>
            <div className="mt-4 flex gap-2">
              <input type="email" placeholder="Votre email" className="w-full rounded-xl border border-[var(--bg-border)] bg-[var(--bg-base)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
              <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]">OK</button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--bg-border)] px-6 pt-8 md:flex-row">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} EduAI Africa. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Conditions d&apos;utilisation</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Mentions légales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
