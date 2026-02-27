import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useRef } from "react";

export type Message = { content: string; role: "user" | "assistant" };

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const handleCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selection);
    }
  };

  // ✅ Auto-scroll to bottom
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className=" flex flex-col ">
      {messages.map((message, i) => (
        <div
          key={i}
          ref={lastMessageRef}
          onCopy={handleCopy}
          className={`max-w-[90%] px-4 py-1 rounded-3xl font-medium text-lg my-1 ${
            message.role === "user"
              ? "bg-emerald-300 text-emerald-800 self-end rounded-br-none"
              : "self-start rounded-bl-none"
          }`}
        >
          <div className="max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                // Code blocks with syntax highlighting
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <div className="rounded-lg my-3">
                      <SyntaxHighlighter
                        language={match[1]}
                        PreTag="div"
                        style={vscDarkPlus}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
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
                    <div className="overflow-x-auto my-4 border border-gray-300 dark:border-gray-600">
                      <table
                        className="min-w-full border-collapse"
                        {...props}
                      />
                    </div>
                  );
                },
                th({ node, ...props }) {
                  return (
                    <th
                      className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-slate-600 font-semibold text-left"
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
                    className="overflow-x-auto my-1 px-3 rounded-xl  bg-gray-800 dark:bg-gray-900 text-gray-100  text-base"
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
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
