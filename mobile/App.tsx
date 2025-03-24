import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';
import { TabNavigator, AuthStackNavigator } from './src/navigation/AppNavigator';
import ChatInterface from './src/components/ChatInterface';
import FloatingChatButton from './src/components/FloatingChatButton';
import { colors } from './src/theme/AppTheme';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import OfflineManager from './src/components/OfflineManager';
import NotificationManager from './src/utils/NotificationManager'; // Placeholder - Needs implementation


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false); // Added for notification initialization

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(userToken !== null);
      } catch (error) {
        console.log('Error checking authentication', error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeApp = async () => {
      try {
        // Set up notification handler
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        // Listen for notifications
        const subscription = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received:', notification);
        });

        // Initialize notification manager
        await NotificationManager.initialize(); // Placeholder - Needs implementation

        // Get push token
        const token = await NotificationManager.registerForPushNotifications(); // Placeholder - Needs implementation
        console.log('Push notification token:', token);

        setIsReady(true);

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsReady(true); // Continue even if there's an error
      }
    };

    checkAuth();
    initializeApp();
  }, []);

  if (isLoading || !fontsLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <ActivityIndicator size="large" color="#00EEFF" />
        <Text style={{ color: 'white', marginTop: 16 }}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.background,
              text: colors.textPrimary,
              border: 'transparent',
              notification: colors.secondary,
            },
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          {isAuthenticated ? (
            <>
              <TabNavigator />
              <FloatingChatButton />
              <OfflineManager />
              {/* Placeholder for in-app notification bell component */}
            </>
          ) : (
            <AuthStackNavigator />
          )}
        </NavigationContainer>
        <ChatInterface />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;