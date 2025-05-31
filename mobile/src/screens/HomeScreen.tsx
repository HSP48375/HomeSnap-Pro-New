
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const services = [
    { title: 'Standard Editing', price: '1.50', icon: 'image' },
    { title: 'Virtual Staging', price: '10.00', icon: 'home' },
    { title: 'Twilight Effect', price: '3.99', icon: 'sun' },
    { title: 'Decluttering', price: '2.99', icon: 'trash-2' },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
        <Text style={styles.title}>HomeSnap Pro</Text>
        <Text style={styles.subtitle}>Professional Real Estate Photography</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesContainer}>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.darkBackground]}>
        <Text style={styles.neonSectionTitle}>Tutorials</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.tutorialCard}>
              <View style={styles.videoPlaceholder}>
                {/* Placeholder for video thumbnail */}
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
                <View style={styles.durationContainer}>
                  <Text style={styles.durationText}>2:30</Text>
                </View>
              </View>
              <Text style={styles.tutorialTitle}>How to use HomeSnap Pro</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        {/* Add more sections here */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    paddingBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00EEFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#0A0A14',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  neonSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00EEFF', // Neon color
    marginBottom: 15,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    color: '#00EEFF',
    fontWeight: 'bold',
  },
  darkBackground: {
    backgroundColor: '#0A0A14', // Dark background for the tutorial section
    padding: 20,
  },
  tutorialCard: {
    width: 200, // Adjust as needed
    marginRight: 15,
    backgroundColor: '#1A1A2E', // Darker background for cards
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: 120, // Adjust as needed
    backgroundColor: '#0D0D21', // Even darker background for video area
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#00EEFF', // Neon color for play button
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Position over the placeholder
    shadowColor: '#00EEFF', // Glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  playButtonText: {
    color: '#0A0A14', // Dark color for the play icon
    fontSize: 20,
  },
  tutorialTitle: {
    color: '#FFFFFF',
  },
  durationContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark background
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  durationText: {
    color: '#00EEFF', // Neon color for duration text
    fontSize: 12,
  },
});

export default HomeScreen;
