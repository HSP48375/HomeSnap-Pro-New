import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import getChatbotResponse from "../src/Chatbot"; // Fixed the import path!

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const response = await getChatbotResponse(userMessage);
    setChatResponse(response);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.responseText}>
        {chatResponse || "Ask me anything about real estate photography!"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Type your question..."
        placeholderTextColor="#999"
        value={userMessage}
        onChangeText={setUserMessage}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    margin: 20,
    borderColor: "#4A4A4A",
    borderWidth: 1,
  },
  responseText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    padding: 10,
    color: "white",
    marginBottom: 10,
    backgroundColor: "#2C2C2E",
  },
});

export default ChatInterface;
