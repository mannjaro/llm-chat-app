import { decode } from "hono/jwt";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/cognito";

import type { JwtPayload } from "../hooks/cognito";

export type Message = {
  role: "user" | "assistant";
  content: string;
};
function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { jwt, fetchSession } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea !== null) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") return;
    const token: { payload: JwtPayload } = decode(jwt);
    if (Math.floor(Date.now() / 1000) > token.payload.exp) {
      try {
        fetchSession();
      } catch (e) {
        console.log(e);
        return;
      }
    }

    setIsGenerating(true);
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ message, messages }),
    });
    const reader = await response.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setIsGenerating(false);
        return;
      }
      if (!value) continue;
      const lines = decoder.decode(value);
      for (const chunk of lines) {
        setMessages((messages) => {
          const content = messages[messages.length - 1].content;
          return [
            ...messages.slice(0, -1),
            { role: "assistant", content: content + chunk },
          ];
        });
      }
    }
  };
  return (
    <>
      <div>
        <div>
          {messages.map((message, i) => {
            if (message.role === "user") {
              // User Message
              return <div className="">{message.content}</div>;
            }
            // AI Message
            return (
              <div key={i} className="">
                {message.content}
              </div>
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-full max-w-xl">
        <form className="flex" onSubmit={handleSubmit}>
          <textarea
            ref={textAreaRef}
            value={message}
            rows={1}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="block resize-none max-h-[10rem] w-full border rounded shadow px-4 py-2 focus:outline-none"
          />
          <button
            className={`mx-2 px-2 py-2 border rounded transition duration-200 hover:bg-slate-100 ${
              isGenerating ? "bg-gray-300 text-gray-500 hover:bg-gray-300" : ""
            }`}
            disabled={isGenerating}
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatWindow;
