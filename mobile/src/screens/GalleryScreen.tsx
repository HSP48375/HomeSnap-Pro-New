
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 

  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  StyleSheet,

  useWindowDimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import { StatusBadge } from '../components/ui/StatusBadge';

import { getAllPhotos, PhotoData, deletePhoto, enhanceImage } from '../services/PhotoService';

const GalleryScreen = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const navigation: any = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const loadPhotos = async () => {
    setLoading(true);
    try {
      const photoData = await getAllPhotos();
      setPhotos(photoData.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhotoPress = (photo: PhotoData) => {
    setSelectedPhoto(photo);
  };
  
  const closePreview = () => {
    setSelectedPhoto(null);
  };
  
  const handleShare = async () => {
    if (!selectedPhoto) return;
    
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing not available on this device');
        return;
      }
      
      await Sharing.shareAsync(selectedPhoto.uri);
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Error', 'Failed to share photo');
    }
  };
  
  const handleDelete = async () => {
    if (!selectedPhoto) return;
    
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePhoto(selectedPhoto.id);
              setSelectedPhoto(null);
              loadPhotos();
            } catch (error) {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
            }
          }
        }
      ]
    );
  };
  
  const handleEnhance = async () => {
    if (!selectedPhoto) return;
    
    setProcessing(true);
    try {
      const enhancedUri = await enhanceImage(selectedPhoto.uri, {
        brightness: 0.1,
        contrast: 0.1,
        saturation: 0.2
      });
      
      // Save enhanced image to gallery
      await MediaLibrary.saveToLibraryAsync(enhancedUri);
      
      Alert.alert('Success', 'Enhanced photo saved to gallery');
    } catch (error) {
      console.error('Error enhancing photo:', error);
      Alert.alert('Error', 'Failed to enhance photo');
    } finally {
      setProcessing(false);
    }
  };
  
  const renderItem = ({ item }: { item: PhotoData }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePhotoPress(item)}
    >
      <Image 
        source={{ uri: item.uri }} 
        style={styles.thumbnail}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Project: {item.id.substring(0, 8)}</Text>
        <Text style={styles.cardDate}>
          Submitted: {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <View style={styles.statusBadgeContainer}>
          {/* Replace with actual job status logic */}
          <StatusBadge status={
            item.id.endsWith('a') ? 'In Progress' :
            item.id.endsWith('b') ? 'Delivered' : 'Edit Requested'
          } />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderPhotoPreview = () => {
    if (!selectedPhoto) return null;
    
    return (
      <View style={styles.previewContainer}>
        <View style={styles.previewHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEnhance} disabled={processing}>
              {processing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="color-wand" size={24} color="white" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Image 
          source={{ uri: selectedPhoto.uri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        <View style={styles.previewFooter}>
            {selectedPhoto.type === 'standard' ? 'Standard' : 
             selectedPhoto.type === 'hdr' ? 'HDR' : 'Burst'}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {selectedPhoto ? (
        renderPhotoPreview()
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Projects Gallery</Text>
            <View style={{ width: 40 }} />
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00EEFF" />
            </View>
          ) : photos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={80} color="#333" />
              <Text style={styles.emptyText}>No photos yet</Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Camera' as never)}
              >
                <Text style={styles.buttonText}>Take Photos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={photos.filter(photo => photo.type !== 'enhanced')} // Filter out enhanced photos
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={1} // Display in a single column for card layout
              contentContainerStyle={styles.cardGridContainer}
              key={1} // Add key to force re-render when filtering
            />
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D2B', // Deep space background
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0A0A14',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#00EEFF', // Neon blue glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardGridContainer: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Soft glassmorphism
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderColor: '#00EEFF', // Neon border
    borderWidth: 1,
    shadowColor: '#00EEFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  thumbnail: {
    width: '100%',
    height: 200, // Adjust as needed
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BBEEFF', // Lighter neon blue
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: '#99CCFF', // Even lighter neon blue
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 238, 255, 0.2)', // Semi-transparent neon
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    borderColor: '#00EEFF',
    borderWidth: 1,
    shadowColor: '#00EEFF',
    shadowRadius: 10,
  },
  buttonText: {
    color: '#00EEFF', // Neon blue text
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewFooter: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0A0A14',
    alignItems: 'center',
  },
  previewText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  statusBadgeContainer: { marginTop: 10 },
});

export default GalleryScreen;
