import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Sample property data
const sampleProperties = [
  {
    id: 1,
    address: '1234 Oceanview Dr, Miami, FL',
    nickname: 'Beach House Listing',
    status: 'Active',
    photos: 24,
    lastUpdated: '2025-03-19T14:30:00',
    thumbnail: null // Replace with actual images in production
  },
  {
    id: 2,
    address: '567 Mountain View Rd, Denver, CO',
    nickname: 'Mountain Retreat',
    status: 'Complete',
    photos: 18,
    lastUpdated: '2025-03-15T10:15:00',
    thumbnail: null
  },
  {
    id: 3,
    address: '890 Sunset Blvd, Los Angeles, CA',
    nickname: 'LA Luxury Condo',
    status: 'Processing',
    photos: 32,
    lastUpdated: '2025-03-18T09:45:00',
    thumbnail: null
  }
];

const OrdersScreen = () => {
  const [viewMode, setViewMode] = useState('grid');
  const navigation = useNavigation();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return styles.statusInProgress;
      case 'Complete':
        return styles.statusComplete;
      case 'Processing':
        return styles.statusInProgress; // Assuming Processing is also In Progress
      default:
        return styles.statusDefault;
    } 
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case 'Active':
        return styles.statusTextActive;
      case 'Complete':
        return styles.statusTextComplete; 
      case 'Processing':
        return styles.statusTextProcessing;
      default:
        return styles.statusTextDefault;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const navigateToPropertyDetail = (id) => {
    navigation.navigate('PropertyDetail', { id });
  };

  const navigateToNewListing = () => {
    navigation.navigate('NewListing');
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, styles.gridItem]}
      onPress={() => navigateToPropertyDetail(item.id)}
    >
      <View style={styles.gridThumbnail}>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
            {item.status}
          </Text>
        </View>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="home-outline" size={40} color="#888" />
          </View>
        )}
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.propertyTitle} numberOfLines={1}>{item.nickname}</Text>
        <Text style={styles.propertyAddress} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} color="#888" /> {item.address}
        </Text>
        <View style={styles.gridFooter}>
          <Text style={styles.gridFooterText}>
            <Ionicons name="calendar-outline" size={14} color="#888" /> {formatDate(item.lastUpdated)}
          </Text>
          <Text style={styles.gridFooterText}>{item.photos} photos</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToPropertyDetail(item.id)}>
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Ionicons name="arrow-forward-circle-outline" size={18} color="#0A0A14" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, styles.listItem]}
      onPress={() => navigateToPropertyDetail(item.id)}
    >
      <View style={[styles.listThumbnail, { position: 'relative' }]}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.listThumbnailImage} />
        ) : (
          <View style={styles.listThumbnailPlaceholder}>
            <Ionicons name="home-outline" size={24} color="#888" />
          </View>
        )}
      </View>
      <View style={styles.listContent}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {item.nickname}
        </Text>
        <Text style={styles.propertyAddress} numberOfLines={1}>
          {item.address}
        </Text>
        <Text style={styles.listDate}>Submitted: {formatDate(item.lastUpdated)}</Text>
      </View>
      <View style={styles.listRight}>
        <View style={[styles.listStatusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToPropertyDetail(item.id)}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Property Listings</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToNewListing}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>New Property</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search by address or nickname</Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid-outline" size={20} color={viewMode === 'grid' ? '#00EEFF' : '#fff'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list-outline" size={20} color={viewMode === 'list' ? '#00EEFF' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sampleProperties}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={item => item.id.toString()}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // This forces a re-render when viewMode changes
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
 flex: 1,
    backgroundColor: '#0D0D2D', // Dark background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1, // Subtle neon border at the bottom
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00EEFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#0A0A14',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#888',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#1A1A24',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    padding: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#1F1F2C',
  },
  listContainer: {
    padding: 8,
  },
  gridItem: {
    flex: 0.5, // Adjust flex for proper spacing in grid
    marginHorizontal: 4, // Reduced horizontal margin
    marginVertical: 8, // Increased vertical margin
    backgroundColor: 'rgba(26, 26, 36, 0.5)', // Semi-transparent dark background
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#00EEFF', // Neon border
    borderWidth: 1,
    shadowColor: '#00EEFF', // Neon glow
  },
  gridThumbnail: {
    backgroundColor: '#0F0F1A',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusComplete: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)', // Green for Delivered
    borderColor: '#34C759', // Green border
    borderWidth: 1,
    shadowColor: '#34C759', // Green glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  statusInProgress: {
    backgroundColor: 'rgba(255, 204, 0, 0.2)', // Yellow for In Progress
    borderColor: '#FFCC00', // Yellow border
    borderWidth: 1,
    shadowColor: '#FFCC00', // Yellow glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  statusEditRequested: { // Red for Edit Requested
    backgroundColor: 'rgba(255, 59, 48, 0.2)', 
    borderColor: '#FF3B30',
    borderWidth: 1,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  statusDefault: {
    backgroundColor: 'rgba(142, 142, 147, 0.2)', // Default grey
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#34C759',
  },
  statusTextProcessing: {
    color: '#FFCC00',
  },
  statusTextDefault: {
    color: '#8E8E93',
  },
  gridContent: {
    padding: 12,
  },
  propertyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  propertyAddress: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridFooterText: {
    color: '#888',
    fontSize: 12,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 36, 0.5)', // Semi-transparent dark background
    borderRadius: 12,
    padding: 12,
    marginVertical: 8, // Increased vertical margin
    marginHorizontal: 4, // Reduced horizontal margin
    alignItems: 'center',
    borderColor: '#00EEFF', // Neon border
    borderWidth: 1,
    shadowColor: '#00EEFF', // Neon glow
  },
  listThumbnail: {
    borderRadius: 8,
    backgroundColor: '#0F0F1A',
    marginRight: 12,
    overflow: 'hidden',
  },
  listThumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listThumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  listDate: {
    color: '#888',
    fontSize: 12,
  },
});

export default OrdersScreen;