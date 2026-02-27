import { IoArrowUp } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { SiGooglegemini } from "react-icons/si";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import TypingIndicator from "./TypingIndicator";

type FormData = { prompt: string };

type ChatResponse = {
  reply: string;
  conversationId: string;
  timestamp: string;
};


const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState("");

  // ✅ generating conversation id
  const conversationId = useRef(crypto.randomUUID());

  const { register, handleSubmit, reset, formState, watch } = useForm<FormData>(
    {
      mode: "onChange",
      defaultValues: { prompt: "" },
    },
  );

  // ✅ refs
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isAssistantTyping]);

  // ✅ Auto-resize textarea
  const promptValue = watch("prompt", "");
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [promptValue]);

  // ✅ Form Submit
  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      reset();
      setIsAssistantTyping(true);

      setError("");
      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId: conversationId.current,
      });

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

  // ✅ Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formState.isValid && !isAssistantTyping) {
        handleSubmit(onSubmit)();
      }
    }
  };
  // ✅
  const handleAttachment = () => {
    // Implement attachment logic
    console.log("Attachment clicked");
  };

  //✅
  const handleVoice = () => {
    // Implement voice input logic
    console.log("Voice input clicked");
  };
 
  };

  return (
    <div className="relative p-4 h-screen w-full flex flex-col items-center gap-4 font-quicksand bg-linear-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700">
      {/* Chat messages */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex flex-col gap-2 py-4 mx-auto max-w-3xl">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 mt-20">
              <SiGooglegemini size={48} className="mb-4 text-emerald-400" />
              <h2 className="text-2xl font-semibold mb-2">Hi, Basir </h2>
              <p>How I can help you?</p>
            </div>
          )}

          {isAssistantTyping && <TypingIndicator />}
          {error && <p>{error}</p>}
        </div>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-3xl bg-white ring-1 ring-gray-300 dark:ring-gray-500/30 dark:bg-slate-800 rounded-2xl flex flex-col gap-2 p-3 opacity-65 shadow-lg"
      >
        <textarea
          {...register("prompt", {
            required: "Message cannot be empty",
            validate: (value) =>
              value.trim().length > 0 || "Message cannot be only spaces",
          })}
          ref={(e) => {
            register("prompt").ref(e);
            textareaRef.current = e;
          }}
          placeholder="Ask anything...)"
          rows={1}
          className="w-full rounded-xl px-3 py-2 focus:outline-none resize-none overflow-y-auto max-h-[40vh] min-h-10 text-base font-medium leading-relaxed bg-transparent dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
        />
        <div className="flex justify-between items-center w-full">
          <SiGooglegemini size={28} className="text-emerald-500 " />
          <div className="flex gap-2 items-center">
            <button
              className="hover:scale-105 transition rounded-full hover:bg-indigo-100 dark:hover:bg-gray-50/10 p-1.5"
              type="button"
              onClick={handleAttachment}
            >
              <RiAttachment2
                className="-rotate-45 text-indigo-700 dark:text-indigo-400"
                size={22}
              />
            </button>
            <button
              className="hover:scale-105 transition  p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              type="button"
              onClick={handleVoice}
              disabled={isAssistantTyping}
            >
              <MdOutlineKeyboardVoice size={22} />
            </button>
            <Button
              type="submit"
              disabled={!formState.isValid || isAssistantTyping}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 flex items-center justify-center rounded-full hover:scale-105 transition "
              aria-label="Send message"
            >
              <IoArrowUp size={30} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
