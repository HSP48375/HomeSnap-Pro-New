import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabNavigator, AuthStackNavigator } from './src/navigation/AppNavigator';
import ChatInterface from './src/components/ChatInterface';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

    checkAuth();
  }, []);

  if (isLoading) {
    // Return a loading screen if needed
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {isAuthenticated ? <TabNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
      <ChatInterface />
    </SafeAreaProvider>
  );
};

export default App;