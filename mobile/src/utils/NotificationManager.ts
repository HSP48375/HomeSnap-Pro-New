
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationPreferences {
  orderUpdates: boolean;
  photoEditing: boolean;
  payments: boolean;
  appUpdates: boolean;
  floorplanUpdates: boolean;
  promotions: boolean;
}

const defaultPreferences: NotificationPreferences = {
  orderUpdates: true,
  photoEditing: true,
  payments: true,
  appUpdates: true,
  floorplanUpdates: true,
  promotions: false,
};

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: keyof NotificationPreferences;
  data?: any;
  createdAt: string;
  read: boolean;
}

class NotificationManager {
  private static instance: NotificationManager;
  private preferences: NotificationPreferences = defaultPreferences;
  private notifications: NotificationData[] = [];
  
  private constructor() {}
  
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }
  
  // Initialize notification permissions and settings
  public async initialize(): Promise<boolean> {
    try {
      await this.loadPreferences();
      await this.loadNotifications();
      
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#00EEFF',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }
  
  // Register for push notifications
  public async registerForPushNotifications(): Promise<string | null> {
    try {
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your Expo project ID
      })).data;
      
      // Here you would normally send this token to your backend
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }
  
  // Load saved notification preferences
  private async loadPreferences(): Promise<void> {
    try {
      const savedPrefs = await AsyncStorage.getItem('notificationPreferences');
      if (savedPrefs) {
        this.preferences = { ...defaultPreferences, ...JSON.parse(savedPrefs) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  }
  
  // Save notification preferences
  public async savePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...preferences };
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }
  
  // Get current notification preferences
  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }
  
  // Load saved notifications
  private async loadNotifications(): Promise<void> {
    try {
      const savedNotifications = await AsyncStorage.getItem('notifications');
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
  
  // Save notifications to storage
  private async saveNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
  
  // Send a local notification
  public async sendLocalNotification(
    title: string,
    body: string,
    type: keyof NotificationPreferences,
    data?: any
  ): Promise<string | null> {
    // Check if this notification type is enabled
    if (!this.preferences[type]) {
      return null;
    }
    
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger: null, // Send immediately
      });
      
      // Store notification in history
      const notification: NotificationData = {
        id: notificationId,
        title,
        body,
        type,
        data,
        createdAt: new Date().toISOString(),
        read: false,
      };
      
      this.notifications.unshift(notification);
      await this.saveNotifications();
      
      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }
  
  // Get all notifications
  public getNotifications(): NotificationData[] {
    return [...this.notifications];
  }
  
  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications[index].read = true;
      await this.saveNotifications();
    }
  }
  
  // Mark all notifications as read
  public async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    await this.saveNotifications();
  }
  
  // Clear notification history
  public async clearNotifications(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
  }
  
  // Get unread notification count
  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
  
  // Helper methods for specific notification types
  public async notifyOrderUpdate(orderId: string, status: string): Promise<string | null> {
    return this.sendLocalNotification(
      'Order Update',
      `Order #${orderId} status changed to: ${status}`,
      'orderUpdates',
      { orderId, status }
    );
  }
  
  public async notifyPhotoEditingComplete(orderId: string, propertyName: string): Promise<string | null> {
    return this.sendLocalNotification(
      'Photos Ready',
      `Your edited photos for ${propertyName} are ready to view!`,
      'photoEditing',
      { orderId, propertyName }
    );
  }
  
  public async notifyPaymentProcessed(amount: number, orderId: string): Promise<string | null> {
    return this.sendLocalNotification(
      'Payment Processed',
      `Your payment of $${amount} for order #${orderId} has been processed.`,
      'payments',
      { amount, orderId }
    );
  }
  
  public async notifyFloorplanProcessing(status: string, propertyName: string): Promise<string | null> {
    return this.sendLocalNotification(
      'Floorplan Update',
      `Your floorplan for ${propertyName} is ${status}.`,
      'floorplanUpdates',
      { status, propertyName }
    );
  }
  
  public async notifyAppUpdate(version: string, features: string[]): Promise<string | null> {
    return this.sendLocalNotification(
      'App Update Available',
      `Version ${version} includes: ${features.join(', ')}`,
      'appUpdates',
      { version, features }
    );
  }
  
  public async notifyPromotion(title: string, description: string): Promise<string | null> {
    return this.sendLocalNotification(
      title,
      description,
      'promotions'
    );
  }
}

export default NotificationManager.getInstance();
