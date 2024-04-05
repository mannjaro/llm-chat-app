import { useState } from "react";
import { useAuth } from "../hooks/cognito";
export type Message = {
  role: "user" | "assistant";
  content: string;
};
function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { jwt } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") return;
    setIsGenerating(true);
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    console.log(jwt);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
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
      const chunks = lines
        .split("data: ")
        .map((line) => line.trim())
        .filter((s) => s);
      for (const chunk of chunks) {
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
              return (
                <div
                  style={{
                    background: "darkgray",
                    color: "white",
                    borderRadius: "5px",
                  }}
                  key={i}
                >
                  {message.content}
                </div>
              );
            }
            // AI Message
            return (
              <div
                style={{
                  background: "lightgreen",
                  color: "black",
                  borderRadius: "5px",
                }}
                key={i}
              >
                {message.content}
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="button" disabled={isGenerating} type="submit">
          {isGenerating ? "Generating..." : "Send"}
        </button>
      </form>
    </>
  );
}

export default ChatWindow;
