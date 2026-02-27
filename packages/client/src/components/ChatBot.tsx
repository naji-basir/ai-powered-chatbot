import { IoArrowUp } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { SiGooglegemini } from "react-icons/si";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type FormData = { prompt: string };

type ChatResponse = {
  reply: string;
  conversationId: string;
  timestamp: string;
};

type Message = { content: string; role: "user" | "assistant" };

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState, watch } = useForm<FormData>(
    {
      mode: "onChange",
      defaultValues: { prompt: "" },
    },
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const promptValue = watch("prompt", "");

  // Auto-scroll to bottom
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [promptValue]);

  const onSubmit = async ({ prompt }: FormData) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((prev) => [...prev, { content: trimmedPrompt, role: "user" }]);
    reset();
    setLoading(true);

    try {
      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt: trimmedPrompt,
        conversationId: conversationId.current,
      });
      setMessages((prev) => [
        ...prev,
        { content: data.reply, role: "assistant" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          content: "**Error:** Something went wrong. Please try again.",
          role: "assistant",
        },
      ]);
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formState.isValid && !loading) {
        handleSubmit(onSubmit)();
      }
    }
  };

  const handleAttachment = () => {
    // Implement attachment logic
    console.log("Attachment clicked");
  };

  const handleVoice = () => {
    // Implement voice input logic
    console.log("Voice input clicked");
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

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[90%] px-4 py-1 rounded-3xl my-1 text-base font-medium  ${
                msg.role === "user"
                  ? "bg-emerald-300 text-emerald-800 self-end rounded-br-none"
                  : " self-start rounded-bl-none"
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    // Code blocks with syntax highlighting
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg my-3"
                          st
                          yle={vscDarkPlus}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    // Tables
                    table({ node, ...props }) {
                      return (
                        <div className="overflow-x-auto my-4 border border-gray-300 dark:border-gray-600 ">
                          <table
                            className=" min-w-full border-collapse"
                            {...props}
                          />
                        </div>
                      );
                    },
                    th({ node, ...props }) {
                      return (
                        <th
                          className="border border-gray-300  dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-slate-600 font-semibold text-left"
                          {...props}
                        />
                      );
                    },
                    td({ node, ...props }) {
                      return (
                        <td
                          className="border border-gray-300 dark:border-gray-600 px-4 py-2"
                          {...props}
                        />
                      );
                    },
                    // Code blocks (fallback for pre)
                    pre: ({ node, ...props }) => (
                      <pre
                        className="overflow-x-automy-3 bg-gray-800 dark:bg-gray-900 text-gray-100 rounded-lg text-base "
                        {...props}
                      />
                    ),
                    // Paragraphs with word break
                    p: ({ node, ...props }) => (
                      <p
                        className="wrap-break-word m-0.5 leading-relaxed"
                        {...props}
                      />
                    ),
                    // Links
                    a: ({ node, ...props }) => (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        {...props}
                      />
                    ),
                    // Lists
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-6 my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-6 my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="my-0.5" {...props} />
                    ),
                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 dark:border-gray-500 pl-4 my-2 italic"
                        {...props}
                      />
                    ),
                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                      <hr
                        className="my-6 border-gray-300 dark:border-gray-600"
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="self-start px-4 py-3 text-gray-400 dark:text-gray-300 rounded-2xl bg-gray-50 dark:bg-slate-700 animate-pulse rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
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
              disabled={loading}
            >
              <MdOutlineKeyboardVoice size={22} />
            </button>
            <Button
              type="submit"
              disabled={!formState.isValid || loading}
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
