
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample data for orders
const SAMPLE_ORDERS = [
  {
    id: '1',
    address: '123 Main St, Los Angeles, CA',
    type: 'Professional Photos',
    status: 'Completed',
    date: '2023-09-15',
    thumbnail: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3',
    price: '$149.99'
  },
  {
    id: '2',
    address: '456 Oak Ave, San Francisco, CA',
    type: 'Virtual Staging',
    status: 'Processing',
    date: '2023-09-20',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
    price: '$99.99'
  },
  {
    id: '3',
    address: '789 Pine Blvd, Seattle, WA',
    type: 'Floorplan',
    status: 'Pending',
    date: '2023-09-25',
    thumbnail: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3',
    price: '$79.99'
  }
];

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Processing', 'Completed'];
  
  const filteredOrders = activeTab === 'All' 
    ? SAMPLE_ORDERS 
    : SAMPLE_ORDERS.filter(order => order.status === activeTab);
  
  const renderStatusBadge = (status: string) => {
    let backgroundColor;
    switch (status) {
      case 'Completed':
        backgroundColor = '#4CAF50';
        break;
      case 'Processing':
        backgroundColor = '#2196F3';
        break;
      case 'Pending':
        backgroundColor = '#FF9800';
        break;
      default:
        backgroundColor = '#9E9E9E';
    }
    
    return (
      <View style={[styles.badge, { backgroundColor }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    );
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem}>
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
      />
      <View style={styles.orderDetails}>
        <Text style={styles.orderAddress} numberOfLines={1}>{item.address}</Text>
        <Text style={styles.orderType}>{item.type}</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.orderDate}>{item.date}</Text>
          <Text style={styles.orderPrice}>{item.price}</Text>
        </View>
      </View>
      {renderStatusBadge(item.status)}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#333" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        )}
      />
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#00EEFF',
  },
  tabText: {
    color: '#CCCCCC',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000000',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    marginBottom: 16,
    padding: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  orderAddress: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  orderType: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 6,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDate: {
    color: '#888888',
    fontSize: 12,
  },
  orderPrice: {
    color: '#00EEFF',
    fontWeight: '600',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
});

export default OrdersScreen;
