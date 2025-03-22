
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHOTO_DIRECTORY = FileSystem.documentDirectory + 'photos/';
const UPLOAD_QUEUE_KEY = 'uploadQueue';

// Ensure the photos directory exists
const setupPhotoDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIRECTORY, { intermediates: true });
  }
};

// Initialize module
const initialize = async () => {
  await setupPhotoDirectory();
};

// Save photo to local storage with metadata
const savePhoto = async (uri, metadata = {}) => {
  await setupPhotoDirectory();
  
  // Generate a unique filename
  const filename = `photo_${new Date().getTime()}.jpg`;
  const newUri = PHOTO_DIRECTORY + filename;
  
  // Copy photo to app's document directory
  await FileSystem.copyAsync({
    from: uri,
    to: newUri
  });
  
  // Save metadata
  const metadataUri = newUri + '.metadata';
  await FileSystem.writeAsStringAsync(metadataUri, JSON.stringify({
    ...metadata,
    originalUri: uri,
    savedUri: newUri,
    timestamp: new Date().toISOString(),
  }));
  
  return {
    uri: newUri,
    filename,
  };
};

// Add photo to upload queue
const addToUploadQueue = async (uri, metadata = {}) => {
  try {
    // Get current queue
    const queueString = await AsyncStorage.getItem(UPLOAD_QUEUE_KEY);
    const queue = queueString ? JSON.parse(queueString) : [];
    
    // Add new photo to queue
    queue.push({
      uri,
      metadata,
      timestamp: new Date().toISOString(),
      uploaded: false,
    });
    
    // Save updated queue
    await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
    
    return true;
  } catch (error) {
    console.error('Error adding to upload queue:', error);
    return false;
  }
};

// Get all photos in upload queue
const getUploadQueue = async () => {
  try {
    const queueString = await AsyncStorage.getItem(UPLOAD_QUEUE_KEY);
    return queueString ? JSON.parse(queueString) : [];
  } catch (error) {
    console.error('Error getting upload queue:', error);
    return [];
  }
};

// Mark photo as uploaded
const markAsUploaded = async (uri) => {
  try {
    const queue = await getUploadQueue();
    const updatedQueue = queue.map(item => {
      if (item.uri === uri) {
        return { ...item, uploaded: true };
      }
      return item;
    });
    
    await AsyncStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(updatedQueue));
    return true;
  } catch (error) {
    console.error('Error marking photo as uploaded:', error);
    return false;
  }
};

// Basic image enhancement (placeholder for more advanced features)
const enhanceImage = async (uri) => {
  // This would be implemented with actual image processing libraries
  // For now, it's just a placeholder that returns the original URI
  console.log('Enhancing image:', uri);
  return uri;
};

// Consolidate burst mode photos into one entry
const groupBurstPhotos = async (photoUris, metadata = {}) => {
  try {
    const groupId = `burst_${new Date().getTime()}`;
    
    // Save group metadata
    for (let i = 0; i < photoUris.length; i++) {
      const exposureType = i === 0 ? 'underexposed' : (i === 1 ? 'normal' : 'overexposed');
      
      await addToUploadQueue(photoUris[i], {
        ...metadata,
        groupId,
        exposureType,
        exposureIndex: i,
        totalInGroup: photoUris.length,
      });
    }
    
    return groupId;
  } catch (error) {
    console.error('Error grouping burst photos:', error);
    return null;
  }
};

export default {
  initialize,
  savePhoto,
  addToUploadQueue,
  getUploadQueue,
  markAsUploaded,
  enhanceImage,
  groupBurstPhotos,
};
