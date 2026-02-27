import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { SiGooglegemini } from "react-icons/si";
import { IoArrowUp } from "react-icons/io5";

export type ChatFormData = { prompt: string };

type Props = {
  onSendMessage: (data: ChatFormData) => void;
};

const ChatInput = ({ onSendMessage }: Props) => {
  const { register, handleSubmit, reset, formState, watch } =
    useForm<ChatFormData>({
      mode: "onChange",
      defaultValues: { prompt: "" },
    });

  // ✅ Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const promptValue = watch("prompt", "");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [promptValue]);

  // ✅ Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formState.isValid) {
        handleSubmit(handleFormSubmit)();
      }
    }
  };

  const handleFormSubmit = (data: ChatFormData) => {
    reset();
    onSendMessage(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
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
        placeholder="Ask anything..."
        rows={1}
        className="w-full rounded-xl px-3 py-2 focus:outline-none resize-none overflow-y-auto max-h-[40vh] min-h-10 text-base font-medium leading-relaxed bg-transparent dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
      />

      <div className="flex justify-between items-center w-full">
        <SiGooglegemini size={28} className="text-emerald-500" />

        <div className="flex gap-2 items-center">
          <button
            className="hover:scale-105 transition rounded-full hover:bg-indigo-100 dark:hover:bg-gray-50/10 p-1.5"
            type="button"
          >
            <RiAttachment2
              className="-rotate-45 text-indigo-700 dark:text-indigo-400"
              size={22}
            />
          </button>

          <button
            className="hover:scale-105 transition p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            type="button"
          >
            <MdOutlineKeyboardVoice size={22} />
          </button>

          <Button
            type="submit"
            disabled={!formState.isValid}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 flex items-center justify-center rounded-full hover:scale-105 transition"
            aria-label="Send message"
          >
            <IoArrowUp size={30} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
