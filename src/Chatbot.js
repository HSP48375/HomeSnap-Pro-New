// Photography prompt examples
export const photographyPrompts = [
  "What's the best angle for exterior home photos?",
  "How do I photograph small rooms to make them look larger?",
  "Tips for bathroom photography?"
];

// Floor plan prompt examples
export const floorplanPrompts = [
  "What details should I include in a floor plan?",
  "How do I measure room dimensions accurately?"
];

// Default export for the getChatbotResponse function
export default function getChatbotResponse(message) {
  return `Response to: ${message}`;
}
