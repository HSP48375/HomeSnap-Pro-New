
import { OPENAI_API_KEY } from './lib/env';

export async function getChatbotResponse(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Jarvis, an AI assistant for HomeSnap Pro, answering customer questions about real estate photography. Keep responses concise and helpful. Focus on photography tips, editing techniques, and how to use the HomeSnap Pro app for real estate photography.'
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      return "I'm sorry, I couldn't process your request at this time.";
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}
