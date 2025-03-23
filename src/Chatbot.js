
export default async function getChatbotResponse(userMessage) {
  try {
    // In a real implementation, we would call the OpenAI API here
    // For now, we'll simulate a response
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn("No OpenAI API key found in environment variables");
      // Return simulated response for now
      return simulateResponse(userMessage);
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
      return simulateResponse(userMessage);
    }
    
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    return simulateResponse(userMessage);
  }
}

// Fallback function to simulate responses when API is not available
function simulateResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('floor') || message.includes('plan') || message.includes('layout')) {
    return "Our floorplan tool lets you create professional floor layouts. You can use our mobile app to scan rooms with AR technology, or upload existing plans through the web interface. Would you like me to show you how to get started?";
  }
  
  if (message.includes('photo') || message.includes('picture') || message.includes('image')) {
    return "For professional real estate photography, I recommend using natural light when possible, a wide-angle lens (but not too wide), and a tripod for stability. Our editing team can enhance lighting, color, and remove minor imperfections. Would you like tips for a specific room type?";
  }
  
  if (message.includes('order') || message.includes('status')) {
    return "I can help you check on your order status. Please go to the Orders tab to see all your current and past orders. Each order shows its current status, estimated completion time, and any notes from the photography team.";
  }
  
  // Default response
  return "I'm here to help with HomeSnap Pro services! I can provide tips on real estate photography, explain our floorplan technology, help with orders, or answer questions about our photo packages. What information are you looking for today?";
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
