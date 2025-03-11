import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

// Create a test notification (for demo purposes)
export const createTestNotification = async (userId: string): Promise<boolean> => {
  try {
    // Create a notification in the database
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'test',
        title: 'Test Notification',
        message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
        status: 'unread',
        deep_link: '/dashboard'
      });

    if (error) {
      console.error('Error creating test notification:', error);
      return false;
    }

    toast.success('Test notification created successfully');
    return true;
  } catch (error: any) {
    console.error('Error creating test notification:', error);
    toast.error(error.message || 'Failed to create test notification');
    return false;
  }
};

// Check notification preferences
export const getNotificationPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (userId: string, preferences: any) => {
  try {
    const { error } = await supabase
      .from('notification_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
};