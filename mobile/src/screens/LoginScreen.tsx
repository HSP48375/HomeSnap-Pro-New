
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import TextInput from "../components/ui/TextInput"; // Import the styled TextInput

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // In a real app, you would validate and authenticate here
    navigation.navigate('MainTabs');
  };

  return (
    <LinearGradient colors={['#0A0A14', '#16213E']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>HomeSnap Pro</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-transparent border border-[#00EEFF] text-[#FFFFFF]" // Added Tailwind classes
            containerClassName="mb-5" // Added Tailwind container classes
            placeholderClassName="text-[#999]" // Added Tailwind placeholder classes
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => setPassword(text)}
            className="bg-transparent border border-[#00EEFF] text-[#FFFFFF]" // Added Tailwind classes
            placeholderClassName="text-[#999]" // Added Tailwind placeholder classes
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LinearGradient
            colors={['#00EEFF', '#FF6EC7']} // Neon gradient
            style={styles.loginButtonGradient}
          ><Text style={styles.loginButtonText}>Login</Text></LinearGradient>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center the card vertically
    alignItems: 'center', // Center the card horizontally
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Soft glassmorphism background
    borderRadius: 20,
    padding: 30,
    width: '90%', // Adjust width as needed
    maxWidth: 400, // Maximum width for larger screens
    borderWidth: 2, // Neon border
    borderColor: '#00EEFF', // Neon border color
    shadowColor: '#00EEFF', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20, // For Android shadow
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00EEFF',
  },
  formContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#00EEFF',
  },
  loginButton: {
    backgroundColor: '#00EEFF',
    borderRadius: 15, // More rounded button
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // Ensure gradient stays within bounds
  },
  loginButtonGradient: {
    width: '100%',
    padding: 15,
  }, // Renamed for clarity
  loginButtonText: {
    color: '#0A0A14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#CCCCCC',
  },
  registerLink: {
    color: '#00EEFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
