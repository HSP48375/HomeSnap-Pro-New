import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


// Screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FloorplansScreen from '../screens/FloorplansScreen';
import ChatbotScreen from '../screens/ChatbotScreen'; // Added import for ChatbotScreen
import NotificationsScreen from '../screens/NotificationsScreen'; // Added import for NotificationsScreen

import NotificationBell from '../components/NotificationBell'; // Added import for NotificationBell

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom tab bar button for the main action (Camera)
const TabBarCenterButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.centerButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#E91E63', '#2196F3']} // Vivid Magenta and Electric Blue
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.centerButtonGradient, styles.glowingEffect]} // Apply glowing effect
      >
        <View style={styles.centerButtonInner}>
          {children}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Camera':
              iconName = 'camera';
              break;
            case 'Gallery':
              iconName = 'image';
              break;
            case 'Orders':
              iconName = 'file-text';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Lighter inactive color
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins', // Use Poppins font
          marginBottom: 6,
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: 'rgba(20, 20, 30, 0.85)', // Darker gray
          borderTopWidth: 0, // Remove border
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          elevation: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={90} // Slightly stronger blur
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          />
        ),
        headerRight: () => <NotificationBell navigation={navigation} />, // Added headerRight for NotificationBell
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          tabBarButton: (props) => <TabBarCenterButton {...props} />,
        }}
      />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1a2e' }, // Dark gray background
        animation: 'fade_from_bottom',
}}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main stack including tabs and other screens
const MainStack = createNativeStackNavigator();

export const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1a2e' }, // Dark gray background
        animation: 'slide_from_right',
}}
    >
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <MainStack.Screen name="Floorplans" component={FloorplansScreen} />
      <MainStack.Screen name="Chatbot" component={ChatbotScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} /> {/* Added Notifications Screen */}
    </MainStack.Navigator>
  );
};

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3', // Electric blue for glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, // Increased opacity for stronger glow
    shadowRadius: 15, // Increased radius for larger glow
    elevation: 8,
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(20, 20, 30, 0.5)', // Slightly darker and more opaque
    justifyContent: 'center',
    alignItems: 'center',
  },
 glowingEffect: {
    shadowColor: '#2196F3', // Electric blue glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
});