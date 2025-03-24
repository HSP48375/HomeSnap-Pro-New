// mobile/src/utils/storage.js
export const savePhotoLocally = async (uri, metadata) => {
  try {
    const id = Date.now(); // Simple ID generation, replace with a better solution
    const data = { uri, ...metadata, id };
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(`photo-${id}`, stringifiedData);
    return data;
  } catch (error) {
    console.error('Error saving photo locally:', error);
    throw error;
  }
};


// mobile/src/screens/UploadScreen.tsx (Partial - Assuming existing structure)
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import * as storage from '../utils/storage';
import NotificationManager from '../utils/NotificationManager';
import SyncService from '../services/SyncService';

function CameraScreen() {
  // ... existing state variables ...

  // Handle the photo being taken
  const handlePhotoTaken = async (photo) => {
    try {
      // Use our offline storage system
      console.log('Photo taken:', photo.uri);

      // Import the storage utility
      const { savePhotoLocally } = require('../utils/storage');

      // Save photo with metadata
      const savedPhoto = await savePhotoLocally(photo.uri, {
        location: currentLocation,
        propertyId: currentProperty?.id,
        captureTime: new Date().toISOString(),
        photoType: selectedCategory
      });

      // Update the UI
      setPhotos(prev => [...prev, { 
        uri: photo.uri, 
        timestamp: new Date().toISOString(),
        uploaded: false,
        id: savedPhoto.id
      }]);

      setIsSaving(false);
    } catch (error) {
      console.error('Error handling photo:', error);
      setIsSaving(false);
    }
  };

  // Submit photos
  const handleSubmit = async () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('No Photos', 'Please select at least one photo to upload');
      return;
    }

    setUploading(true);

    try {
      // Check if we're online
      const networkState = await NetInfo.fetch();
      const isConnected = networkState.isConnected;

      if (isConnected) {
        // Simulate API upload
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send notification
        await NotificationManager.sendLocalNotification(
          'Upload Complete',
          `${selectedPhotos.length} photos for ${propertyInfo.name || 'your property'} have been uploaded successfully!`,
          'photoEditing'
        );

        Alert.alert(
          'Upload Successful', 
          'Your photos have been uploaded successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        // Store for later upload using storage
        await storage.storeForUpload(selectedPhotos, propertyInfo);

        // Add to sync queue
        await SyncService.enqueueAction('upload_photo', {
          photos: selectedPhotos.map(p => p.uri),
          property: propertyInfo
        });

        Alert.alert(
          'Saved for Upload', 
          'Your photos will be uploaded automatically when you are back online.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'There was an error uploading your photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ... rest of CameraScreen component ...
}

export default CameraScreen;