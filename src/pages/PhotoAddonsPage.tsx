
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const addons = [
  { 
    id: 'virtual_staging', 
    name: 'Virtual Staging', 
    description: 'Digitally furnish empty rooms to help buyers visualize the space', 
    price: 75,
    image: require('../assets/virtual-staging.jpg')
  },
  { 
    id: 'video_walkthrough', 
    name: 'Video Walkthrough', 
    description: 'Professional video tour of the property (up to 2 minutes)', 
    price: 150,
    image: require('../assets/video-walkthrough.jpg')
  },
  { 
    id: 'floor_plan', 
    name: '2D Floor Plan', 
    description: 'Detailed floor plan showing room dimensions and layout', 
    price: 100,
    image: require('../assets/floor-plan.jpg')
  },
  { 
    id: '3d_tour', 
    name: '3D Virtual Tour', 
    description: 'Immersive 3D tour allowing buyers to explore the property virtually', 
    price: 200,
    image: require('../assets/3d-tour.jpg')
  }
];

const PhotoAddonsPage = () => {
  const route = useRoute();
  const { selectedServices, basePrice } = route.params;
  const [selectedAddons, setSelectedAddons] = useState({});
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const navigation = useNavigation();

  const toggleAddon = (addonId, price) => {
    const newSelections = {
      ...selectedAddons,
      [addonId]: !selectedAddons[addonId]
    };
    
    setSelectedAddons(newSelections);
    
    // Calculate new total
    const addonsCost = addons.reduce((sum, addon) => {
      return sum + (newSelections[addon.id] ? addon.price : 0);
    }, 0);
    
    setTotalPrice(basePrice + addonsCost);
  };

  const handleCheckout = () => {
    const finalServices = [
      ...selectedServices,
      ...addons
        .filter(addon => selectedAddons[addon.id])
        .map(addon => ({ id: addon.id, name: addon.name, price: addon.price }))
    ];
    
    navigation.navigate('checkout', {
      services: finalServices,
      totalPrice: totalPrice
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Enhance Your Listing</Text>
        <Text style={styles.subtitle}>
          Add these premium features to make your listing stand out
        </Text>
        
        <View style={styles.addonsList}>
          {addons.map(addon => (
            <TouchableOpacity
              key={addon.id}
              style={[
                styles.addonCard,
                selectedAddons[addon.id] && styles.selectedCard
              ]}
              onPress={() => toggleAddon(addon.id, addon.price)}
            >
              <Image 
                source={addon.image} 
                style={styles.addonImage}
                resizeMode="cover"
              />
              
              <View style={styles.addonContent}>
                <View style={styles.addonHeader}>
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedAddons[addon.id] && styles.checkedBox
                  ]}>
                    {selectedAddons[addon.id] && (
                      <Icon name="check" size={16} color="#0A0A14" />
                    )}
                  </View>
                </View>
                
                <Text style={styles.addonDescription}>{addon.description}</Text>
                <Text style={styles.addonPrice}>${addon.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.selectedServicesSection}>
          <Text style={styles.sectionTitle}>Selected Base Services:</Text>
          {selectedServices.map(service => (
            <View key={service.id} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.price}>${totalPrice}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 24,
  },
  addonsList: {
    marginBottom: 24,
  },
  addonCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#00EEFF',
  },
  addonImage: {
    width: '100%',
    height: 160,
  },
  addonContent: {
    padding: 16,
  },
  addonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2A2A40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#00EEFF',
    borderColor: '#00EEFF',
  },
  addonDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  addonPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00EEFF',
  },
  selectedServicesSection: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A40',
  },
  serviceName: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: '#AAAAAA',
    marginRight: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
});

export default PhotoAddonsPage;
