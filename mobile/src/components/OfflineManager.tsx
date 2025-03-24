import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Modal,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
import { getUploadQueue } from '../utils/storage';
import { syncQueuedData } from '../services/SyncService';
import { colors } from '../theme/AppTheme';
import NotificationManager from '../utils/NotificationManager';


const OfflineManager: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [queueSize, setQueueSize] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [queueDetails, setQueueDetails] = useState<any[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      const wasOffline = isConnected === false;

      setIsConnected(connected);

      // If coming back online, trigger sync and send notification
      if (wasOffline && connected) {
        NotificationManager.sendLocalNotification(
          'Connection Restored',
          'You are back online. Your changes will sync now.',
          'appUpdates'
        );
        triggerSync();
      }
    });

    // Check queue size periodically
    const queueInterval = setInterval(updateQueueSize, 10000);

    // Initial check
    updateQueueSize();
    checkNetworkStatus();

    return () => {
      unsubscribe();
      clearInterval(queueInterval);
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, [isConnected]);

  useEffect(() => {
    // Animate the offline banner in/out based on connection status
    Animated.timing(slideAnim, {
      toValue: !isConnected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedHeight, {
      toValue: !isConnected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isConnected, slideAnim, animatedHeight]);

  const checkNetworkStatus = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected && state.isInternetReachable);
  };

  const updateQueueSize = async () => {
    try {
      const queue = await getUploadQueue();
      setQueueSize(queue.length);
      setQueueDetails(queue);
    } catch (error) {
      console.error('Error updating queue size:', error);
    }
  };

  const triggerSync = async () => {
    if (isSyncing || queueSize === 0) return;

    setIsSyncing(true);
    try {
      await syncQueuedData();
      await updateQueueSize();
      NotificationManager.sendLocalNotification(
        'Sync Complete',
        'Your data has been synchronized successfully.',
        'appUpdates'
      );
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);

      // Schedule another sync if there are still items in the queue
      if (queueSize > 0) {
        syncTimeout.current = setTimeout(triggerSync, 60000); // Try again in a minute
      }
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <MaterialIcons name="photo-camera" size={20} color={colors.primary} />;
      case 'order':
        return <MaterialIcons name="shopping-cart" size={20} color={colors.primary} />;
      case 'floorplan':
        return <MaterialIcons name="house" size={20} color={colors.primary} />;
      default:
        return <MaterialIcons name="cloud-upload" size={20} color={colors.primary} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderQueueDetailItem = (item: any, index: number) => {
    return (
      <View key={`${item.type}-${item.id}`} style={styles.queueItem}>
        <View style={styles.queueItemHeader}>
          {getItemTypeIcon(item.type)}
          <Text style={styles.queueItemType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
          <Text style={styles.queueItemTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text style={styles.queueItemId}>ID: {item.id.substring(0, 8)}...</Text>
        {item.attempts > 0 && (
          <Text style={styles.queueItemAttempts}>Attempts: {item.attempts}</Text>
        )}
      </View>
    );
  };

  const renderQueueDetailsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Queue</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {queueSize === 0 ? (
              <View style={styles.emptyQueueContainer}>
                <MaterialIcons name="check-circle" size={48} color={colors.success} />
                <Text style={styles.emptyQueueText}>All data synced!</Text>
              </View>
            ) : (
              <ScrollView style={styles.queueList}>
                {queueDetails.map(renderQueueDetailItem)}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.syncButton, 
                  (isSyncing || queueSize === 0) && styles.syncButtonDisabled
                ]} 
                onPress={triggerSync}
                disabled={isSyncing || queueSize === 0}
              >
                {isSyncing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.syncButtonText}>Sync Now</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const bannerHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60], // Height of the banner
  });

  return (
    <>
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-60, 0]
          })}] , height: bannerHeight}
        ]}
      >
        <View style={styles.content}>
          <MaterialIcons name="wifi-off" size={20} color="#fff" />
          <Text style={styles.text}>You're offline</Text>
        </View>
      </Animated.View>

      {queueSize > 0 && (
        <TouchableOpacity 
          style={styles.queueButton} 
          onPress={() => setShowDetails(true)}
        >
          <View style={styles.queueContent}>
            <MaterialIcons 
              name={isSyncing ? "sync" : "cloud-upload"} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.queueText}>
              {isSyncing ? 'Syncing...' : `${queueSize} item${queueSize !== 1 ? 's' : ''} pending`}
            </Text>
          </View>
          <View style={styles.queueBadge}>
            <Text style={styles.queueBadgeText}>{queueSize}</Text>
          </View>
        </TouchableOpacity>
      )}

      {renderQueueDetailsModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E53935',
    zIndex: 1000,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  queueButton: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 100,
  },
  queueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  queueText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  queueBadge: {
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  queueBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  queueList: {
    paddingHorizontal: 20,
  },
  queueItem: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  queueItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  queueItemType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 6,
  },
  queueItemTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  queueItemId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  queueItemAttempts: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 4,
  },
  modalFooter: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  syncButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  emptyQueueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyQueueText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});

export default OfflineManager;