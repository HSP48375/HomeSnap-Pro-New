
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';

// Keys for AsyncStorage
const KEYS = {
  CAPTURED_PHOTOS: 'offline_captured_photos',
  DRAFT_ORDERS: 'offline_draft_orders',
  FLOORPLAN_DATA: 'offline_floorplan_data',
  UPLOAD_QUEUE: 'offline_upload_queue',
};

// Photo storage
export const savePhotoLocally = async (photoUri, metadata = {}) => {
  try {
    const photos = await getCapturedPhotos();
    const newPhoto = {
      id: uuidv4(),
      uri: photoUri,
      timestamp: new Date().toISOString(),
      uploaded: false,
      metadata,
    };
    
    photos.push(newPhoto);
    await AsyncStorage.setItem(KEYS.CAPTURED_PHOTOS, JSON.stringify(photos));
    
    // Add to upload queue
    await addToUploadQueue({
      type: 'photo',
      id: newPhoto.id,
      uri: photoUri,
      metadata,
    });
    
    return newPhoto;
  } catch (error) {
    console.error('Error saving photo locally:', error);
    throw error;
  }
};

export const getCapturedPhotos = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CAPTURED_PHOTOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting captured photos:', error);
    return [];
  }
};

// Draft orders storage
export const saveDraftOrder = async (orderData) => {
  try {
    const drafts = await getDraftOrders();
    const newDraft = {
      id: orderData.id || uuidv4(),
      data: orderData,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    
    // Update if exists, otherwise add
    const existingIndex = drafts.findIndex(draft => draft.id === newDraft.id);
    if (existingIndex >= 0) {
      drafts[existingIndex] = newDraft;
    } else {
      drafts.push(newDraft);
    }
    
    await AsyncStorage.setItem(KEYS.DRAFT_ORDERS, JSON.stringify(drafts));
    
    // Add to upload queue if not already synced
    if (!newDraft.synced) {
      await addToUploadQueue({
        type: 'order',
        id: newDraft.id,
        data: orderData,
      });
    }
    
    return newDraft;
  } catch (error) {
    console.error('Error saving draft order:', error);
    throw error;
  }
};

export const getDraftOrders = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.DRAFT_ORDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting draft orders:', error);
    return [];
  }
};

// Floorplan data storage
export const saveFloorplanData = async (floorplanData) => {
  try {
    const floorplans = await getFloorplanData();
    const newFloorplan = {
      id: floorplanData.id || uuidv4(),
      data: floorplanData,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    
    // Update if exists, otherwise add
    const existingIndex = floorplans.findIndex(fp => fp.id === newFloorplan.id);
    if (existingIndex >= 0) {
      floorplans[existingIndex] = newFloorplan;
    } else {
      floorplans.push(newFloorplan);
    }
    
    await AsyncStorage.setItem(KEYS.FLOORPLAN_DATA, JSON.stringify(floorplans));
    
    // Add to upload queue if not already synced
    if (!newFloorplan.synced) {
      await addToUploadQueue({
        type: 'floorplan',
        id: newFloorplan.id,
        data: floorplanData,
      });
    }
    
    return newFloorplan;
  } catch (error) {
    console.error('Error saving floorplan data:', error);
    throw error;
  }
};

export const getFloorplanData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.FLOORPLAN_DATA);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting floorplan data:', error);
    return [];
  }
};

// Upload queue management
export const addToUploadQueue = async (item) => {
  try {
    const queue = await getUploadQueue();
    // Check if item already exists in queue
    const existingIndex = queue.findIndex(queueItem => 
      queueItem.type === item.type && queueItem.id === item.id
    );
    
    if (existingIndex >= 0) {
      queue[existingIndex] = {
        ...item,
        timestamp: new Date().toISOString(),
        attempts: (queue[existingIndex].attempts || 0),
      };
    } else {
      queue.push({
        ...item,
        timestamp: new Date().toISOString(),
        attempts: 0,
      });
    }
    
    await AsyncStorage.setItem(KEYS.UPLOAD_QUEUE, JSON.stringify(queue));
    return queue;
  } catch (error) {
    console.error('Error adding to upload queue:', error);
    throw error;
  }
};

export const getUploadQueue = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.UPLOAD_QUEUE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting upload queue:', error);
    return [];
  }
};

export const removeFromUploadQueue = async (type, id) => {
  try {
    const queue = await getUploadQueue();
    const newQueue = queue.filter(item => !(item.type === type && item.id === id));
    await AsyncStorage.setItem(KEYS.UPLOAD_QUEUE, JSON.stringify(newQueue));
    
    // Mark item as synced in its respective storage
    if (type === 'photo') {
      await markPhotoAsUploaded(id);
    } else if (type === 'order') {
      await markOrderAsSynced(id);
    } else if (type === 'floorplan') {
      await markFloorplanAsSynced(id);
    }
    
    return newQueue;
  } catch (error) {
    console.error('Error removing from upload queue:', error);
    throw error;
  }
};

// Helper functions to mark items as synced
const markPhotoAsUploaded = async (id) => {
  const photos = await getCapturedPhotos();
  const updatedPhotos = photos.map(photo => 
    photo.id === id ? { ...photo, uploaded: true } : photo
  );
  await AsyncStorage.setItem(KEYS.CAPTURED_PHOTOS, JSON.stringify(updatedPhotos));
};

const markOrderAsSynced = async (id) => {
  const orders = await getDraftOrders();
  const updatedOrders = orders.map(order => 
    order.id === id ? { ...order, synced: true } : order
  );
  await AsyncStorage.setItem(KEYS.DRAFT_ORDERS, JSON.stringify(updatedOrders));
};

const markFloorplanAsSynced = async (id) => {
  const floorplans = await getFloorplanData();
  const updatedFloorplans = floorplans.map(floorplan => 
    floorplan.id === id ? { ...floorplan, synced: true } : floorplan
  );
  await AsyncStorage.setItem(KEYS.FLOORPLAN_DATA, JSON.stringify(updatedFloorplans));
};

// Clear all data (for testing or logout)
export const clearAllOfflineData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.CAPTURED_PHOTOS,
      KEYS.DRAFT_ORDERS,
      KEYS.FLOORPLAN_DATA,
      KEYS.UPLOAD_QUEUE,
    ]);
  } catch (error) {
    console.error('Error clearing offline data:', error);
    throw error;
  }
};
