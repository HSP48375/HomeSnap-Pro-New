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
        return styles.statusActive;
      case 'Complete':
        return styles.statusComplete;
      case 'Processing':
        return styles.statusProcessing;
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
      style={styles.gridItem}
      onPress={() => navigateToPropertyDetail(item.id)}
    >
      <View style={styles.gridThumbnail}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="home-outline" size={40} color="#888" />
          </View>
        )}
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
        </View>
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
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => navigateToPropertyDetail(item.id)}
    >
      <View style={styles.listThumbnail}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.listThumbnailImage} />
        ) : (
          <View style={styles.listThumbnailPlaceholder}>
            <Ionicons name="home-outline" size={24} color="#888" />
          </View>
        )}
      </View>
      <View style={styles.listContent}>
        <Text style={styles.propertyTitle} numberOfLines={1}>{item.nickname}</Text>
        <Text style={styles.propertyAddress} numberOfLines={1}>{item.address}</Text>
      </View>
      <View style={styles.listRight}>
        <View style={[styles.listStatusBadge, getStatusStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
        </View>
        <Text style={styles.listDate}>{formatDate(item.lastUpdated)}</Text>
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
    backgroundColor: '#0A0A14',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    flex: 1,
    margin: 8,
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: '47%',
  },
  gridThumbnail: {
    height: 120,
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
  statusActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  statusComplete: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  statusProcessing: {
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
  },
  statusDefault: {
    backgroundColor: 'rgba(142, 142, 147, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#007AFF',
  },
  statusTextComplete: {
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
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  listThumbnail: {
    width: 50,
    height: 50,
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