import { useState } from "react";
import { decode } from "hono/jwt";
import { useAuth } from "./cognito";
import type { JwtPayload } from "./cognito";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const useSubmitMessage = () => {
  const { jwt, fetchSession } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const submitMessage = async (message: string, messages: Message[]) => {
    const token: { payload: JwtPayload } = decode(jwt);

    if (Math.floor(Date.now() / 1000) > token.payload.exp) {
      try {
        await fetchSession();
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

  return { submitMessage, messages, isGenerating };
};

export default useSubmitMessage;
