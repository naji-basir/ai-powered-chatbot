import { Ollama } from "ollama";
import { conversationRepository } from "../repositories/conversations.repository";

// GET response from Ollama API
const client = new Ollama({
  host: "https://ollama.com",
  // headers: { Authorization: "Bearer " + process.env.OLLAMA_API_KEY },
  headers: {
    Authorization:
      "Bearer " + "5660fe5034dd4ec1996c2040efec4cd8.Vuk43EJfSYuzIlEiyFjcAdR3",
  },
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const chatService = {
  async sendMessage(prompt: string, conversationId: string) {
    try {
      // 1️⃣ Get conversation history
      const history = conversationRepository.getConversation(conversationId);

      // 2️⃣ Prepare messages with new prompt
      const userMessage: ChatMessage = { role: "user", content: prompt };
      const messagesToSend = [...history, userMessage];

      // 3️⃣ Call Ollama API
      const response = await client.chat({
        model: "gpt-oss:120b",
        messages: messagesToSend,
        options: {
          temperature: 0.4,
        },
      });

      // 4️⃣ Prepare assistant response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response?.message?.content ?? "No response returned!",
      };

      // 5️⃣ Save updated conversation (both user message and assistant response)
      const updatedHistory = [...history, userMessage, assistantMessage];
      conversationRepository.saveConversation(conversationId, updatedHistory);

      // 6️⃣ Return the assistant's response
      return {
        reply: assistantMessage.content,
        conversationId,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(
        "Ollama service error:",
        error?.response?.data || error.message,
      );
      throw new Error("Failed to get response from AI service");
    }
  },

  // Optional: Add more service methods
  async getConversationHistory(conversationId: string) {
    return conversationRepository.getConversation(conversationId);
  },

  async clearConversation(conversationId: string) {
    conversationRepository.saveConversation(conversationId, []);
    return { message: "Conversation cleared" };
  },
};
