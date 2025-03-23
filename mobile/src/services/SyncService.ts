
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
