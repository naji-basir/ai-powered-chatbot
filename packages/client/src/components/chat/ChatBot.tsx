import { useRef, useState } from "react";
import axios from "axios";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import Greeting from "./Greeting";
import ChatInput from "./ChatInput";
import type { ChatFormData } from "./ChatInput";

type ChatResponse = {
  reply: string;
  conversationId: string;
  timestamp: string;
};

type Message = { content: string; role: "user" | "assistant" };

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState("");

  // ✅ generating conversation id
  const conversationId = useRef(crypto.randomUUID());

  // ✅ Handle sending message
  const handleSendMessage = async ({ prompt }: ChatFormData) => {
    try {
      // Add user message
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsAssistantTyping(true);
      setError("");

      // API call
      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId: conversationId.current,
      });

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { content: data.reply, role: "assistant" },
      ]);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setIsAssistantTyping(false);
    }
  };

  return (
    <div className="relative p-4 h-screen w-full flex flex-col items-center gap-4 font-quicksand bg-linear-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700">
      {/* Chat messages */}
      <div className="flex-1 w-full overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [onescrollbar-width:n]">
        <div className="flex flex-col gap-2 py-4 mx-auto max-w-3xl">
          {messages.length === 0 && <Greeting />}
          <ChatMessages messages={messages} />
          {isAssistantTyping && <TypingIndicator />}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>

      {/* Input form */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBot;
