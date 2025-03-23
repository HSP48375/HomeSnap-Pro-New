
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
            content: `You are PIP (Property Image Pal), an AI assistant for HomeSnap Pro, specifically focused on real estate photography and floorplan services.
            
Your knowledge includes:
- Professional real estate photography techniques
- Best practices for property photos (lighting, angles, composition)
- HomeSnap Pro's services (photo packages, floorplans, virtual staging)
- Image editing and post-processing tips
- Floorplan creation and scanning guidance
- HomeSnap Pro order management system

When users ask about order status, offer to check their order and guide them to the Orders tab.
If users ask about floorplans, explain how to use the AR scanning feature in the mobile app.
Keep responses friendly, concise and practical. Use photography terminology correctly.`
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
    });

    const data = await response.json();
    
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

// Photography-specific prompt suggestions
export const photographyPrompts = [
  "What's the best time of day for exterior property photos?",
  "How can I make small rooms look larger in photos?",
  "Tips for photographing properties with poor lighting?",
  "What equipment do I need for professional real estate photos?",
  "How to stage a home for photography?"
];

// Floorplan-related prompt suggestions
export const floorplanPrompts = [
  "How does the floorplan scanning feature work?",
  "What's the difference between 2D and 3D floorplans?",
  "How accurate are the AR floorplan measurements?",
  "Can I edit room labels after scanning?",
  "How do I share a floorplan with clients?"
];

// Order-related prompt suggestions
export const orderPrompts = [
  "How do I check my order status?",
  "How long do photo edits typically take?",
  "Can I upgrade my photo package?",
  "How to provide feedback on completed photos?",
  "What's included in the premium floorplan package?"
];
