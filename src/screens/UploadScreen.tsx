import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import Toast from 'react-native-toast-message';

interface Photo {
  id: string;
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
}

interface Suggestion {
  id: string;
  text: string;
  ctaAction: string;
  ctaPayload: any;
}

const SmartSuggestions = ({ imageUrls, propertyType, onSuggestionSelected }) => {
  // Placeholder for image analysis and suggestion generation
  const suggestions: Suggestion[] = [
    { id: '1', text: 'Empty room detected, suggest virtual staging?', ctaAction: 'add_service', ctaPayload: { service: 'virtualStaging' } },
    { id: '2', text: 'Exterior shot, suggest twilight conversion?', ctaAction: 'add_service', ctaPayload: { service: 'twilightConversion' } },
    { id: '3', text: 'Cluttered space detected, suggest virtual decluttering?', ctaAction: 'add_service', ctaPayload: { service: 'decluttering' } },
  ];

  return (
    <View>
      {suggestions.map(suggestion => (
        <TouchableOpacity key={suggestion.id} onPress={() => onSuggestionSelected(suggestion)}>
          <Text>{suggestion.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const UploadScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedServices, setSelectedServices] = useState({
    standardEditing: true,
    virtualStaging: false,
    twilightConversion: false,
    decluttering: false,
  });
  const [propertyType, setPropertyType] = useState(''); // Add property type state

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newPhoto: Photo = {
          id: Date.now().toString(),
          uri: asset.uri!,
          fileName: asset.fileName!,
          type: asset.type!,
          fileSize: asset.fileSize!,
        };
        setPhotos(prev => [...prev, newPhoto]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo',
      });
    }
  };

  const handleSelectPhotos = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 0,
      });

      if (result.assets) {
        const newPhotos: Photo[] = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random(),
          uri: asset.uri!,
          fileName: asset.fileName!,
          type: asset.type!,
          fileSize: asset.fileSize!,
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select photos',
      });
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const toggleService = (service: keyof typeof selectedServices) => {
    if (service === 'standardEditing') return; // Standard editing cannot be disabled
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  const calculateTotal = () => {
    const basePrice = 1.50 * photos.length; // Standard editing
    let total = basePrice;

    if (selectedServices.virtualStaging) {
      total += 10.00 * photos.length;
    }
    if (selectedServices.twilightConversion) {
      total += 3.99 * photos.length;
    }
    if (selectedServices.decluttering) {
      total += 2.99 * photos.length;
    }

    // Apply volume discount
    if (photos.length >= 20) {
      total *= 0.85; // 15% discount
    } else if (photos.length >= 10) {
      total *= 0.9; // 10% discount
    }

    return total.toFixed(2);
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to continue.');
      return;
    }
    // Navigate to checkout or next step
    // navigation.navigate('Checkout', { photos, services: selectedServices });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Photo Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>
          <Text style={styles.sectionSubtitle}>
            Take new photos or select from your gallery
          </Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleTakePhoto}
            >
              <Icon name="camera" size={24} color={colors.text} />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleSelectPhotos}
            >
              <Icon name="image" size={24} color={colors.text} />
              <Text style={styles.uploadButtonText}>Select Photos</Text>
            </TouchableOpacity>
          </View>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map(photo => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemovePhoto(photo.id)}
                  >
                    <Icon name="x" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Services</Text>
          {Object.entries(selectedServices).map(([service, selected]) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.serviceItem,
                selected && styles.serviceItemSelected,
                service === 'standardEditing' && styles.serviceItemDisabled,
              ]}
              onPress={() => toggleService(service as keyof typeof selectedServices)}
              disabled={service === 'standardEditing'}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>
                  {service
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())}
                </Text>
                <Text style={styles.servicePrice}>
                  ${service === 'virtualStaging' ? '10.00' : service === 'twilightConversion' ? '3.99' : service === 'decluttering' ? '2.99' : '1.50'}/photo
                </Text>
              </View>
              <Icon
                name={selected ? 'check-circle' : 'circle'}
                size={24}
                color={selected ? colors.primary : colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Photos</Text>
              <Text style={styles.summaryValue}>{photos.length}</Text>
            </View>
            {photos.length >= 10 && (
              <View style={styles.discountBadge}>
                <Icon name="tag" size={16} color={colors.neonGreen} />
                <Text style={styles.discountText}>
                  {photos.length >= 20 ? '15% Volume Discount' : '10% Volume Discount'}
                </Text>
              </View>
            )}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${calculateTotal()}</Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue to Checkout</Text>
              <Icon name="arrow-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
        {photos.length > 0 && (
          <SmartSuggestions imageUrls={photos.map(photo => photo.uri)} propertyType={propertyType} onSuggestionSelected={(suggestion) => {
            if (suggestion.ctaAction === 'add_service') {
              const service = suggestion.ctaPayload.service;
              setSelectedServices(prev => ({ ...prev, [service]: true }));
              Toast.show({
                type: 'success',
                text1: 'Service Added',
                text2: `Added ${service.replace('_', ' ')} to your order.`,
              });
            }
          }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.darkLight,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  uploadButtonText: {
    color: colors.text,
    marginTop: 8,
    fontSize: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  photoContainer: {
    width: '33.33%',
    padding: 6,
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceItemSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  serviceItemDisabled: {
    opacity: 0.8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neonGreen + '20',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  discountText: {
    color: colors.neonGreen,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default UploadScreen;