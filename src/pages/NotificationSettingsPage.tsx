import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Bell, Mail, ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getNotificationPreferences, updateNotificationPreferences } from '../lib/notifications';

interface NotificationPreferences {
  id: string;
  user_id: string;
  in_app: boolean;
  email: boolean;
  order_updates: boolean;
  payment_updates: boolean;
  editor_assignments: boolean;
  marketing: boolean;
  created_at: string;
  updated_at: string;
}

const NotificationSettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setPreferences(data);
      } catch (error: any) {
        console.error('Error fetching notification preferences:', error);
        setError('Failed to load notification preferences');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user]);

  const handleToggle = (field: keyof NotificationPreferences) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [field]: !preferences[field]
    });
  };

  const handleSave = async () => {
    if (!preferences || !user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          in_app: preferences.in_app,
          email: preferences.email,
          order_updates: preferences.order_updates,
          payment_updates: preferences.payment_updates,
          editor_assignments: preferences.editor_assignments,
          marketing: preferences.marketing,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Notification preferences saved successfully');
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      setError('Failed to save notification preferences');
      toast.error('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setPreferences(data);
      toast.success('Preferences reset to saved values');
    } catch (error: any) {
      console.error('Error resetting notification preferences:', error);
      setError('Failed to reset notification preferences');
      toast.error('Failed to reset notification preferences');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading notification preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link 
          to="/profile" 
          className="mr-4 p-2 rounded-full bg-dark-light hover:bg-primary/20 text-white/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Notification Settings</h1>
          <p className="text-white/70 mt-2">
            Customize how and when you receive notifications.
          </p>
        </div>
      </div>

      {error && (
        <div className="card bg-red-500/20 border border-red-500/50 p-4">
          <p className="text-white">{error}</p>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Notification Channels</h2>
        
        <div className="space-y-6">
          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">In-App Notifications</h3>
                <p className="text-white/70 text-sm">Receive notifications in the application</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.in_app || false}
                onChange={() => handleToggle('in_app')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-white/70 text-sm">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.email || false}
                onChange={() => handleToggle('email')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Notification Categories</h2>
        
        <div className="space-y-6">
          {/* Order Updates */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Order Updates</h3>
              <p className="text-white/70 text-sm">Status changes and progress updates for your orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.order_updates || false}
                onChange={() => handleToggle('order_updates')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Payment Updates */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Updates</h3>
              <p className="text-white/70 text-sm">Payment confirmations, receipts, and billing information</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.payment_updates || false}
                onChange={() => handleToggle('payment_updates')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Editor Assignments */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Editor Assignments</h3>
              <p className="text-white/70 text-sm">Updates when editors are assigned to your orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.editor_assignments || false}
                onChange={() => handleToggle('editor_assignments')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Marketing */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing & Promotions</h3>
              <p className="text-white/70 text-sm">Special offers, discounts, and product updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={preferences?.marketing || false}
                onChange={() => handleToggle('marketing')}
              />
              <div className="w-11 h-6 bg-dark-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          onClick={handleReset}
          className="btn btn-outline flex items-center"
          disabled={saving || loading}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reset
        </button>
        <button 
          onClick={handleSave}
          className="btn btn-primary flex items-center"
          disabled={saving || loading}
        >
          {saving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Save Preferences
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;