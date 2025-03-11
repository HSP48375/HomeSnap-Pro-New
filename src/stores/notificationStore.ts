import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  deep_link?: string;
  created_at: string;
  read_at?: string;
}

interface NotificationPreferences {
  id: string;
  in_app: boolean;
  email: boolean;
  push: boolean;
  order_updates: boolean;
  payment_updates: boolean;
  editor_assignments: boolean;
  marketing: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  
  // Notification actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  
  // Preferences actions
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  
  // Push notification actions
  subscribeToPushNotifications: () => Promise<void>;
  unsubscribeFromPushNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  preferences: null,
  loading: false,
  error: null,
  
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    
    try {
      // Fetch notifications
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Count unread notifications
      const unreadCount = notifications?.filter(n => n.status === 'unread').length || 0;
      
      set({ 
        notifications: notifications || [], 
        unreadCount,
        loading: false 
      });
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  markAsRead: async (notificationId: string) => {
    try {
      // Call the RPC function to mark notification as read
      const { error } = await supabase.rpc('mark_notification_as_read', {
        notification_id: notificationId
      });
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read' as const, read_at: new Date().toISOString() } 
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  },
  
  markAllAsRead: async () => {
    try {
      // Call the RPC function to mark all notifications as read
      const { error } = await supabase.rpc('mark_all_notifications_as_read');
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notification => 
          notification.status === 'unread' 
            ? { ...notification, status: 'read' as const, read_at: new Date().toISOString() } 
            : notification
        ),
        unreadCount: 0
      }));
      
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  },
  
  deleteNotification: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      set(state => {
        const notification = state.notifications.find(n => n.id === notificationId);
        const isUnread = notification?.status === 'unread';
        
        return {
          notifications: state.notifications.filter(n => n.id !== notificationId),
          unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
      });
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  },
  
  fetchPreferences: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      set({ preferences: data, loading: false });
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  updatePreferences: async (preferences: Partial<NotificationPreferences>) => {
    try {
      const { data: currentPrefs } = await supabase
        .from('notification_preferences')
        .select('id')
        .single();
      
      if (!currentPrefs) {
        // Insert new preferences if they don't exist
        const { error } = await supabase
          .from('notification_preferences')
          .insert({
            ...preferences
          });
        
        if (error) throw error;
      } else {
        // Update existing preferences
        const { error } = await supabase
          .from('notification_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPrefs.id);
        
        if (error) throw error;
      }
      
      // Update local state
      set(state => ({
        preferences: state.preferences 
          ? { ...state.preferences, ...preferences } 
          : { id: '', ...preferences } as NotificationPreferences
      }));
      
      toast.success('Notification preferences updated');
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    }
  },
  
  subscribeToPushNotifications: async () => {
    try {
      // Check if push notifications are supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported in this browser');
      }
      
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission for notifications was denied');
      }
      
      // Register service worker (in a real app)
      // const registration = await navigator.serviceWorker.register('/service-worker.js');
      
      // Subscribe to push notifications (simplified for demo)
      // In a real app, you would use the actual subscription object
      const subscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/example-endpoint',
        keys: {
          p256dh: 'example-p256dh-key',
          auth: 'example-auth-key'
        }
      };
      
      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        });
      
      if (error) throw error;
      
      // Update preferences to enable push notifications
      await get().updatePreferences({ push: true });
      
      toast.success('Push notifications enabled');
    } catch (error: any) {
      console.error('Error subscribing to push notifications:', error);
      toast.error(error.message || 'Failed to enable push notifications');
    }
  },
  
  unsubscribeFromPushNotifications: async () => {
    try {
      // In a real app, you would unsubscribe from the push service
      // const registration = await navigator.serviceWorker.ready;
      // const subscription = await registration.pushManager.getSubscription();
      // if (subscription) {
      //   await subscription.unsubscribe();
      // }
      
      // Delete subscription from database
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .is('user_id', supabase.auth.getUser());
      
      if (error) throw error;
      
      // Update preferences to disable push notifications
      await get().updatePreferences({ push: false });
      
      toast.success('Push notifications disabled');
    } catch (error: any) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error('Failed to disable push notifications');
    }
  }
}));