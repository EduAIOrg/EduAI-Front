'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plan, Subscription, Payment, Invoice } from '@/types/billing';
import { useAuthStore } from '@/store/authStore';

export const useBilling = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, setUser, user } = useAuthStore();

  // Fetch all plans
  const plansQuery = useQuery<Plan[]>({
    queryKey: ['billing', 'plans'],
    queryFn: async () => {
      const { data } = await api.get('/api/billing/plans');
      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch current active subscription
  const currentSubscriptionQuery = useQuery<Subscription>({
    queryKey: ['billing', 'subscription'],
    queryFn: async () => {
      const { data } = await api.get('/api/billing/subscriptions/current');
      return data;
    },
    enabled: isAuthenticated,
    retry: false, // If no subscription, API returns 404, we don't need to retry
  });

  // Fetch payment history
  const paymentHistoryQuery = useQuery<Payment[]>({
    queryKey: ['billing', 'payments'],
    queryFn: async () => {
      const { data } = await api.get('/api/billing/payments/history');
      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch invoices
  const invoicesQuery = useQuery<Invoice[]>({
    queryKey: ['billing', 'invoices'],
    queryFn: async () => {
      const { data } = await api.get('/api/billing/invoices');
      return data;
    },
    enabled: isAuthenticated,
  });

  // Create Subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ planId, provider }: { planId: string; provider: string }) => {
      const { data } = await api.post('/api/billing/subscriptions/create', {
        plan_id: planId,
        provider,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      // If plan is free (or instant active), update plan on local auth store
      if (data.status === 'active' && user) {
        // Find plan name
        const planObj = plansQuery.data?.find((p) => p.id === data.plan_id);
        if (planObj) {
          setUser({ ...user, plan: planObj.name.toLowerCase() });
        }
      }
    },
  });

  // Upgrade Subscription mutation
  const upgradeSubscriptionMutation = useMutation({
    mutationFn: async ({ planId, provider }: { planId: string; provider: string }) => {
      const { data } = await api.post('/api/billing/subscriptions/upgrade', {
        plan_id: planId,
        provider,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      if (data.status === 'active' && user) {
        const planObj = plansQuery.data?.find((p) => p.id === data.plan_id);
        if (planObj) {
          setUser({ ...user, plan: planObj.name.toLowerCase() });
        }
      }
    },
  });

  // Cancel Subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/api/billing/subscriptions/cancel');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });

  // Simulate Webhook Mutation
  const simulateWebhookMutation = useMutation({
    mutationFn: async ({ provider, transactionId, status }: { provider: string; transactionId: string; status: string }) => {
      const { data } = await api.post(`/api/billing/webhooks/${provider}`, {
        transaction_id: transactionId,
        status,
      });
      return data;
    },
    onSuccess: () => {
      // Refresh current subscription, payments, etc.
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      // Refresh user details (since plan might have changed after webhook completion)
      // We can refetch auth state
      setTimeout(async () => {
        try {
          const { data: userProfile } = await api.get('/api/auth/me');
          if (userProfile && user) {
            setUser({ ...user, plan: userProfile.plan });
          }
        } catch (err) {
          console.error("Failed to refresh user auth state", err);
        }
      }, 500);
    },
  });

  return {
    plans: plansQuery.data || [],
    currentSubscription: currentSubscriptionQuery.data || null,
    paymentHistory: paymentHistoryQuery.data || [],
    invoices: invoicesQuery.data || [],
    isLoadingPlans: plansQuery.isLoading,
    isLoadingSubscription: currentSubscriptionQuery.isLoading,
    isLoadingPayments: paymentHistoryQuery.isLoading,
    isLoadingInvoices: invoicesQuery.isLoading,
    createSubscription: createSubscriptionMutation.mutateAsync,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    upgradeSubscription: upgradeSubscriptionMutation.mutateAsync,
    isUpgradingSubscription: upgradeSubscriptionMutation.isPending,
    cancelSubscription: cancelSubscriptionMutation.mutateAsync,
    isCancellingSubscription: cancelSubscriptionMutation.isPending,
    simulateWebhook: simulateWebhookMutation.mutateAsync,
    isSimulatingWebhook: simulateWebhookMutation.isPending,
  };
};
