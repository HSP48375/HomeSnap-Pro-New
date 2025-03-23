
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { getPropertyDetails } from '../lib/api';

const PropertyDetailsPage = () => {
  const route = useRoute();
  const { id } = route.params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const propertyData = await getPropertyDetails(id);
        setProperty(propertyData);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleOrderPhotos = () => {
    navigation.navigate('new-listing', { propertyId: id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="heart" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="share-2" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Image 
          source={{ uri: property.mainImage }} 
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <Text style={styles.address}>{property.address}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="home" size={20} color="#00EEFF" />
              <Text style={styles.statText}>{property.bedrooms} Beds</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="droplet" size={20} color="#00EEFF" />
              <Text style={styles.statText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="square" size={20} color="#00EEFF" />
              <Text style={styles.statText}>{property.squareFeet.toLocaleString()} sqft</Text>
            </View>
          </View>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
              onPress={() => setActiveTab('photos')}
            >
              <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>
                Photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'details' && styles.activeTab]}
              onPress={() => setActiveTab('details')}
            >
              <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'map' && styles.activeTab]}
              onPress={() => setActiveTab('map')}
            >
              <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
                Map
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 'photos' && (
            <View style={styles.photoGrid}>
              {property.images.map((image, index) => (
                <Image 
                  key={index}
                  source={{ uri: image }} 
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              ))}
              
              {property.images.length === 0 && (
                <View style={styles.noPhotosContainer}>
                  <Text style={styles.noPhotosText}>No professional photos available</Text>
                  <TouchableOpacity 
                    style={styles.orderPhotosButton}
                    onPress={handleOrderPhotos}
                  >
                    <Text style={styles.orderPhotosButtonText}>Order Professional Photos</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {activeTab === 'details' && (
            <View style={styles.propertyDetails}>
              <Text style={styles.sectionTitle}>Property Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Property Type</Text>
                <Text style={styles.detailValue}>{property.propertyType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year Built</Text>
                <Text style={styles.detailValue}>{property.yearBuilt}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lot Size</Text>
                <Text style={styles.detailValue}>{property.lotSize} acres</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Garage</Text>
                <Text style={styles.detailValue}>{property.garage} car</Text>
              </View>
              
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Description</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>
          )}
          
          {activeTab === 'map' && (
            <View style={styles.mapContainer}>
              <Text style={styles.mapPlaceholder}>Map view coming soon</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton}>
          <Icon name="phone" size={20} color="#0A0A14" style={styles.buttonIcon} />
          <Text style={styles.contactButtonText}>Contact Agent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={handleOrderPhotos}
        >
          <Icon name="camera" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.orderButtonText}>Order Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A14',
  },
  loadingText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A14',
    padding: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    backgroundColor: '#0A0A14',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A40',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00EEFF',
  },
  tabText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnailImage: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  noPhotosContainer: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A40',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  noPhotosText: {
    color: '#AAAAAA',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  orderPhotosButton: {
    backgroundColor: '#2A2A40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  orderPhotosButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  propertyDetails: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A40',
  },
  detailLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#FFFFFF',
    marginTop: 8,
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  mapPlaceholder: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1A1A2E',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#00EEFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  contactButtonText: {
    color: '#0A0A14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderButton: {
    flex: 1,
    backgroundColor: '#2A2A40',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default PropertyDetailsPage;
