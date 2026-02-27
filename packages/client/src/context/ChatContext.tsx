// import React, { createContext, useContext, useRef, useState, ReactNode, useCallback } from 'react';
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Types
export type Message = {
  content: string;
  role: "user" | "assistant";
};

type ChatResponse = {
  reply: string;
  conversationId: string;
  timestamp: string;
};

interface ChatContextType {
  messages: Message[];
  isAssistantTyping: boolean;
  error: string;
  conversationId: React.MutableRefObject<string>;
  sendMessage: (prompt: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider props
interface ChatProviderProps {
  children: ReactNode;
}

// Provider component
export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState("");

  // ✅ generating conversation id (persists for the session)
  const conversationId = useRef(crypto.randomUUID());

  const sendMessage = useCallback(async (prompt: string) => {
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
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAssistantTyping(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const value = {
    messages,
    isAssistantTyping,
    error,
    conversationId,
    sendMessage,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook for using the context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
