
import React, { useState, useRef, useEffect } from 'react';
import getChatbotResponse, { photographyPrompts, floorplanPrompts } from './src/Chatbot';

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([{
    type: 'bot',
    text: "Hello! I'm Jarvis, your HomeSnap Pro assistant. How can I help with your real estate photography needs?"
  }]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    
    const newUserMessage = userMessage;
    setUserMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', text: newUserMessage }]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Get response from chatbot
      const response = await getChatbotResponse(newUserMessage);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handlePromptClick = (prompt) => {
    setUserMessage(prompt);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: isExpanded ? 400 : 300,
      height: isExpanded ? 500 : 'auto',
      backgroundColor: '#0A0A14',
      borderRadius: 10,
      padding: 0,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', margin: 0 }}>Jarvis - Photography Assistant</h3>
        <button 
          onClick={toggleExpanded} 
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          padding: '8px 12px',
          backgroundColor: 'rgba(26, 26, 46, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {[...photographyPrompts.slice(0, 3), ...floorplanPrompts.slice(0, 2)].map((prompt, index) => (
            <div 
              key={index}
              onClick={() => handlePromptClick(prompt)}
              style={{
                backgroundColor: 'rgba(121, 40, 202, 0.2)',
                padding: '6px 12px',
                borderRadius: '16px',
                marginRight: '8px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'white',
                border: '1px solid rgba(121, 40, 202, 0.5)'
              }}
            >
              {prompt}
            </div>
          ))}
        </div>
      )}
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: isExpanded ? '366px' : '180px',
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.type === 'user' ? '#7928CA' : '#2A2A40',
              padding: '10px 14px',
              borderRadius: '18px',
              borderBottomRightRadius: msg.type === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.type === 'bot' ? '4px' : '18px',
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}
          >
            <p style={{ 
              margin: 0, 
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {msg.text}
            </p>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(42, 42, 64, 0.7)',
            padding: '8px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#00EEFF',
              animation: 'pulse 1.5s infinite'
            }}></div>
            <span style={{ color: '#CCCCCC', fontSize: '14px' }}>Jarvis is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#1A1A2E',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '10px'
      }}>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about photography..."
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#2A2A40',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            resize: 'none',
            height: '40px',
            maxHeight: '80px',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: '#7928CA',
            color: 'white',
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
