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
  property_id?: string;
  order_id?: string;
  group_id?: string;
  actions?: { id: string; label: string; action_type: string }[];
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
  group_by_property: boolean;
  custom_sounds: Record<string, string>; // Add custom sounds
  silent_start: Date | string; // Add silent hours
  silent_end: Date | string;   // Add silent hours
}

interface NotificationState {
  notifications: Notification[];
  groupedNotifications: Record<string, Notification[]>;
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
  registerForPushNotifications: () => Promise<string | undefined>;
  executeNotificationAction: (notificationId: string, actionId: string) => Promise<void>;
  shouldShowNotification: (type: string) => boolean;
}

const isInSilentHours = (preferences: NotificationPreferences): boolean => {
  const now = new Date();
  const silentStart = typeof preferences.silent_start === 'string' ? new Date(preferences.silent_start) : preferences.silent_start;
  const silentEnd = typeof preferences.silent_end === 'string' ? new Date(preferences.silent_end) : preferences.silent_end;

  return now >= silentStart && now <= silentEnd;
};


export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  groupedNotifications: {},
  unreadCount: 0,
  preferences: null,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });

    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const notificationsData = notifications || [];
      const unreadCount = notificationsData.filter(n => n.status === 'unread').length;

      const { preferences } = get();
      let groupedNotifications = {};

      if (preferences?.group_by_property) {
        notificationsData.forEach(notification => {
          const groupKey = notification.property_id || notification.order_id || notification.group_id || 'other';
          if (!groupedNotifications[groupKey]) {
            groupedNotifications[groupKey] = [];
          }
          groupedNotifications[groupKey].push(notification);
        });
      }

      set({ 
        notifications: notificationsData, 
        groupedNotifications,
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
      const { error } = await supabase.rpc('mark_notification_as_read', {
        notification_id: notificationId
      });

      if (error) throw error;

      set(state => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read', read_at: new Date().toISOString() } 
            : notification
        );
        
        let groupedNotifications = {};
        if (state.preferences?.group_by_property) {
          updatedNotifications.forEach(notification => {
            const groupKey = notification.property_id || notification.order_id || notification.group_id || 'other';
            if (!groupedNotifications[groupKey]) {
              groupedNotifications[groupKey] = [];
            }
            groupedNotifications[groupKey].push(notification);
          });
        }

        return {
          notifications: updatedNotifications,
          groupedNotifications,
          unreadCount: Math.max(0, state.unreadCount - 1)
        };
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    try {
      const { error } = await supabase.rpc('mark_all_notifications_as_read');

      if (error) throw error;

      set(state => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.status === 'unread' 
            ? { ...notification, status: 'read', read_at: new Date().toISOString() } 
            : notification
        );

        let groupedNotifications = {};
        if (state.preferences?.group_by_property) {
          updatedNotifications.forEach(notification => {
            const groupKey = notification.property_id || notification.order_id || notification.group_id || 'other';
            if (!groupedNotifications[groupKey]) {
              groupedNotifications[groupKey] = [];
            }
            groupedNotifications[groupKey].push(notification);
          });
        }

        return {
          notifications: updatedNotifications,
          groupedNotifications,
          unreadCount: 0
        };
      });

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

      set(state => {
        const updatedNotifications = state.notifications.filter(n => n.id !== notificationId);

        let groupedNotifications = {};
        if (state.preferences?.group_by_property) {
          updatedNotifications.forEach(notification => {
            const groupKey = notification.property_id || notification.order_id || notification.group_id || 'other';
            if (!groupedNotifications[groupKey]) {
              groupedNotifications[groupKey] = [];
            }
            groupedNotifications[groupKey].push(notification);
          });
        }
        return {
          notifications: updatedNotifications,
          groupedNotifications,
          unreadCount: Math.max(0, state.unreadCount - (state.notifications.find(n => n.id === notificationId)?.status === 'unread' ? 1 : 0))
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

      let preferences = data;
      if (preferences) {
        if (typeof preferences.silent_start === 'string') {
          preferences.silent_start = new Date(preferences.silent_start);
        }
        if (typeof preferences.silent_end === 'string') {
          preferences.silent_end = new Date(preferences.silent_end);
        }
      }

      set({ preferences, loading: false });
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
      set({ error: error.message, loading: false });
    }
  },

  updatePreferences: async (preferences: Partial<NotificationPreferences>) => {
    try {
      const { preferences: currentPrefs } = get();
      const updatedPreferences = { ...currentPrefs, ...preferences } as NotificationPreferences;

      const dataForDb = { ...updatedPreferences };
      if (dataForDb.silent_start instanceof Date) {
        dataForDb.silent_start = dataForDb.silent_start.toISOString();
      }
      if (dataForDb.silent_end instanceof Date) {
        dataForDb.silent_end = dataForDb.silent_end.toISOString();
      }

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(dataForDb);

      if (error) throw error;

      set({ preferences: updatedPreferences });
      toast.success('Notification preferences updated');
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    }
  },

  registerForPushNotifications: async () => {
    //Implementation for push notifications would go here.  This is a placeholder.
    return undefined;
  },

  executeNotificationAction: async (notificationId: string, actionId: string) => {
    //Implementation for executing notification actions would go here. This is a placeholder.
    return;
  },

  shouldShowNotification: (type: string): boolean => {
    const { preferences } = get();

    if (!preferences) return true;

    if (isInSilentHours(preferences)) {
      return false;
    }

    switch (type) {
      case 'order_update':
        return preferences.order_updates;
      case 'payment_update':
        return preferences.payment_updates;
      case 'editor_assignment':
        return preferences.editor_assignments;
      case 'marketing':
        return preferences.marketing;
      default:
        return true;
    }
  }
}));