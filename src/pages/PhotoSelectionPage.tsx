
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const photoCategories = [
  { id: 'interior', name: 'Interior Photos', price: 25 },
  { id: 'exterior', name: 'Exterior Photos', price: 25 },
  { id: 'aerial', name: 'Aerial/Drone Photos', price: 50 },
  { id: 'twilight', name: 'Twilight Photos', price: 40 },
  { id: 'community', name: 'Community Photos', price: 30 },
];

const PhotoSelectionPage = () => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();

  const toggleCategory = (categoryId, price) => {
    const newSelections = {
      ...selectedCategories,
      [categoryId]: !selectedCategories[categoryId]
    };
    
    setSelectedCategories(newSelections);
    
    // Calculate new total
    const newTotal = photoCategories.reduce((sum, category) => {
      return sum + (newSelections[category.id] ? category.price : 0);
    }, 0);
    
    setTotalPrice(newTotal);
  };

  const handleContinue = () => {
    const selectedServices = Object.keys(selectedCategories)
      .filter(key => selectedCategories[key])
      .map(key => {
        const category = photoCategories.find(c => c.id === key);
        return {
          id: key,
          name: category.name,
          price: category.price
        };
      });
    
    navigation.navigate('photo-addons', { 
      selectedServices,
      basePrice: totalPrice
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Select Photo Services</Text>
        <Text style={styles.subtitle}>
          Choose the types of photos you need for your property listing
        </Text>
        
        <View style={styles.categoryList}>
          {photoCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategories[category.id] && styles.selectedCard
              ]}
              onPress={() => toggleCategory(category.id, category.price)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryPrice}>${category.price}</Text>
              </View>
              
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  selectedCategories[category.id] && styles.checkedBox
                ]}>
                  {selectedCategories[category.id] && (
                    <Icon name="check" size={16} color="#0A0A14" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What's included:</Text>
          <View style={styles.infoItem}>
            <Icon name="check-circle" size={16} color="#00EEFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>Professional photography</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="check-circle" size={16} color="#00EEFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>High-resolution images</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="check-circle" size={16} color="#00EEFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>Photo editing and enhancement</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="check-circle" size={16} color="#00EEFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>Delivery within 48 hours</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.price}>${totalPrice}</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !Object.values(selectedCategories).some(v => v) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!Object.values(selectedCategories).some(v => v)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  categoryList: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  selectedCard: {
    borderColor: '#00EEFF',
  },
  cardContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 14,
    color: '#00EEFF',
  },
  checkboxContainer: {
    marginLeft: 16,
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
  infoSection: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
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
  continueButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  disabledButton: {
    backgroundColor: '#2A2A40',
    opacity: 0.5,
  },
});

export default PhotoSelectionPage;
