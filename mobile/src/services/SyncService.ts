
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import { getUploadQueue, removeFromUploadQueue } from '../utils/storage';
import { api } from '../lib/api';

// Configure notifications for background sync
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request permission for notifications (should be called during app initialization)
export const requestNotificationsPermission = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('sync-notifications', {
      name: 'Sync Notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00EEFF',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Process upload queue when network is available
export const syncQueuedData = async (): Promise<void> => {
  // Check network connection
  const netState = await NetInfo.fetch();
  
  if (!netState.isConnected || !netState.isInternetReachable) {
    console.log('Not connected to the internet, will try later');
    return;
  }
  
  // Get pending uploads
  const pendingUploads = await getUploadQueue();
  
  if (pendingUploads.length === 0) {
    console.log('No pending uploads');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each item in the queue
  for (const item of pendingUploads) {
    try {
      let success = false;
      
      switch (item.type) {
        case 'photo':
          success = await uploadPhoto(item);
          break;
        case 'order':
          success = await uploadOrder(item);
          break;
        case 'floorplan':
          success = await uploadFloorplan(item);
          break;
        default:
          console.warn(`Unknown item type: ${item.type}`);
      }
      
      if (success) {
        await removeFromUploadQueue(item.type, item.id);
        successCount++;
      } else {
        errorCount++;
        // Update attempts count
        // This will be handled by the queue management system
      }
    } catch (error) {
      console.error(`Failed to upload ${item.type} ${item.id}:`, error);
      errorCount++;
    }
  }
  
  // Notify user of completed sync
  if (successCount > 0) {
    await sendSyncNotification(successCount, errorCount);
  }
  
  return;
};

// Upload functions for different data types
const uploadPhoto = async (item: any): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('photo', {
      uri: item.uri,
      name: `photo_${item.id}.jpg`,
      type: 'image/jpeg',
    });
    
    Object.keys(item.metadata || {}).forEach(key => {
      formData.append(key, item.metadata[key]);
    });
    
    // Use your API client to upload the photo
    await api.uploadPhoto(formData);
    
    return true;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return false;
  }
};

const uploadOrder = async (item: any): Promise<boolean> => {
  try {
    // Use your API client to upload the order
    await api.createOrder(item.data);
    
    return true;
  } catch (error) {
    console.error('Error uploading order:', error);
    return false;
  }
};

const uploadFloorplan = async (item: any): Promise<boolean> => {
  try {
    // Use your API client to upload the floorplan
    await api.uploadFloorplan(item.data);
    
    return true;
  } catch (error) {
    console.error('Error uploading floorplan:', error);
    return false;
  }
};

// Send notification when sync completes
const sendSyncNotification = async (successCount: number, errorCount: number) => {
  try {
    let title = 'Sync Complete';
    let body = `Successfully synced ${successCount} item${successCount !== 1 ? 's' : ''}.`;
    
    if (errorCount > 0) {
      body += ` ${errorCount} item${errorCount !== 1 ? 's' : ''} failed to sync.`;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'sync-notification' },
      },
      trigger: null, // immediate notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Start background sync process
export const startBackgroundSync = (intervalMinutes = 5): () => void => {
  // Sync immediately
  syncQueuedData();
  
  // Then set up interval
  const intervalId = setInterval(syncQueuedData, intervalMinutes * 60 * 1000);
  
  // Return a function to stop the sync
  return () => clearInterval(intervalId);
};
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import NotificationManager from '../utils/NotificationManager';

interface QueuedAction {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  attempts: number;
}

class SyncService {
  private static instance: SyncService;
  private queue: QueuedAction[] = [];
  private isOnline: boolean = true;
  private isProcessing: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private networkListeners: any[] = [];
  
  private constructor() {}
  
  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }
  
  // Initialize the service
  public async initialize(): Promise<void> {
    // Load queued actions from storage
    await this.loadQueue();
    
    // Set up network state listener
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected !== false && state.isInternetReachable !== false;
      
      // If we're coming back online, try to process queue
      if (wasOffline && this.isOnline) {
        NotificationManager.sendLocalNotification(
          'Connection Restored',
          'Your connection is back. Syncing your data...',
          'appUpdates'
        );
        this.processQueue();
      }
    });
    
    this.networkListeners.push(unsubscribe);
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.queue.length > 0) {
        this.processQueue();
      }
    }, 60000); // Check every minute
    
    // Initial check
    const networkState = await NetInfo.fetch();
    this.isOnline = networkState.isConnected !== false && networkState.isInternetReachable !== false;
    
    // Initial queue processing if online
    if (this.isOnline && this.queue.length > 0) {
      this.processQueue();
    }
  }
  
  // Clean up resources
  public cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.networkListeners.forEach(unsubscribe => unsubscribe());
  }
  
  // Add an action to the queue
  public async enqueueAction(type: string, data: any): Promise<string> {
    const action: QueuedAction = {
      id: uuidv4(),
      type,
      data,
      createdAt: new Date().toISOString(),
      attempts: 0
    };
    
    this.queue.push(action);
    await this.saveQueue();
    
    // Try to process immediately if online
    if (this.isOnline && !this.isProcessing) {
      this.processQueue();
    }
    
    return action.id;
  }
  
  // Process the queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0 || !this.isOnline) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      // Sort by oldest first and limit retries
      const sortedQueue = [...this.queue]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .filter(action => action.attempts < 5);
      
      for (const action of sortedQueue) {
        try {
          let success = false;
          
          // Process based on action type
          switch (action.type) {
            case 'upload_photo':
              success = await this.processPhotoUpload(action.data);
              break;
            case 'create_order':
              success = await this.processOrderCreation(action.data);
              break;
            case 'update_floorplan':
              success = await this.processFloorplanUpdate(action.data);
              break;
            // Add more action types as needed
            default:
              console.warn(`Unknown action type: ${action.type}`);
              success = false;
          }
          
          if (success) {
            // Remove from queue if successful
            this.queue = this.queue.filter(a => a.id !== action.id);
            await this.saveQueue();
            
            // Notify for important actions
            if (['create_order', 'upload_photo'].includes(action.type)) {
              NotificationManager.sendLocalNotification(
                'Sync Complete',
                `Your ${action.type === 'create_order' ? 'order' : 'photos'} have been successfully synchronized.`,
                'appUpdates'
              );
            }
          } else {
            // Increment attempt counter
            action.attempts += 1;
            await this.saveQueue();
            
            // If max attempts reached, notify user
            if (action.attempts >= 5) {
              NotificationManager.sendLocalNotification(
                'Sync Failed',
                `We couldn't complete a ${this.formatActionType(action.type)}. Please try again.`,
                'appUpdates'
              );
            }
          }
        } catch (error) {
          console.error(`Error processing action ${action.id}:`, error);
          action.attempts += 1;
          await this.saveQueue();
        }
        
        // Check if we're still online
        if (!this.isOnline) {
          break;
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
  
  // Format action type for display
  private formatActionType(type: string): string {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // Process a photo upload
  private async processPhotoUpload(data: any): Promise<boolean> {
    try {
      // Implementation would depend on your API
      console.log('Processing photo upload:', data);
      // Example API call to upload photo
      // const response = await fetch('YOUR_API_URL/photos', { ... });
      // return response.ok;
      
      // Simulate upload success after delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return false;
    }
  }
  
  // Process order creation
  private async processOrderCreation(data: any): Promise<boolean> {
    try {
      // Implementation would depend on your API
      console.log('Processing order creation:', data);
      // Example API call to create order
      // const response = await fetch('YOUR_API_URL/orders', { ... });
      // return response.ok;
      
      // Simulate order creation success after delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  }
  
  // Process floorplan update
  private async processFloorplanUpdate(data: any): Promise<boolean> {
    try {
      // Implementation would depend on your API
      console.log('Processing floorplan update:', data);
      // Example API call to update floorplan
      // const response = await fetch(`YOUR_API_URL/floorplans/${data.id}`, { ... });
      // return response.ok;
      
      // Simulate update success after delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error updating floorplan:', error);
      return false;
    }
  }
  
  // Get the current queue
  public getQueue(): QueuedAction[] {
    return [...this.queue];
  }
  
  // Get the queue size
  public getQueueSize(): number {
    return this.queue.length;
  }
  
  // Check if a specific action is in the queue
  public isActionQueued(type: string, matcher: (data: any) => boolean): boolean {
    return this.queue.some(action => action.type === type && matcher(action.data));
  }
  
  // Remove an action from the queue
  public async removeAction(id: string): Promise<void> {
    this.queue = this.queue.filter(action => action.id !== id);
    await this.saveQueue();
  }
  
  // Clear the entire queue
  public async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }
  
  // Save queue to storage
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }
  
  // Load queue from storage
  private async loadQueue(): Promise<void> {
    try {
      const storedQueue = await AsyncStorage.getItem('syncQueue');
      if (storedQueue) {
        this.queue = JSON.parse(storedQueue);
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  }
  
  // Get network status
  public isNetworkAvailable(): boolean {
    return this.isOnline;
  }
}

export default SyncService.getInstance();
