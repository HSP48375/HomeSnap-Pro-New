
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FloorplansScreen from '../screens/FloorplansScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Create stack navigators for each tab
const HomeStack = createStackNavigator();
const CameraStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const FloorplansStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const AuthStack = createStackNavigator();

// Stack navigator components
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
  </HomeStack.Navigator>
);

const CameraStackNavigator = () => (
  <CameraStack.Navigator screenOptions={{ headerShown: false }}>
    <CameraStack.Screen name="CameraMain" component={CameraScreen} />
  </CameraStack.Navigator>
);

const OrdersStackNavigator = () => (
  <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
    <OrdersStack.Screen name="OrdersMain" component={OrdersScreen} />
    <OrdersStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
  </OrdersStack.Navigator>
);

const FloorplansStackNavigator = () => (
  <FloorplansStack.Navigator screenOptions={{ headerShown: false }}>
    <FloorplansStack.Screen name="FloorplansMain" component={FloorplansScreen} />
  </FloorplansStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Auth Stack
const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Camera':
            iconName = focused ? 'camera' : 'camera-outline';
            break;
          case 'Orders':
            iconName = focused ? 'document-text' : 'document-text-outline';
            break;
          case 'Floorplans':
            iconName = focused ? 'grid' : 'grid-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipse';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#00EEFF',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#0A0A14',
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
      },
      headerStyle: {
        backgroundColor: '#0A0A14',
      },
      headerTintColor: '#FFFFFF',
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Camera" component={CameraStackNavigator} />
    <Tab.Screen name="Orders" component={OrdersStackNavigator} />
    <Tab.Screen name="Floorplans" component={FloorplansStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
  </Tab.Navigator>
);

export { TabNavigator, AuthStackNavigator };
