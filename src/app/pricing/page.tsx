'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldAlert, Sparkles, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBilling } from '@/hooks/useBilling';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { plans, createSubscription, currentSubscription } = useBilling();
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paypal' | 'orange_money' | 'mtn_momo'>('stripe');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, planName: string, price: number) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour souscrire à un forfait.');
      router.push(ROUTES.LOGIN);
      return;
    }

    if (price === 0.0) {
      setLoadingPlanId(planId);
      try {
        await createSubscription({ planId, provider: 'stripe' });
        toast.success(`Forfait ${planName} activé avec succès !`);
        router.push(ROUTES.DASHBOARD);
      } catch (err) {
        toast.error("Erreur lors de l'activation du forfait.");
      } finally {
        setLoadingPlanId(null);
      }
      return;
    }

    // Process subscription for paid plans
    setLoadingPlanId(planId);
    try {
      const sub = await createSubscription({ planId, provider: selectedProvider });
      toast.success(`Abonnement ${planName} initié via ${selectedProvider.toUpperCase()}.`);
      // Since it is pending, show simulation tips or redirect to checkout
      toast.info('Rendez-vous dans votre Espace Facturation pour finaliser le paiement.', {
        duration: 5000,
      });
      router.push(ROUTES.BILLING);
    } catch (err) {
      toast.error("Échec de l'initiation de l'abonnement.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const getProviderLabel = (p: string) => {
    switch (p) {
      case 'stripe':
        return 'Carte bancaire (Stripe)';
      case 'paypal':
        return 'PayPal';
      case 'orange_money':
        return 'Orange Money';
      case 'mtn_momo':
        return 'MTN MoMo';
      default:
        return p;
    }
  };

  const isCurrentPlan = (planName: string) => {
    if (!currentSubscription) return planName.toLowerCase() === 'free';
    return currentSubscription.plan?.name.toLowerCase() === planName.toLowerCase() && currentSubscription.status === 'active';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F8] selection:bg-[#6C63FF]/30 selection:text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#6C63FF]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#00D4AA]/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#1E1E2E] bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#8888AA] hover:text-[#F0F0F8] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#8888AA] bg-clip-text text-transparent">
            EduAI Africa
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Tarification simple et transparente
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              Des fonctionnalités adaptées à vos besoins d'apprentissage
            </h1>
            <p className="text-lg text-[#8888AA]">
              Choisissez le forfait idéal pour booster vos études avec l'intelligence artificielle.
            </p>
          </motion.div>
        </div>

        {/* Payment provider selector */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-12 bg-[#13131A] rounded-2xl border border-[#1E1E2E] p-4 text-center"
          >
            <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-3">
              Moyen de paiement préféré
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['stripe', 'paypal', 'orange_money', 'mtn_momo'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                    selectedProvider === provider
                      ? 'bg-[#6C63FF] border-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20'
                      : 'bg-[#181824] border-[#1E1E2E] text-[#8888AA] hover:border-[#8888AA]/30'
                  }`}
                >
                  {getProviderLabel(provider)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
          {plans.map((plan, index) => {
            const isPro = plan.name.toLowerCase() === 'pro';
            const isEnterprise = plan.name.toLowerCase() === 'enterprise';
            const current = isCurrentPlan(plan.name);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between rounded-3xl border bg-[#13131A]/90 p-8 transition-all duration-300 hover:translate-y-[-4px] ${
                  isPro
                    ? 'border-[#6C63FF] shadow-xl shadow-[#6C63FF]/10 md:scale-105 z-10'
                    : 'border-[#1E1E2E]'
                }`}
              >
                {isPro && (
                  <span className="absolute top-0 right-8 translate-y-[-50%] inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white">
                    Populaire
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-[#8888AA] mb-6 min-h-[40px]">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-4xl font-extrabold text-white">
                      {plan.price === 0.0 ? '0' : plan.price.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-lg font-semibold text-[#8888AA]">
                      {plan.currency}
                    </span>
                    <span className="text-xs text-[#8888AA] ml-1">/ mois</span>
                  </div>

                  {/* Feature list */}
                  <div className="border-t border-[#1E1E2E] pt-6 mb-8">
                    <p className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-4">
                      Fonctionnalités et limites
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2.5 text-xs text-[#F0F0F8]/90">
                          <Check className="h-4 w-4 text-[#00D4AA] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleSubscribe(plan.id, plan.name, plan.price)}
                    disabled={current || loadingPlanId === plan.id}
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all duration-300 ${
                      current
                        ? 'bg-[#181824] border border-[#1E1E2E] text-[#8888AA] cursor-default'
                        : isPro
                        ? 'bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white hover:opacity-95 shadow-lg shadow-[#6C63FF]/20'
                        : 'bg-[#F0F0F8] text-[#0A0A0F] hover:bg-white'
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      'Traitement...'
                    ) : current ? (
                      'Forfait Actif'
                    ) : plan.price === 0.0 ? (
                      'Activer'
                    ) : (
                      `Souscrire avec ${selectedProvider.toUpperCase()}`
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed limits comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#13131A]/55 rounded-3xl border border-[#1E1E2E] overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-[#1E1E2E]">
            <h3 className="text-lg font-bold text-white">Tableau comparatif détaillé</h3>
            <p className="text-xs text-[#8888AA] mt-1">
              Comparez les quotas et capacités d'analyse de chaque formule.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-[10px] font-bold text-[#8888AA] uppercase tracking-wider bg-[#181824]/30">
                  <th className="px-8 py-4">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center">Free</th>
                  <th className="px-6 py-4 text-center text-[#6C63FF]">Pro</th>
                  <th className="px-6 py-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E] text-xs text-[#8888AA]">
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Transcriptions audio</td>
                  <td className="px-6 py-4 text-center">3 / jour</td>
                  <td className="px-6 py-4 text-center text-white">100 / jour</td>
                  <td className="px-6 py-4 text-center">Personnalisé</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Résumés de cours</td>
                  <td className="px-6 py-4 text-center">5 / jour</td>
                  <td className="px-6 py-4 text-center text-white">100 / jour</td>
                  <td className="px-6 py-4 text-center">Personnalisé</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Analyses de documents</td>
                  <td className="px-6 py-4 text-center">5 / jour</td>
                  <td className="px-6 py-4 text-center text-white">100 / jour</td>
                  <td className="px-6 py-4 text-center">Personnalisé</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Messages du Chat RAG</td>
                  <td className="px-6 py-4 text-center">10 / jour</td>
                  <td className="px-6 py-4 text-center text-white">100 / jour</td>
                  <td className="px-6 py-4 text-center">Illimité</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Générateur de Quiz</td>
                  <td className="px-6 py-4 text-center">3 / jour</td>
                  <td className="px-6 py-4 text-center text-white">100 / jour</td>
                  <td className="px-6 py-4 text-center">Illimité</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Gestion multi-utilisateurs</td>
                  <td className="px-6 py-4 text-center">Non</td>
                  <td className="px-6 py-4 text-center">Non</td>
                  <td className="px-6 py-4 text-center text-white">Oui</td>
                </tr>
                <tr>
                  <td className="px-8 py-4 font-semibold text-white">Support technique</td>
                  <td className="px-6 py-4 text-center">Standard</td>
                  <td className="px-6 py-4 text-center">Standard</td>
                  <td className="px-6 py-4 text-center text-white">Prioritaire 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
