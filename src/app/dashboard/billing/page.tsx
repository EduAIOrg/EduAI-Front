'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Download, RefreshCw, XCircle, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useBilling } from '@/hooks/useBilling';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentSubscription,
    paymentHistory,
    invoices,
    isLoadingSubscription,
    cancelSubscription,
    isCancellingSubscription,
    simulateWebhook,
    isSimulatingWebhook,
  } = useBilling();

  const [simulating, setSimulating] = useState(false);

  const handleCancelSub = async () => {
    if (confirm('Voulez-vous vraiment annuler votre abonnement ?')) {
      try {
        await cancelSubscription();
        toast.success('Votre abonnement a été annulé avec succès.');
      } catch (err) {
        toast.error("Échec de l'annulation de l'abonnement.");
      }
    }
  };

  const handleSimulatePayment = async () => {
    if (!currentSubscription) return;
    setSimulating(true);
    try {
      // Find the payment associated with the subscription
      const pendingPayment = paymentHistory.find(
        (p) => p.subscription_id === currentSubscription.id && p.status === 'pending'
      );
      
      const txId = pendingPayment?.provider_transaction_id || `tx_${Math.random().toString(36).substr(2, 9)}`;
      
      await simulateWebhook({
        provider: pendingPayment?.provider || 'stripe',
        transactionId: txId,
        status: 'completed',
      });
      toast.success('Paiement simulé avec succès ! Votre abonnement est actif.');
    } catch (err) {
      toast.error('Échec de la simulation de paiement.');
    } finally {
      setSimulating(false);
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    toast.success(`Téléchargement de la facture ${invoiceNumber}...`);
    // Open in a new window or trigger native download helper
    window.open(`/api/billing/invoices/${invoiceNumber}/download`, '_blank');
  };

  if (isLoadingSubscription) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de vos informations de facturation..." />
      </div>
    );
  }

  // Active or Fallback FREE Plan
  const planName = currentSubscription?.plan?.name || 'Free';
  const planPrice = currentSubscription?.plan?.price ?? 0.0;
  const planCurrency = currentSubscription?.plan?.currency || 'EUR';
  const planLimits = currentSubscription?.plan?.daily_limits || { transcription: 3, upload: 5, chat: 10 };
  const subStatus = currentSubscription?.status || 'active';
  const endDate = currentSubscription?.end_date
    ? new Date(currentSubscription.end_date).toLocaleDateString('fr-FR')
    : 'Illimitée';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <PageHeader
        title="Facturation & Abonnements"
        description="Gérez votre formule, consultez vos factures et suivez vos limites d'utilisation"
        icon={<CreditCard className="h-5 w-5" />}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Plan details card */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider">
                  Forfait Actuel
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{planName}</h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  subStatus === 'active'
                    ? 'bg-[#00D4AA]/10 text-[#00D4AA]'
                    : subStatus === 'pending'
                    ? 'bg-[#FFB938]/10 text-[#FFB938]'
                    : 'bg-[#FF5470]/10 text-[#FF5470]'
                }`}
              >
                {subStatus === 'active' ? 'Actif' : subStatus === 'pending' ? 'Paiement en attente' : 'Annulé'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#8888AA]" />
                <div className="text-xs">
                  <p className="text-[#8888AA]">Fin de période / Renouvellement</p>
                  <p className="font-semibold text-[#F0F0F8] mt-0.5">{endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#8888AA]" />
                <div className="text-xs">
                  <p className="text-[#8888AA]">Montant de la formule</p>
                  <p className="font-semibold text-[#F0F0F8] mt-0.5">
                    {planPrice === 0.0 ? 'Gratuit' : `${planPrice.toLocaleString('fr-FR')} ${planCurrency} / mois`}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending payment simulator block */}
            {subStatus === 'pending' && (
              <div className="rounded-xl border border-[#FFB938]/30 bg-[#FFB938]/5 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-[#FFB938] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white">Validation du paiement requise</h4>
                    <p className="text-[11px] text-[#8888AA] mt-1 leading-relaxed">
                      Votre abonnement est actuellement en attente de validation par le fournisseur de paiement.
                    </p>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={simulating || isSimulatingWebhook}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFB938] text-[#0A0A0F] hover:opacity-90 transition-opacity"
                    >
                      <RefreshCw className={`h-3 w-3 ${simulating || isSimulatingWebhook ? 'animate-spin' : ''}`} />
                      Simuler la validation du paiement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quotas limit gauges */}
            <div className="border-t border-[#1E1E2E] pt-6 mt-6">
              <h3 className="text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-4">
                Limites incluses dans votre formule
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8888AA]">Transcriptions audio</span>
                    <span className="font-semibold text-white">{planLimits.transcription} / jour</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                      style={{ width: planName.toLowerCase() === 'free' ? '30%' : '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8888AA]">Analyses & Résumés PDF</span>
                    <span className="font-semibold text-white">{planLimits.upload} / jour</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                      style={{ width: planName.toLowerCase() === 'free' ? '20%' : '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8888AA]">Messages Chat IA</span>
                    <span className="font-semibold text-white">{planLimits.chat} / jour</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]"
                      style={{ width: planName.toLowerCase() === 'free' ? '40%' : '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#1E1E2E]">
            <button
              onClick={() => router.push(ROUTES.PRICING)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#6C63FF] text-white hover:bg-[#6C63FF]/90 transition-colors"
            >
              Changer de forfait
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            {subStatus === 'active' && planPrice > 0.0 && (
              <button
                onClick={handleCancelSub}
                disabled={isCancellingSubscription}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-[#FF5470]/30 text-[#FF5470] hover:bg-[#FF5470]/10 transition-colors ml-auto"
              >
                <XCircle className="h-3.5 w-3.5" />
                Annuler l'abonnement
              </button>
            )}
          </div>
        </motion.div>

        {/* Info premium benefits sidebar card */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#1E1E2E] bg-gradient-to-br from-[#6C63FF]/5 to-[#00D4AA]/5 p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#00D4AA]" />
              Avantages Premium
            </h3>
            <ul className="space-y-3 text-xs text-[#8888AA] leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#00D4AA]">✓</span>
                <span>Analyses instantanées de très gros fichiers PDF.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00D4AA]">✓</span>
                <span>Accès complet aux modules Traduction et Mode Vocal.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00D4AA]">✓</span>
                <span>Génération illimitée de Quiz et Flashcards interactives.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00D4AA]">✓</span>
                <span>Historique d'apprentissage conservé sans limite de temps.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1E1E2E]/50 text-center">
            <p className="text-[10px] text-[#8888AA]">
              Besoin d'un forfait scolaire ou entreprise ?
            </p>
            <Link
              href={ROUTES.PRICING}
              className="mt-2 block text-xs font-semibold text-[#6C63FF] hover:underline"
            >
              Voir le forfait Entreprise
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Payment History section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-base font-semibold text-white">📋 Historique des transactions</h2>
        {paymentHistory.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#13131A]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-xs font-semibold text-[#8888AA] bg-[#181824]/30">
                  <th className="px-6 py-4">ID Transaction</th>
                  <th className="px-6 py-4">Moyen de paiement</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]/50 text-xs text-[#8888AA]">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-[#0A0A0F]">
                    <td className="px-6 py-4 font-mono text-[#F0F0F8]">{payment.provider_transaction_id || payment.id.substr(0, 12)}</td>
                    <td className="px-6 py-4 uppercase font-semibold">{payment.provider}</td>
                    <td className="px-6 py-4 text-white font-medium">
                      {payment.amount.toLocaleString('fr-FR')} {payment.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          payment.status === 'completed'
                            ? 'bg-[#00D4AA]/10 text-[#00D4AA]'
                            : payment.status === 'pending'
                            ? 'bg-[#FFB938]/10 text-[#FFB938]'
                            : 'bg-[#FF5470]/10 text-[#FF5470]'
                        }`}
                      >
                        {payment.status === 'completed' ? 'Complété' : payment.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-8 text-center text-xs text-[#8888AA]">
            Aucune transaction enregistrée.
          </div>
        )}
      </motion.div>

      {/* Invoices List section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-base font-semibold text-white">Factures PDF</h2>
        {invoices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-center rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-4 transition-all duration-200 hover:border-[#6C63FF]/30"
              >
                <div>
                  <p className="text-xs font-bold text-white">{invoice.invoice_number}</p>
                  <p className="text-[10px] text-[#8888AA] mt-1">
                    Éditée le {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadInvoice(invoice.invoice_number)}
                  className="p-2 rounded-xl bg-[#181824] border border-[#1E1E2E] hover:border-[#6C63FF] hover:text-[#6C63FF] text-[#8888AA] transition-all"
                  title="Télécharger la facture PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-8 text-center text-xs text-[#8888AA]">
            Aucune facture disponible.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
