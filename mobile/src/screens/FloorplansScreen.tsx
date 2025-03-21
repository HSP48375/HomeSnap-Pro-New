
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FloorplansScreen = () => {
  const mockData = [
    { id: '1', name: 'Modern 2BR Apartment', date: 'Mar 15, 2025' },
    { id: '2', name: 'Luxury Villa', date: 'Mar 12, 2025' },
    { id: '3', name: 'Downtown Studio', date: 'Mar 10, 2025' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Floorplans</Text>
      </View>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 15,
  },
  item: {
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
    color: '#AAAAAA',
  },
});

export default FloorplansScreen;
