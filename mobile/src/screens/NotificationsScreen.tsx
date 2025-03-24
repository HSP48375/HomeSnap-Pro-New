
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import NotificationManager, { NotificationData, NotificationPreferences } from '../utils/NotificationManager';

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(NotificationManager.getPreferences());
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = () => {
    const notifs = NotificationManager.getNotifications();
    setNotifications(notifs);
  };
  
  const handleMarkAsRead = async (id: string) => {
    await NotificationManager.markAsRead(id);
    loadNotifications();
  };
  
  const handleMarkAllAsRead = async () => {
    await NotificationManager.markAllAsRead();
    loadNotifications();
  };
  
  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await NotificationManager.clearNotifications();
            loadNotifications();
          },
        },
      ]
    );
  };
  
  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await NotificationManager.savePreferences({ [key]: value });
  };
  
  const renderNotificationItem = ({ item }: { item: NotificationData }) => {
    const getIconName = (type: string) => {
      switch (type) {
        case 'orderUpdates': return 'file-text';
        case 'photoEditing': return 'image';
        case 'payments': return 'credit-card';
        case 'floorplanUpdates': return 'layout';
        case 'appUpdates': return 'refresh-cw';
        case 'promotions': return 'gift';
        default: return 'bell';
      }
    };
    
    return (
      <TouchableOpacity 
        style={[styles.notificationItem, item.read ? styles.notificationRead : styles.notificationUnread]}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <View style={styles.notificationIcon}>
          <Icon name={getIconName(item.type)} size={24} color="#00EEFF" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        {!item.read && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };
  
  const renderEmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off" size={50} color="#666" />
      <Text style={styles.emptyText}>No notifications yet</Text>
    </View>
  );
  
  const renderNotificationsTab = () => (
    <>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.actionButtonText}>Mark All as Read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
          <Text style={styles.actionButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={notifications.length === 0 ? { flex: 1 } : {}}
        ListEmptyComponent={renderEmptyNotifications}
      />
    </>
  );
  
  const renderSettingsTab = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>Notification Preferences</Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>Order Updates</Text>
          <Text style={styles.preferenceDescription}>Status changes and delivery updates</Text>
        </View>
        <Switch
          value={preferences.orderUpdates}
          onValueChange={(value) => updatePreference('orderUpdates', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.orderUpdates ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>Photo Editing</Text>
          <Text style={styles.preferenceDescription}>When your photos are ready to view</Text>
        </View>
        <Switch
          value={preferences.photoEditing}
          onValueChange={(value) => updatePreference('photoEditing', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.photoEditing ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>Payment Notifications</Text>
          <Text style={styles.preferenceDescription}>Charges, receipts, and payment issues</Text>
        </View>
        <Switch
          value={preferences.payments}
          onValueChange={(value) => updatePreference('payments', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.payments ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>Floorplan Updates</Text>
          <Text style={styles.preferenceDescription}>Processing status and completion</Text>
        </View>
        <Switch
          value={preferences.floorplanUpdates}
          onValueChange={(value) => updatePreference('floorplanUpdates', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.floorplanUpdates ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>App Updates</Text>
          <Text style={styles.preferenceDescription}>New features and version releases</Text>
        </View>
        <Switch
          value={preferences.appUpdates}
          onValueChange={(value) => updatePreference('appUpdates', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.appUpdates ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceTextContainer}>
          <Text style={styles.preferenceName}>Promotions & Offers</Text>
          <Text style={styles.preferenceDescription}>Special deals and marketing messages</Text>
        </View>
        <Switch
          value={preferences.promotions}
          onValueChange={(value) => updatePreference('promotions', value)}
          trackColor={{ false: '#767577', true: '#00EEFF44' }}
          thumbColor={preferences.promotions ? '#00EEFF' : '#f4f3f4'}
        />
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]} 
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {activeTab === 'notifications' ? renderNotificationsTab() : renderSettingsTab()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#999',
    fontSize: 16,
  },
  activeTabText: {
    color: '#00EEFF',
  },
  content: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    padding: 8,
  },
  actionButtonText: {
    color: '#00EEFF',
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  notificationUnread: {
    backgroundColor: 'rgba(0, 238, 255, 0.05)',
  },
  notificationRead: {
    backgroundColor: 'transparent',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#999',
    fontSize: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00EEFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 16,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  preferenceTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  preferenceName: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  preferenceDescription: {
    color: '#999',
    fontSize: 14,
  },
});

export default NotificationsScreen;
