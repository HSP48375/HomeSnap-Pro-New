import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingTour from '../components/OnboardingTour';
import { useOnboardingTour } from '../hooks/useOnboardingTour';

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { isTourVisible, endTour } = useOnboardingTour();

  const handleTourComplete = () => {
    endTour();
  };

  const handleTourSkip = () => {
    endTour();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <OnboardingTour
          isVisible={isTourVisible}
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Transform Your Real Estate Photos</Text>
          <Text style={styles.heroSubtitle}>
            Professional editing services for realtors and property managers
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Upload')}
          >
            <Icon name="upload" size={20} color="#fff" />
            <Text style={styles.buttonText}>Start Taking Photos Now</Text>
          </TouchableOpacity>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <Icon name={service.icon} size={32} color="#00EEFF" />
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>${service.price}/photo</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name={feature.icon} size={24} color="#00EEFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const services = [
  { title: 'Standard Editing', price: '1.50', icon: 'image' },
  { title: 'Virtual Staging', price: '10.00', icon: 'home' },
  { title: 'Twilight Effect', price: '3.99', icon: 'sun' },
  { title: 'Decluttering', price: '2.99', icon: 'trash-2' },
];

const features = [
  {
    title: '24-Hour Turnaround',
    description: 'Get your edited photos back within 24 hours',
    icon: 'clock',
  },
  {
    title: 'Professional Quality',
    description: 'Expert editors with real estate experience',
    icon: 'award',
  },
  {
    title: 'Easy Upload',
    description: 'Simple and intuitive photo upload process',
    icon: 'upload-cloud',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  hero: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    backgroundColor: '#0A0A14',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00EEFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#1A1A28',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 14,
    color: '#00EEFF',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A28',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default HomeScreen;