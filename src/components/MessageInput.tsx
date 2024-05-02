import { useState, useRef, useEffect } from "react";

const MAX_HEIGHT = 300;

type MessageInputProps = {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
};

const MessageInput = ({ onSubmit, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.height = "auto";
    if (ref.current.scrollHeight > MAX_HEIGHT) {
      ref.current.style.height = `${MAX_HEIGHT}px`;
    } else {
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [message]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    {
      const formEvent = e as React.FormEvent<HTMLFormElement>;
      formEvent.preventDefault();
      if (message.trim() === "") return;
      onSubmit(message);
      setMessage("");
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() === "") return;
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <textarea
        ref={ref}
        value={message}
        rows={1}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="Type your message..."
        className="block resize-none max-h-[10rem] border rounded shadow px-4 pt-2 focus:outline-none sm:w-full text-wrap"
      />
      <button
        className={`mx-2 px-2 py-2 border rounded transition duration-200 hover:bg-slate-100 ${
          isLoading ? "bg-gray-300 text-gray-500 hover:bg-gray-300" : ""
        }`}
        disabled={isLoading}
        type="submit"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
