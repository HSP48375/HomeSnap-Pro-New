
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getChatbotResponse } from '../Chatbot';
import { colors } from '../theme/AppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: "Hello! I'm Jarvis, your HomeSnap Pro assistant. How can I help you with real estate photography today?", 
      sender: 'bot' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef(null);

  const suggestedPrompts = [
    "Tips for property photography",
    "How to capture floor plans",
    "Best time for real estate photos",
    "Help with image editing",
    "Check my order status"
  ];

  const handleSendMessage = async () => {
    if (inputText.trim() === '' && !selectedImage) return;
    
    Keyboard.dismiss();
    
    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      image: selectedImage
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setSelectedImage(null);
    scrollToBottom();
    
    setIsLoading(true);
    
    try {
      // Add image context if there's an image
      let userPrompt = inputText;
      if (selectedImage) {
        userPrompt += " (Note: User has attached an image for reference)";
      }
      
      const response = await getChatbotResponse(userPrompt);
      
      // Add bot's response
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot'
        }
      ]);
      
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("You need to allow access to your photos to attach images.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("There was an error selecting your image. Please try again.");
    }
  };

  const handlePromptPress = (prompt) => {
    setInputText(prompt);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Jarvis - Photography Assistant</Text>
      </LinearGradient>
      
      {/* Suggested prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsContainer}>
        {suggestedPrompts.map((prompt, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.promptBubble}
            onPress={() => handlePromptPress(prompt)}
          >
            <Text style={styles.promptText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble, 
              message.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}
          >
            {message.image && (
              <Image source={{ uri: message.image }} style={styles.messageImage} />
            )}
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Jarvis is thinking...</Text>
          </View>
        )}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
            <TouchableOpacity 
              style={styles.removeImageBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about photography..."
            placeholderTextColor="#6B7280"
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!inputText.trim() && !selectedImage) ? styles.sendButtonDisabled : {}
            ]} 
            onPress={handleSendMessage}
            disabled={!inputText.trim() && !selectedImage}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  promptsContainer: {
    padding: 10,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  promptBubble: {
    backgroundColor: 'rgba(121, 40, 202, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(121, 40, 202, 0.5)',
  },
  promptText: {
    color: '#fff',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '85%',
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#7928CA',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#2A2A40',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.45,
    borderRadius: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(42, 42, 64, 0.7)',
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  loadingText: {
    color: '#CCCCCC',
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A40',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#7928CA',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(121, 40, 202, 0.5)',
  },
  selectedImageContainer: {
    padding: 10,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  selectedImagePreview: {
    width: 100,
    height: 75,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
});

export default ChatbotScreen;
