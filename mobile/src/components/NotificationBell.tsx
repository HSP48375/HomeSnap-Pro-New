
import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import NotificationManager from '../utils/NotificationManager';

interface NotificationBellProps {
  color?: string;
  size?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ 
  color = '#FFF', 
  size = 24 
}) => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  const pulseAnim = new Animated.Value(1);
  
  useEffect(() => {
    // Initial load
    updateUnreadCount();
    
    // Set up interval to periodically check for new notifications
    const interval = setInterval(updateUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Animate badge when unread count changes
    if (unreadCount > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [unreadCount]);
  
  const updateUnreadCount = () => {
    const count = NotificationManager.getUnreadCount();
    setUnreadCount(count);
  };
  
  const handlePress = () => {
    navigation.navigate('Notifications');
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Icon name="bell" size={size} color={color} />
      
      {unreadCount > 0 && (
        <Animated.View 
          style={[
            styles.badge,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationBell;
