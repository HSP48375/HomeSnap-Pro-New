import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this matches your .env file
});
const openai = new OpenAIApi(configuration);

export async function getChatbotResponse(userMessage) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Changed from "gpt-4.5-turbo" to "gpt-4-turbo"
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for HomeSnap Pro, answering customer questions about real estate photography.",
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "Sorry, I'm having trouble answering your question right now.";
  }
}

export default getChatbotResponse;
