
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import NetInfo from '@react-native-community/netinfo';

// Directory for storing processed photos
const PHOTO_DIRECTORY = `${FileSystem.documentDirectory}photos/`;

// Interface for photo data
export interface PhotoData {
  id: string;
  uri: string;
  timestamp: number;
  uploaded: boolean;
  type: 'standard' | 'hdr' | 'burst';
  metadata?: any;
}

// Create the photos directory if it doesn't exist
const ensurePhotoDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIRECTORY, { intermediates: true });
  }
};

// Save a photo to local storage
export const savePhoto = async (
  uri: string, 
  type: 'standard' | 'hdr' | 'burst' = 'standard',
  metadata?: any
): Promise<PhotoData> => {
  await ensurePhotoDirectoryExists();
  
  // Generate a unique filename
  const id = `${Date.now().toString()}-${Math.floor(Math.random() * 1000)}`;
  const newUri = `${PHOTO_DIRECTORY}${id}.jpg`;
  
  // Copy the photo to our app's directory
  await FileSystem.copyAsync({
    from: uri,
    to: newUri
  });
  
  // Create photo data object
  const photoData: PhotoData = {
    id,
    uri: newUri,
    timestamp: Date.now(),
    uploaded: false,
    type,
    metadata
  };
  
  // Save the photo data to our local database
  await savePhotoData(photoData);
  
  return photoData;
};

// Save photo data to local storage (simulated database)
const savePhotoData = async (photoData: PhotoData): Promise<void> => {
  try {
    // Get existing photos array
    const existingDataStr = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}photoIndex.json`,
      { encoding: FileSystem.EncodingType.UTF8 }
    ).catch(() => '[]');
    
    const existingData: PhotoData[] = JSON.parse(existingDataStr);
    
    // Add new photo
    existingData.push(photoData);
    
    // Save updated array
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}photoIndex.json`,
      JSON.stringify(existingData),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error('Error saving photo data:', error);
    throw error;
  }
};

// Get all saved photos
export const getAllPhotos = async (): Promise<PhotoData[]> => {
  try {
    const dataStr = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}photoIndex.json`,
      { encoding: FileSystem.EncodingType.UTF8 }
    ).catch(() => '[]');
    
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
};

// Get photos that need to be uploaded
export const getPendingUploads = async (): Promise<PhotoData[]> => {
  const allPhotos = await getAllPhotos();
  return allPhotos.filter(photo => !photo.uploaded);
};

// Mark a photo as uploaded
export const markPhotoAsUploaded = async (photoId: string): Promise<void> => {
  try {
    const allPhotos = await getAllPhotos();
    const updatedPhotos = allPhotos.map(photo => 
      photo.id === photoId ? { ...photo, uploaded: true } : photo
    );
    
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}photoIndex.json`,
      JSON.stringify(updatedPhotos),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error('Error marking photo as uploaded:', error);
    throw error;
  }
};

// Delete a photo
export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    const allPhotos = await getAllPhotos();
    const photoToDelete = allPhotos.find(photo => photo.id === photoId);
    
    if (photoToDelete) {
      // Delete the file
      await FileSystem.deleteAsync(photoToDelete.uri);
      
      // Update the index
      const updatedPhotos = allPhotos.filter(photo => photo.id !== photoId);
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}photoIndex.json`,
        JSON.stringify(updatedPhotos),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};

// Basic image enhancement (brightness, contrast, saturation)
export const enhanceImage = async (
  uri: string, 
  options: { 
    brightness?: number, 
    contrast?: number, 
    saturation?: number 
  } = {}
): Promise<string> => {
  const actions = [];
  
  // Default enhancement values if not provided
  const brightness = options.brightness ?? 0.1;
  const contrast = options.contrast ?? 0.1;
  const saturation = options.saturation ?? 0.1;
  
  // Add manipulations based on provided options
  if (brightness !== 0) {
    actions.push({ brightness });
  }
  
  if (contrast !== 0) {
    actions.push({ contrast });
  }
  
  if (saturation !== 0) {
    actions.push({ saturate: saturation });
  }
  
  // Apply manipulations
  const result = await ImageManipulator.manipulateAsync(
    uri,
    actions,
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  return result.uri;
};

// Upload manager
export const syncPhotos = async (): Promise<void> => {
  // Check network connection
  const netState = await NetInfo.fetch();
  
  if (!netState.isConnected) {
    console.log('Not connected to the internet, will try later');
    return;
  }
  
  // Get pending uploads
  const pendingUploads = await getPendingUploads();
  
  if (pendingUploads.length === 0) {
    console.log('No pending uploads');
    return;
  }
  
  // Upload all pending photos
  for (const photo of pendingUploads) {
    try {
      // In a real app, you'd call your API here
      // const success = await uploadToServer(photo.uri);
      
      // Simulate a successful upload
      const success = true;
      
      if (success) {
        await markPhotoAsUploaded(photo.id);
        console.log(`Uploaded photo ${photo.id}`);
      }
    } catch (error) {
      console.error(`Failed to upload photo ${photo.id}:`, error);
    }
  }
};

// Start background sync process
export const startBackgroundSync = (intervalMinutes = 5): () => void => {
  // Sync immediately
  syncPhotos();
  
  // Then set up interval
  const intervalId = setInterval(syncPhotos, intervalMinutes * 60 * 1000);
  
  // Return a function to stop the sync
  return () => clearInterval(intervalId);
};
