type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const conversations = new Map<string, ChatMessage[]>();

export const conversationRepository = {
  getConversation: function (conversationId: string) {
    return conversations.get(conversationId) ?? [];
  },

  saveConversation: function (conversationId: string, messages: ChatMessage[]) {
    conversations.set(conversationId, messages);
  },
};
