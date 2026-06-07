'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/types/notification';
import { useAuthStore } from '@/store/authStore';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Fetch all notifications
  const notificationsQuery = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/api/notifications');
      return data;
    },
    enabled: isAuthenticated,
    refetchInterval: 10000, // Poll every 10 seconds (future WebSocket fallback)
  });

  // Fetch unread notifications
  const unreadNotificationsQuery = useQuery<Notification[]>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data } = await api.get('/api/notifications/unread');
      return data;
    },
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  // Mark a notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/api/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch('/api/notifications/read-all');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete a notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/notifications/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    unreadNotifications: unreadNotificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading || unreadNotificationsQuery.isLoading,
    isError: notificationsQuery.isError || unreadNotificationsQuery.isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
};
