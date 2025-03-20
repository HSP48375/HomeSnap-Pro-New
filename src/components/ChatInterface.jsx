
import React, { useState } from 'react';

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    // Temporary placeholder response
    setChatResponse('This is a test response. The actual AI integration will be added later.');
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 300,
      backgroundColor: '#0A0A14',
      borderRadius: 10,
      padding: 16,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 9999
    }}>
      <h3 style={{ color: 'white', margin: '0 0 10px' }}>HomeSnap Assistant</h3>
      <div style={{
        color: 'white',
        minHeight: '60px',
        marginBottom: '10px'
      }}>
        {chatResponse || "Ask me anything!"}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your question..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '8px',
          backgroundColor: '#1A1A24',
          color: 'white',
          border: '1px solid #444',
          borderRadius: '5px'
        }}
      />
      <button
        onClick={handleSendMessage}
        style={{
          backgroundColor: '#00EEFF',
          color: 'black',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          float: 'right'
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInterface;
