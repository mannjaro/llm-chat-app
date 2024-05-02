import useSubmitMessage from "../hooks/useSubmitMessage";
import MessageInput from "./MessageInput";

export type Message = {
  role: "user" | "assistant";
  content: string;
};
function ChatWindow() {
  const { submitMessage, messages, isGenerating } = useSubmitMessage();

  const handleSubmit = async (message: string) => {
    if (message === "") return;
    await submitMessage(message, messages);
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
            // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
            return <div className="">{message.content}</div>;
          })}
        </div>
      </div>
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 md:max-w-xl sm:w-3/4">
        <MessageInput onSubmit={handleSubmit} isLoading={isGenerating} />
      </div>
    </>
  );
}

export default ChatWindow;
